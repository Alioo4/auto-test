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

    async findAll() {
        return await this.prisma.question.findMany({
            take: 100,
            orderBy: { createdAt: 'asc' },
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
