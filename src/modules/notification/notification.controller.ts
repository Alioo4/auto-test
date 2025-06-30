import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationDto } from './dto/create-notification.dto';
import { Roles, User } from '../auth/guards';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    @ApiOperation({ summary: 'Yangi notification yaratish' })
    @ApiResponse({ status: 201, description: 'Notification yaratildi', type: NotificationDto })
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(@Body() createNotificationDto: NotificationDto) {
        return this.notificationService.create(createNotificationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Barcha notificationlarni olish' })
    @ApiResponse({ status: 200, description: 'Notificationlar ro‘yxati', type: [NotificationDto] })
    @Roles('ADMIN', 'SUPER_ADMIN', 'USER')
    findAll(@User('sub') userId: string) {
        return this.notificationService.findAll(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Bitta notificationni olish' })
    @ApiParam({ name: 'id', type: 'string', description: 'Notification UUID' })
    @ApiResponse({ status: 200, description: 'Notification topildi', type: NotificationDto })
    @ApiResponse({ status: 404, description: 'Notification topilmadi' })
    @Roles('ADMIN', 'SUPER_ADMIN', 'USER')
    findOne(@Param('id') id: string) {
        return this.notificationService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Notificationni o‘chirish' })
    @ApiParam({ name: 'id', type: 'string', description: 'Notification UUID' })
    @ApiResponse({ status: 200, description: 'Notification o‘chirildi' })
    @ApiResponse({ status: 404, description: 'Notification topilmadi' })
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(@Param('id') id: string) {
        return this.notificationService.remove(id);
    }
}
