import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class BannerService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateBannerDto) {
        return await this.prisma.banner.create({ data: dto });
    }

    async findAll() {
        return await this.prisma.banner.findMany({ where: { isActive: true, isBlocked: false } });
    }

    async findOne(id: string) {
        const banner = await this.prisma.banner.findUnique({ where: { id } });
        if (!banner) throw new NotFoundException('Banner not found');
        return banner;
    }

    async update(id: string, dto: UpdateBannerDto) {
        const exists = await this.prisma.banner.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException('Banner not found');

        return await this.prisma.banner.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        const exists = await this.prisma.banner.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException('Banner not found');

        return await this.prisma.banner.delete({ where: { id } });
    }
}
