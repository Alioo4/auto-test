import { Injectable } from '@nestjs/common';
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

    findAll() {
        return this.prisma.promoCode.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: true },
        });
    }

    findOne(id: string) {
        return this.prisma.promoCode.findFirst({
            where: { userId: id },
            include: { user: true },
        });
    }

    update(id: string, dto: UpdatePromoDto) {
        return this.prisma.promoCode.update({ where: { id }, data: dto });
    }

    remove(id: string) {
        return this.prisma.promoCode.delete({ where: { id } });
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
