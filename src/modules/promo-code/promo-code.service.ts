import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromoDto } from './dto/create-promo-code.dto';
import { UpdatePromoDto } from './dto/update-promo-code.dto';

@Injectable()
export class PromoService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreatePromoDto) {
        const key = await this.generatePromoCode();
        return this.prisma.promoCode.create({ data: { ...dto, secretKey: key } });
    }

    async findAll() {
        return await this.prisma.promoCode.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: true },
        });
    }

    async findOne(id: string) {
        return await this.prisma.promoCode.findFirst({
            where: { userId: id },
            include: { user: true },
        });
    }

    async update(id: string, dto: UpdatePromoDto) {
        return await this.prisma.promoCode.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        return await this.prisma.promoCode.delete({ where: { id } });
    }

    async applyPromoCode(promoCode: string, userId: string) {
        const promo = await this.prisma.promoCode.findUnique({
            where: { id: promoCode },
            select: {
                id: true,
                bonusDays: true,
            },
        });

        const findUser = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                countTrariff: true,
            },
        });

        const userDays = findUser?.countTrariff ? findUser.countTrariff : 0;
        const promoDays = promo?.bonusDays ? promo.bonusDays : 0;

        if (!promo) {
            throw new Error('Invalid or expired promo code');
        }

        const isUsed = await this.prisma.promoUserCode.findFirst({
            where: {
                userId: userId,
                promoCodeId: promo.id,
            },
        });

        if (!isUsed) {
            throw new BadRequestException('This promoCode already used!!!');
        }

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                countTrariff: userDays + promoDays,
                startinglDateLimit: new Date(),
            },
        });

        return { message: 'Promo code applied successfully', promo };
    }

    private async generatePromoCode(length = 6) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}
