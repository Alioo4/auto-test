import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetQuestionsQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page (max 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'capital', description: 'Search by question text' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 3, description: 'Test number filter' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  testNumber?: number;

  @ApiPropertyOptional({ example: 2, description: 'Question set number filter' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  questionSetNumber?: number;
}
