import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({ example: 'UUID', description: 'Notificationning unikal identifikatori' })
  id: string;

  @ApiProperty({ example: 'Yangi aksiyalar', maxLength: 255 })
  title: string;

  @ApiProperty({ example: 'Aksiya faqat bugun amal qiladi!', maxLength: 512 })
  body: string;

  @ApiProperty({ example: 'Новые акции', required: false, maxLength: 255 })
  titleRu?: string;

  @ApiProperty({ example: 'Акция действует только сегодня!', required: false, maxLength: 512 })
  bodyRu?: string;

  @ApiProperty({ example: 'https://cdn.site.com/img.png', required: false, maxLength: 128 })
  imageUrl?: string;

  @ApiProperty({ example: 'https://your-site.com/offer', required: false, maxLength: 128 })
  link?: string;

  @ApiProperty({ example: true, default: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-06-21T12:00:00Z', description: 'Yaratilgan vaqt' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-21T13:00:00Z', description: 'Oxirgi yangilangan vaqt' })
  updatedAt: Date;
}
