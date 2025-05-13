import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class ChangingRoleDto {
    @ApiProperty({ description: 'User ID', example: 'uuid' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: 'New role', example: Role.ADMIN})
    @IsEnum(Role)
    @IsNotEmpty()
    newRole: string;
}