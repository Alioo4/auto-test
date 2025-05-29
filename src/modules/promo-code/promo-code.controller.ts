import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PromoService } from './promo-code.service';
import { CreatePromoDto } from './dto/create-promo-code.dto';
import { UpdatePromoDto } from './dto/update-promo-code.dto';

@ApiTags('Promo Code')
@ApiBearerAuth()
@Controller('promo')
export class PromoController {
    constructor(private readonly promoService: PromoService) {}

    @Post()
    @ApiOperation({ summary: 'Create new promo code' })
    @ApiCreatedResponse({ description: 'Promo code created' })
    create(@Body() dto: CreatePromoDto) {
        return this.promoService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all promo codes' })
    findAll() {
        return this.promoService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get promo code by ID' })
    findOne(@Param('id') id: string) {
        return this.promoService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update promo code by ID' })
    update(@Param('id') id: string, @Body() dto: UpdatePromoDto) {
        return this.promoService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete promo code by ID' })
    remove(@Param('id') id: string) {
        return this.promoService.remove(id);
    }
}
