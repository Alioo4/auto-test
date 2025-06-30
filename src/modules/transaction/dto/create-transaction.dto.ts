import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
    @ApiProperty({ example: 'uuid', description: 'This is tariff Id!!!' })
    @IsString()
    @IsNotEmpty()
    tariffId: string;

    @ApiProperty({ example: 'uuid', description: 'This is promocode Id!!!' })
    @IsString()
    @IsOptional()
    promocodeId: string;
}
