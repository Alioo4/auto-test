import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { ApiTags, ApiParam, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/guards';

@ApiTags('options')
@ApiBearerAuth()
@Controller('options/:lang')
export class OptionsController {
    constructor(private readonly service: OptionsService) {}

    @Post()
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Create option by language' })
    @ApiParam({ name: 'lang', enum: ['uz', 'ru', 'en'] })
    create(@Param('lang') lang: string, @Body() dto: CreateOptionDto) {
        return this.service.create(lang as any, dto);
    }

    @Get()
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Get all options by language' })
    findAll(@Param('lang') lang: string) {
        return this.service.findAll(lang as any);
    }

    @Get(':id')
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Get one option by ID and language' })
    findOne(@Param('lang') lang: string, @Param('id') id: string) {
        return this.service.findOne(lang as any, +id);
    }

    @Delete(':id')
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Delete option by ID and language' })
    remove(@Param('lang') lang: string, @Param('id') id: string) {
        return this.service.remove(lang as any, +id);
    }
}
