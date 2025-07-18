import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { CheckClickSignatureDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ClickAction, ClickError, sendMessage } from '../utils';
import { PaymentType, TransactionStatus } from '@prisma/client';

@Injectable()
export class ClickPayService {
    constructor(private readonly prisma: PrismaService) {}
    async prepare(body: any) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: body.merchant_trans_id },
            select: {
                id: true,
                userId: true,
                prepareId: true,
                tariffId: true,
            },
        });

        if (!transaction) {
            return this.errorResponse(ClickError.TransactionNotFound, 'Transaction not found');
        }

        const tariff = await this.prisma.tariff.findUnique({
            where: { id: transaction.tariffId },
            select: { price: true },
        });

        if (!tariff) {
            return this.errorResponse(ClickError.TransactionNotFound, 'Tariff not found');
        }

        const check = await this.checkClickSignature({
            click_trans_id: body.click_trans_id,
            service_id: body.service_id,
            merchant_trans_id: body.merchant_trans_id,
            amount: body.amount,
            action: body.action,
            merchant_prepare_id: transaction.prepareId ?? undefined,
            sign_time: body.sign_time,
            sign_string: body.sign_string,
        });

        if (!check) {
            return this.errorResponse(ClickError.SignFailed, 'Invalid sign');
        }

        if (body.action !== ClickAction.Prepare) {
            return this.errorResponse(ClickError.ActionNotFound, 'Action not found');
        }

        const isAlreadyPaid = await this.prisma.transaction.count({
            where: {
                id: body.merchant_trans_id,
                userId: transaction.userId,
                status: TransactionStatus.Paid,
                paymentType: PaymentType.CLICK,
            },
        });

        if (isAlreadyPaid) {
            return this.errorResponse(ClickError.AlreadyPaid, 'Already paid');
        }

        const userExists = await this.prisma.user.count({
            where: { id: transaction.userId },
        });

        if (!userExists) {
            return this.errorResponse(ClickError.UserNotFound, 'User not found');
        }

        if (+body.amount !== tariff.price) {
            return this.errorResponse(ClickError.InvalidAmount, 'Incorrect parameter amount');
        }

        const prepareId = Date.now();

        await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                clickTransId: body.click_trans_id,
                status: TransactionStatus.Pending,
                prepareId: prepareId,
                paymentType: PaymentType.CLICK,
                amount: Number(body.amount),
            },
        });

        return {
            click_trans_id: BigInt(body.click_trans_id),
            merchant_trans_id: body.merchant_trans_id,
            merchant_prepare_id: prepareId,
            error: ClickError.Success,
            error_note: 'Success',
        };
    }

    async complete(dto: any) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: dto.merchant_trans_id },
            select: { id: true, userId: true, prepareId: true, tariffId: true, deviceId: true },
        });

        if (!transaction) {
            return { error: ClickError.TransactionNotFound, error_note: 'Transaction not found' };
        }

        const [tariff, user, isPrepared, isAlreadyPaid] = await Promise.all([
            this.prisma.tariff.findUnique({
                where: { id: transaction.tariffId },
                select: { price: true, day: true },
            }),
            this.prisma.user.findUnique({
                where: { id: transaction.userId },
                select: { countTrariff: true, endingDateTariff: true },
            }),
            this.prisma.transaction.count({
                where: {
                    prepareId: dto.merchant_prepare_id,
                    paymentType: PaymentType.CLICK,
                },
            }),
            this.prisma.transaction.count({
                where: {
                    id: transaction.id,
                    userId: transaction.userId,
                    status: TransactionStatus.Paid,
                    paymentType: PaymentType.CLICK,
                },
            }),
        ]);

        if (!tariff) {
            return this.errorResponse(ClickError.TransactionNotFound, 'Tariff not found');
        }

        if (!user) {
            return { error: ClickError.UserNotFound, error_note: 'User not found' };
        }

        if (!isPrepared) {
            return { error: ClickError.TransactionNotFound, error_note: 'Transaction not found' };
        }

        if (isAlreadyPaid) {
            return { error: ClickError.AlreadyPaid, error_note: 'Already paid for course' };
        }

        if (Number(dto.amount) !== tariff.price) {
            return { error: ClickError.InvalidAmount, error_note: 'Incorrect parameter amount' };
        }

        const check = await this.checkClickSignature({
            click_trans_id: dto.click_trans_id,
            service_id: dto.service_id,
            merchant_trans_id: dto.merchant_trans_id,
            amount: dto.amount,
            action: dto.action,
            merchant_prepare_id: transaction.prepareId ?? undefined,
            sign_time: dto.sign_time,
            sign_string: dto.sign_string,
        });

        if (!check) {
            return { error: ClickError.SignFailed, error_note: 'Invalid sign' };
        }

        if (dto.action !== ClickAction.Complete) {
            return { error: ClickError.ActionNotFound, error_note: 'Action not found' };
        }

        if (dto.error < 0) {
            await this.prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: TransactionStatus.PaidCanceled,
                    cancelTime: new Date(),
                },
            });
            return { error: ClickError.TransactionNotFound, error_note: 'Transaction not found' };
        }

        const now = new Date();
        const currentEndingDate =
            user.endingDateTariff && user.endingDateTariff > now ? user.endingDateTariff : now;

        const newEndingDateTariff = new Date(currentEndingDate);
        newEndingDateTariff.setDate(
            newEndingDateTariff.getDate() + (tariff.day ?? 0) + (user?.countTrariff ?? 0)
        );

        await Promise.all([
            this.prisma.user.update({
                where: { id: transaction.userId },
                data: {
                    countTrariff: (user.countTrariff ?? 0) + (tariff.day ?? 0),
                    endingDateTariff: newEndingDateTariff,
                    isPaid: true,
                    accessDevice: transaction.deviceId,
                },
            }),
            this.prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: TransactionStatus.Paid },
            }),
        ]);

        return {
            click_trans_id: BigInt(dto.click_trans_id),
            merchant_trans_id: dto.merchant_trans_id,
            merchant_confirm_id: Date.now(),
            error: ClickError.Success,
            error_note: 'Success',
        };
    }

    async checkClickSignature(data: CheckClickSignatureDto) {
        const {
            click_trans_id,
            service_id,
            merchant_prepare_id,
            merchant_trans_id,
            amount,
            action,
            sign_time,
            sign_string,
        } = data;

        const clickSercretKey = process.env.CLICK_SECRET_KEY || '';
        const prepareId = merchant_prepare_id || '';
        const signature = `${click_trans_id}${service_id}${clickSercretKey}${merchant_trans_id}${prepareId}${amount}${action}${sign_time}`;
        const signatureHash = crypto.createHash('md5').update(signature).digest('hex');

        console.log(signatureHash === sign_string);

        return signatureHash === sign_string;
    }

    private errorResponse(error: number, message: string) {
        return {
            click_trans_id: 0,
            merchant_trans_id: '',
            merchant_prepare_id: 0,
            error,
            error_note: message,
        };
    }
}
