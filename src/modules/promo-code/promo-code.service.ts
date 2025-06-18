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
        const promo = await this.prisma.promoCode.findFirst({
            where: { secretKey: promoCode },
            select: {
                id: true,
                bonusDays: true,
                userId: true,
            },
        });

        if (!promo) {
            throw new BadRequestException({
                message: 'Invalid promo code',
                code: 12,
            });
        };

        if (promo.userId !== userId) {
            throw new BadRequestException({
                message: 'This promo code is not for you',
                code: 13,
            });
        }

        const isUsed = await this.prisma.promoUserCode.findFirst({
            where: {
                userId: userId,
                promoCodeId: promo.id,
            },
        });

        if (!isUsed) {
            throw new BadRequestException({
                message: 'Promo code has already been used',
                code: 14,
            });
        }

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
