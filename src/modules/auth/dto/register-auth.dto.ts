import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterAuthDto {
    @ApiProperty({
        description: 'User name',
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'User phone number',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        description: 'User email',
        example: 'example@gmail.com',
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
