import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NotificationDto } from './dto/create-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    @ApiOperation({ summary: 'Yangi notification yaratish' })
    @ApiResponse({ status: 201, description: 'Notification yaratildi', type: NotificationDto })
    create(@Body() createNotificationDto: NotificationDto) {
        return this.notificationService.create(createNotificationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Barcha notificationlarni olish' })
    @ApiResponse({ status: 200, description: 'Notificationlar ro‘yxati', type: [NotificationDto] })
    findAll() {
        return this.notificationService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Bitta notificationni olish' })
    @ApiParam({ name: 'id', type: 'string', description: 'Notification UUID' })
    @ApiResponse({ status: 200, description: 'Notification topildi', type: NotificationDto })
    @ApiResponse({ status: 404, description: 'Notification topilmadi' })
    findOne(@Param('id') id: string) {
        return this.notificationService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Notificationni o‘chirish' })
    @ApiParam({ name: 'id', type: 'string', description: 'Notification UUID' })
    @ApiResponse({ status: 200, description: 'Notification o‘chirildi' })
    @ApiResponse({ status: 404, description: 'Notification topilmadi' })
    remove(@Param('id') id: string) {
        return this.notificationService.remove(id);
    }
}
