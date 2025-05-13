import { Injectable } from '@nestjs/common';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionDto) {
    return await this.prisma.question.create({
      data: {
        question_uz: dto.question_uz,
        question_ru: dto.question_ru,
        question_en: dto.question_en,
        questionSetNumber: dto.questionSetNumber,
        testNumber: dto.testNumber,
        imgUrl: dto.imgUrl,
      },
    });
  }

  async findAll(query: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
  
    return await this.prisma.question.findMany({
      where: search
        ? {
            OR: [
              { question_uz: { contains: search, mode: 'insensitive' } },
              { question_ru: { contains: search, mode: 'insensitive' } },
              { question_en: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        optionsUz: true,
        optionsRu: true,
        optionsEn: true,
      },
    });
  }  

  async findOne(id: number) {
    return await this.prisma.question.findUnique({
      where: { id },
      include: { optionsUz: true, optionsRu: true, optionsEn: true },
    });
  }

  async update(id: number, dto: UpdateQuestionDto) {
    return await this.prisma.question.update({
      where: { id },
      data: {
        question_uz: dto.question_uz,
        question_ru: dto.question_ru,
        question_en: dto.question_en,
        questionSetNumber: dto.questionSetNumber,
        testNumber: dto.testNumber,
        imgUrl: dto.imgUrl,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.question.delete({ where: { id } });
  }
}
