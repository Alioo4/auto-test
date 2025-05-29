import { IsInt, IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePromoDto {
  @ApiProperty({ example: 'PROMO1234', maxLength: 16 })
  @IsString()
  @MaxLength(16)
  secretKey: string;

  @ApiProperty({ example: 20, description: 'Discount in %' })
  @IsInt()
  disCount: number;

  @ApiPropertyOptional({ example: 15, description: 'Extra days for user' })
  @IsOptional()
  @IsInt()
  bonusDays?: number;

  @ApiProperty({ example: 10, description: 'Agent bonus in %' })
  @IsInt()
  agentBonus: number;

  @ApiPropertyOptional({ example: 'c7f2c65f-3a25-4d20-8b5f-0a21c8c8783e' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
