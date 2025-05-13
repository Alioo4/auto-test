import { IsString, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOptionDto {
  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty()
  @IsInt()
  questionId: number;
}
