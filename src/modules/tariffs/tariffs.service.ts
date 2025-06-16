import { Injectable } from '@nestjs/common';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TariffService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateTariffDto) {
        return await this.prisma.tariff.create({ data: dto });
    }

    async findAll() {
        return await this.prisma.tariff.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async findOne(id: string) {
        return await this.prisma.tariff.findUnique({ where: { id } });
    }

    async update(id: string, dto: UpdateTariffDto) {
        return await this.prisma.tariff.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        return await this.prisma.tariff.delete({ where: { id } });
    }
}
