import {
  Controller, Post, Get, Param, Delete, Body
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { ApiTags, ApiParam, ApiOperation } from '@nestjs/swagger';

@ApiTags('Options')
@Controller('options/:lang') // ex: /options/uz
export class OptionsController {
  constructor(private readonly service: OptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create option by language' })
  @ApiParam({ name: 'lang', enum: ['uz', 'ru', 'en'] })
  create(@Param('lang') lang: string, @Body() dto: CreateOptionDto) {
    return this.service.create(lang as any, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all options by language' })
  findAll(@Param('lang') lang: string) {
    return this.service.findAll(lang as any);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one option by ID and language' })
  findOne(@Param('lang') lang: string, @Param('id') id: string) {
    return this.service.findOne(lang as any, +id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete option by ID and language' })
  remove(@Param('lang') lang: string, @Param('id') id: string) {
    return this.service.remove(lang as any, +id);
  }
}
