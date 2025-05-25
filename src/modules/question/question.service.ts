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
        const questions = await this.prisma.$queryRawUnsafe(`
          SELECT q.*, uz.id AS uz_id, uz.value AS uz_value, uz.isCorrect AS uz_correct,
             ru.id AS ru_id, ru.value AS ru_value, ru.isCorrect AS ru_correct,
             en.id AS en_id, en.value AS en_value, en.isCorrect AS en_correct
FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY "testNumber" ORDER BY RANDOM()) AS rn
  FROM "Question"
  WHERE "testNumber" BETWEEN 1 AND 10
) q
LEFT JOIN "options_uz" uz ON uz."questionId" = q.id
LEFT JOIN "options_ru" ru ON ru."questionId" = q.id
LEFT JOIN "options_en" en ON en."questionId" = q.id
WHERE q.rn <= 10
        `);

        return {
            data: questions,
        };
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
