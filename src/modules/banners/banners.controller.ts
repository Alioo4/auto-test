import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BannerService } from './banners.service';
import { CreateBannerDto, UpdateBannerDto, BannerResponseDto } from './dto/create-banner.dto';
import { Public, Roles } from '../auth/guards';

@ApiTags('Banners')
@ApiBearerAuth()
@Controller('banners')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @Post()
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Create a banner' })
    @ApiResponse({ status: 201, type: BannerResponseDto })
    async create(@Body() dto: CreateBannerDto) {
        try {
            return await this.bannerService.create(dto);
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all banners' })
    @ApiResponse({ status: 200, type: [BannerResponseDto] })
    async findAll() {
        return await this.bannerService.findAll();
    }

    @Public()
    @Get(':id')
    @Roles('ADMIN', 'SUPER_ADMIN', 'USER')
    @ApiOperation({ summary: 'Get banner by ID' })
    @ApiResponse({ status: 200, type: BannerResponseDto })
    async findOne(@Param('id') id: string) {
        return await this.bannerService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Update banner' })
    @ApiResponse({ status: 200, type: BannerResponseDto })
    async update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
        return await this.bannerService.update(id, dto);
    }

    @Delete(':id')
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Delete banner' })
    @ApiResponse({ status: 200, description: 'Banner deleted' })
    async remove(@Param('id') id: string) {
        return await this.bannerService.remove(id);
    }
}
