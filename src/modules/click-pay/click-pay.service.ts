import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { CheckClickSignatureDto, CompleteClickPayDto, PrepareClickPayDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ClickAction, ClickError } from '../utils';
import { PaymentType, TransactionStatus } from '@prisma/client';

@Injectable()
export class ClickPayService {
    constructor(private readonly prisma: PrismaService) {}
    async prepare(body: any) {
        console.log(body);
        
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: body.merchant_trans_id },
            select: {
                id: true,
                userId: true,
                prepareID: true,
                tariffId: true,
            },
        });

        if (!transaction) {
            console.log(transaction);
            return { error: ClickError.TransactionNotFound, error_note: 'Transaction not found' };
        }   

        const findTarif = await this.prisma.tariff.findUnique({
            where: { id: transaction.tariffId },
            select: {
                price: true,
            },
        });

        console.log(findTarif);
        

        const checkData = {
            click_trans_id: body.click_trans_id,
            service_id: body.service_id,
            merchant_trans_id: body.merchant_trans_id,
            amount: body.amount,
            action: body.action,
            merchant_prepare_id: transaction.prepareID ?? undefined,
            sign_time: body.sign_time,
            sign_string: body.sign_string,
        };

        console.log(checkData);
        

        const check = await this.checkClickSignature(checkData);

        if (!check) {
            return { error: ClickError.SignFailed, error_note: 'Invalid sign' };
        }

        if (body.action !== ClickAction.Prepare) {
            return { error: ClickError.ActionNotFound, error_note: 'Action not found' };
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
            return { error: ClickError.AlreadyPaid, error_note: 'Already paid' };
        }

        const user = await this.prisma.user.count({ where: { id: transaction.userId } });

        if (!user) {
            return { error: ClickError.UserNotFound, error_note: 'User not found' };
        }

        if (body.amount !== findTarif?.price) {
            return { error: ClickError.InvalidAmount, error_note: 'Incorrect parameter amount' };
        }

        const time = new Date().getTime();

        await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                clickTransId: body.click_trans_id,
                status: TransactionStatus.Pending,
                prepareID: time,
                paymentType: PaymentType.CLICK,
                amount: body.amount,
            },
        });

        return {
            click_trans_id: body.click_trans_id,
            merchant_trans_id: body.merchant_trans_id,
            merchant_prepare_id: time,
            error: ClickError.Success,
            error_note: 'Success',
        };
    }

    async complete(dto: CompleteClickPayDto) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: dto.merchant_trans_id },
            select: {
                id: true,
                userId: true,
                prepareID: true,
                tariffId: true,
            },
        });

        if (!transaction) {
            return { error: ClickError.TransactionNotFound, error_note: 'Transaction not found' };
        }

        if (!transaction) {
            return { error: ClickError.TransactionNotFound, error_note: 'Transaction not found' };
        }

        const findTarif = await this.prisma.tariff.findUnique({
            where: { id: transaction.tariffId },
            select: {
                price: true,
                day: true
            },
        });

        const checkData = {
            click_trans_id: dto.click_trans_id,
            service_id: dto.service_id,
            merchant_trans_id: dto.merchant_trans_id,
            amount: dto.amount,
            action: dto.action,
            merchant_prepare_id: transaction.prepareID ?? undefined,
            sign_time: dto.sign_time,
            sign_string: dto.sign_string,
        };

        const check = await this.checkClickSignature(checkData);

        if (!check) {
            return { error: ClickError.SignFailed, error_note: 'Invalid sign' };
        }

        if (dto.action !== ClickAction.Complete) {
            return { error: ClickError.ActionNotFound, error_note: 'Action not found' };
        }

        const user = await this.prisma.user.findUnique({ where: { id: transaction.userId }, select: {countTrariff: true} });

        if (!user) {
            return { error: ClickError.UserNotFound, error_note: 'User not found' };
        }

        const isPrepared = await this.prisma.transaction.count({
            where: {
                prepareID: dto.merchant_prepare_id,
                paymentType: PaymentType.CLICK,
            },
        });

        if (!isPrepared) {
            return { error: ClickError.TransactionNotFound, error_note: 'Transaction not found' };
        }

        const isAlreadyPaid = await this.prisma.transaction.count({
            where: {
                id: transaction.id,
                userId: transaction.userId,
                status: TransactionStatus.Paid,
                paymentType: PaymentType.CLICK,
            },
        });

        if (isAlreadyPaid) {
            return { error: ClickError.AlreadyPaid, error_note: 'Already paid for course' };
        }

        if (dto.amount !== findTarif?.price) {
            return { error: ClickError.InvalidAmount, error_note: 'Incorrect parameter amount' };
        }

        const time = new Date().getTime();

        if (dto.error < 0) {
            await this.prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: TransactionStatus.PaidCanceled, cancelTime: new Date() },
            });
            return { error: ClickError.TransactionNotFound, error_note: 'Transaction not found' };
        }

        await this.prisma.user.update({where: {id: transaction.userId}, data: {countTrariff: user.countTrariff ?? 0 + findTarif.day, isPaid: true }})

        return {
            click_trans_id: dto.click_trans_id,
            merchant_trans_id: dto.merchant_trans_id,
            merchant_confirm_id: time,
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
}
