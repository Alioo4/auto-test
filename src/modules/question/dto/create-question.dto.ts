import { IsString, IsInt, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
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

    @ApiProperty({ example: 'capital.jpg', required: false, description: 'Rasm URL (ixtiyoriy)' })
    @IsOptional()
    @IsString()
    imgUrl?: string;

    @ApiProperty({
        type: [OptionDto],
        description: 'Variantlar (UZ)',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionDto)
    optionsUz: OptionDto[];

    @ApiProperty({
        type: [OptionDto],
        description: 'Variantlar (RU)',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionDto)
    optionsRu: OptionDto[];

    @ApiProperty({
        type: [OptionDto],
        description: 'Variantlar (EN)',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionDto)
    optionsEn: OptionDto[];
}

