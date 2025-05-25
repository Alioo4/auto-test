import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ example: 'Welcome Banner' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'This is the main banner on homepage.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/banner.jpg' })
  @IsString()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsString()
  @IsUrl()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateBannerDto extends CreateBannerDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;
}

export class BannerResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiPropertyOptional() description?: string;
  @ApiPropertyOptional() imageUrl?: string;
  @ApiPropertyOptional() link?: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() isBlocked: boolean;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

