import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PromoService } from './promo-code.service';
import { CreatePromoDto } from './dto/create-promo-code.dto';
import { UpdatePromoDto } from './dto/update-promo-code.dto';
import { Roles, User } from '../auth/guards';
import { ApplyPromoDto } from './dto/apply-promo.dto';

@ApiTags('Promo Code')
@ApiBearerAuth()
@Controller('promo')
export class PromoController {
    constructor(private readonly promoService: PromoService) {}

    @Post()
    @ApiOperation({ summary: 'Create new promo code' })
    @ApiCreatedResponse({ description: 'Promo code created' })
    @Roles('SUPER_ADMIN', 'ADMIN')
    create(@Body() dto: CreatePromoDto) {
        return this.promoService.create(dto);
    }

    @Get('get-all-promo-codes')
    @ApiOperation({ summary: 'Get all promo codes' })
    @Roles('SUPER_ADMIN', 'ADMIN')
    findAll() {
        return this.promoService.findAll();
    }

    @Get('get-promo-code')
    @ApiOperation({ summary: 'Get promo code by ID' })
    @Roles('SUPER_ADMIN', 'ADMIN', 'USER')
    findOne(@User('sub') userId: string) {
        return this.promoService.findOne(userId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update promo code by ID' })
    @Roles('SUPER_ADMIN', 'ADMIN')
    update(@Param('id') id: string, @Body() dto: UpdatePromoDto) {
        return this.promoService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete promo code by ID' })
    @Roles('SUPER_ADMIN', 'ADMIN')
    remove(@Param('id') id: string) {
        return this.promoService.remove(id);
    }

    @Post('apply-promo-code')
    @ApiOperation({ summary: 'Apply promo code' })
    @Roles('SUPER_ADMIN', 'ADMIN', 'USER')
    applyPromoCode(@Body() promoCodeDto: ApplyPromoDto, @User('sub') userId: string) {
        return this.promoService.applyPromoCode(promoCodeDto.promoCode, userId);
    }
}
