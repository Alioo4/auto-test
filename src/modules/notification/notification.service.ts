import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: NotificationDto) {
        const notification = await this.prisma.notification.create({
            data: {
                title: dto.title,
                body: dto.body,
                titleRu: dto.titleRu,
                bodyRu: dto.titleRu,
                imageUrl: dto.imageUrl,
                link: dto.link,
            },
        });

        return { data: notification };
    }

    async findAll() {
        const data = await this.prisma.notification.findMany({
            where: { isActive: true },
            select: {
                id: true,
                title: true,
                body: true,
                titleRu: true,
                bodyRu: true,
                imageUrl: true,
                link: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return { data };
    }

    async findOne(id: string) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException(`Notification with id ${id} not found`);
        }

        return { data: notification };
    }

    async remove(id: string) {
        const notification = await this.prisma.notification.findUnique({ where: { id } });

        if (!notification) {
            throw new NotFoundException(`Notification with id ${id} not found`);
        }

        const data = this.prisma.notification.update({
            where: { id },
            data: { isActive: false },
        });

        return { data: { id, message: 'Notification successfully deleted' } };
    }
}
