import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyPromoDto {
    @ApiProperty({
        description: 'The promo code to apply',
        example: 'SUMMER2023',
    })
    @IsString()
    @IsNotEmpty()
    promoCode: string;
}
