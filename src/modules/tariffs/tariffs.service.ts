import { Injectable } from '@nestjs/common';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TariffService {
    constructor(private prisma: PrismaService) {}

    create(dto: CreateTariffDto) {
        return this.prisma.tariff.create({ data: dto });
    }

    findAll() {
        return this.prisma.tariff.findMany({ orderBy: { createdAt: 'desc' } });
    }

    findOne(id: string) {
        return this.prisma.tariff.findUnique({ where: { id } });
    }

    update(id: string, dto: UpdateTariffDto) {
        return this.prisma.tariff.update({ where: { id }, data: dto });
    }

    remove(id: string) {
        return this.prisma.tariff.delete({ where: { id } });
    }
}
