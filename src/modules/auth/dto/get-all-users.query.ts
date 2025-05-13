import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class GetAllUsersQuery {
    @ApiProperty({
        description: 'Page number for pagination',
        example: '1',
        required: false,
        default: '1',
    })
    @IsOptional()
    page?: string;

    @ApiProperty({
        description: 'Number of items per page',
        example: '10',
        required: false,
        default: '10',
    })
    @IsOptional()
    limit?: string;

    @ApiProperty({
        description: 'Search term to filter users',
        example: 'john',
        required: false,
        default: '',
    })
    @IsOptional()
    search?: string;
}
