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

@ApiTags('Tariffs')
@ApiBearerAuth()
@Controller('tariffs')
export class TariffController {
    constructor(private readonly tariffService: TariffService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new tariff' })
    @ApiCreatedResponse({ description: 'Tariff successfully created' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    create(@Body() dto: CreateTariffDto) {
        return this.tariffService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tariffs' })
    @ApiOkResponse({ description: 'List of all tariffs' })
    findAll() {
        return this.tariffService.findAll();
    }

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
    update(@Param('id') id: string, @Body() dto: UpdateTariffDto) {
        return this.tariffService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete tariff by ID' })
    @ApiOkResponse({ description: 'Tariff deleted' })
    @ApiNotFoundResponse({ description: 'Tariff not found' })
    remove(@Param('id') id: string) {
        return this.tariffService.remove(id);
    }
}
