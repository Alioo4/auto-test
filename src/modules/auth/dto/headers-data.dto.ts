import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class HeadersDataDto {
  @ApiProperty({ description: 'Operating system (e.g., Android, iOS)', example: 'iOS' })
  @IsString()
  @IsNotEmpty()
  os: string;

  @ApiPropertyOptional({ description: 'Operating system version (e.g., 13.0.1)', example: '16.4.1' })
  @IsString()
  @IsOptional()
  osVersion: string;

  @ApiProperty({ description: 'Unique device identifier', example: 'a1b2c3d4e5f6g7h8' })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiPropertyOptional({ description: 'Device name (e.g., iPhone 13 Pro)', example: 'iPhone 13 Pro' })
  @IsString()
  @IsOptional()
  deviceName: string;

  @ApiPropertyOptional({ description: 'Push notification token', example: 'fcm_token_123456' })
  @IsString()
  @IsOptional()
  deviceToken: string;

  @ApiPropertyOptional({ description: 'Device manufacturer (e.g., Apple, Samsung)', example: 'Apple' })
  @IsString()
  @IsOptional()
  manufacturer: string;

  @ApiPropertyOptional({ description: 'Device model (e.g., SM-G991B)', example: 'A2633' })
  @IsString()
  @IsOptional()
  model: string;

  @ApiPropertyOptional({ description: 'Application version (e.g., 1.0.0)', example: '1.5.2' })
  @IsString()
  @IsOptional()
  appVersion: string;

  @ApiPropertyOptional({ description: 'Application build number', example: '152' })
  @IsString()
  @IsOptional()
  appBuild: string;

  @ApiPropertyOptional({ description: 'Application name', example: 'MyMobileApp' })
  @IsString()
  @IsOptional()
  appName: string;

  @ApiPropertyOptional({ description: 'App version code (internal use)', example: '1052' })
  @IsString()
  @IsOptional()
  appVersionCode: string;

  @ApiPropertyOptional({ description: 'App version name (user visible)', example: '1.5.2-beta' })
  @IsString()
  @IsOptional()
  appVersionName: string;
}
