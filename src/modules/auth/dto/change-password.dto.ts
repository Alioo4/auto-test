import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({description: 'Old password', example: 'oldPassword123'})
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty({description: 'New password', example: 'newPassword123'})
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
