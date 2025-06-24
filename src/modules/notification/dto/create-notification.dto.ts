import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class NotificationDto {
  @ApiProperty({
    example: 'New Promotions',
    description: 'Title of the notification in English',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'This promotion is only valid today!',
    description: 'Body message of the notification in English',
    maxLength: 512,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  body: string;

  @ApiProperty({
    example: 'Новые акции',
    description: 'Title of the notification in Russian',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleRu?: string;

  @ApiProperty({
    example: 'Акция действует только сегодня!',
    description: 'Body message of the notification in Russian',
    required: false,
    maxLength: 512,
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  bodyRu?: string;

  @ApiProperty({
    example: 'https://cdn.site.com/image.png',
    description: 'Optional image URL associated with the notification',
    required: false,
    maxLength: 128,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(128)
  imageUrl?: string;

  @ApiProperty({
    example: 'https://your-site.com/offer',
    description: 'Optional URL to redirect users when they click on the notification',
    required: false,
    maxLength: 128,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(128)
  link?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the notification is active',
    default: true,
  })
  @IsBoolean()
  isActive: boolean;
}
