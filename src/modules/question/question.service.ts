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
        const questions: any[] = await this.prisma.$queryRawUnsafe(`
          SELECT * FROM (
              SELECT q.*,
                     ROW_NUMBER() OVER (PARTITION BY "testNumber" ORDER BY RANDOM()) AS rn
              FROM "Question" q
              WHERE "testNumber" BETWEEN 1 AND 10
          ) sub
          WHERE sub.rn <= 10
        `);
      
        // optional: optionslarni bog‘lash
        const enriched = await Promise.all(
          questions.map(async (q: any) => ({
            ...q,
            optionsUz: await this.prisma.optionsUz.findMany({ where: { questionId: q.id } }),
            optionsRu: await this.prisma.optionsRu.findMany({ where: { questionId: q.id } }),
            optionsEn: await this.prisma.optionsEn.findMany({ where: { questionId: q.id } }),
          })),
        );
      
        return enriched;
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
