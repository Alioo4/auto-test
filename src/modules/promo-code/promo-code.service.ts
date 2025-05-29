import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromoDto } from './dto/create-promo-code.dto';
import { UpdatePromoDto } from './dto/update-promo-code.dto';

@Injectable()
export class PromoService {
    constructor(private prisma: PrismaService) {}

    create(dto: CreatePromoDto) {
        return this.prisma.promoCode.create({ data: dto });
    }

    findAll() {
        return this.prisma.promoCode.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: true },
        });
    }

    findOne(id: string) {
        return this.prisma.promoCode.findUnique({
            where: { id },
            include: { user: true },
        });
    }

    update(id: string, dto: UpdatePromoDto) {
        return this.prisma.promoCode.update({ where: { id }, data: dto });
    }

    remove(id: string) {
        return this.prisma.promoCode.delete({ where: { id } });
    }
}
