import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TariffService } from './tariffs.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import {
    ApiTags,
    ApiOperation,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { Public, Roles } from '../auth/guards';

@ApiTags('Tariffs')
@ApiBearerAuth()
@Controller('tariffs')
export class TariffController {
    constructor(private readonly tariffService: TariffService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new tariff' })
    @ApiCreatedResponse({ description: 'Tariff successfully created' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    @Roles('SUPER_ADMIN', 'ADMIN')
    create(@Body() dto: CreateTariffDto) {
        return this.tariffService.create(dto);
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all tariffs' })
    @ApiOkResponse({ description: 'List of all tariffs' })
    findAll() {
        return this.tariffService.findAll();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get tariff by ID' })
    @ApiOkResponse({ description: 'Tariff found' })
    @ApiNotFoundResponse({ description: 'Tariff not found' })
    findOne(@Param('id') id: string) {
        return this.tariffService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update tariff by ID' })
    @ApiOkResponse({ description: 'Tariff updated successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    @Roles('SUPER_ADMIN', 'ADMIN')
    update(@Param('id') id: string, @Body() dto: UpdateTariffDto) {
        return this.tariffService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete tariff by ID' })
    @ApiOkResponse({ description: 'Tariff deleted' })
    @ApiNotFoundResponse({ description: 'Tariff not found' })
    @Roles('SUPER_ADMIN', 'ADMIN')
    remove(@Param('id') id: string) {
        return this.tariffService.remove(id);
    }
}
