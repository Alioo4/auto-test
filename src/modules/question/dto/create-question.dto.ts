import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OptionDto {
    @ApiProperty({ example: 'Toshkent', description: 'Variant matni' })
    @IsString()
    value: string;
  
    @ApiProperty({ example: true, required: false, description: 'To‘g‘ri javobmi' })
    @IsOptional()
    @IsBoolean()
    isCorrect?: boolean;
  }

export class CreateQuestionDto {
    @ApiProperty({ example: 'Poytaxti qaysi shahar?', description: 'Savol (UZ)' })
    @IsString()
    question_uz: string;

    @ApiProperty({ example: 'Какой город является столицей?', description: 'Savol (RU)' })
    @IsString()
    question_ru: string;

    @ApiProperty({ example: 'Which city is the capital?', description: 'Savol (EN)' })
    @IsString()
    question_en: string;

    @ApiProperty({ example: 1, description: 'Savollar to‘plami raqami' })
    @IsInt()
    questionSetNumber: number;

    @ApiProperty({ example: 1, description: 'Test tartib raqami' })
    @IsInt()
    testNumber: number;

    @ApiProperty({ description: 'Comment in question' })
    @IsString()
    @IsOptional()
    comment?: string;

    @ApiProperty({ description: 'Expert comment in question' })
    @IsString()
    @IsOptional()
    expertComment?: string;

    @ApiProperty({ description: 'Comment in question (RU)', required: false })
    @IsString()
    @IsOptional()
    commentRu?: string;

    @ApiProperty({ description: 'Expert comment in question (RU)', required: false })
    @IsString()
    @IsOptional()
    expertCommentRu?: string;

    @ApiProperty({ example: 'capital.jpg', required: false, description: 'Rasm URL (ixtiyoriy)' })
    @IsOptional()
    @IsString()
    imgUrl?: string;
}

