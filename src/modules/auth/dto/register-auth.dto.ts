import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterAuthDto {
    @ApiProperty({
        description: 'User name',
        example: 'John Doe',
    })
    @IsString()
    @IsOptional()
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
    @IsOptional()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
