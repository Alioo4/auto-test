import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
    @ApiProperty({
        description: 'User phone number',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
