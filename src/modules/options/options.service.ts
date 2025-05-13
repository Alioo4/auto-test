import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { OptionLanguage } from './types/option-language.type';
import { PrismaService } from '../prisma/prisma.service';
import { OptionModel } from './types/prisma.types';

@Injectable()
export class OptionsService {
  constructor(private prisma: PrismaService) {}

  private getModel(lang: OptionLanguage): OptionModel {
    switch (lang) {
      case 'uz': return this.prisma.optionsUz;
      case 'ru': return this.prisma.optionsRu;
      case 'en': return this.prisma.optionsEn;
      default: throw new NotFoundException('Unknown language');
    }
  }

  async create(lang: OptionLanguage, dto: CreateOptionDto) {
    return await this.getModel(lang).create({ data: dto });
  }
  
  async findAll(lang: OptionLanguage) {
    return await this.getModel(lang).findMany();
  }

  async findOne(lang: OptionLanguage, id: number) {
    return await this.getModel(lang).findUnique({ where: { id } });
  }

  async remove(lang: OptionLanguage, id: number) {
    return await this.getModel(lang).delete({ where: { id } });
  }
}
