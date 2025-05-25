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
            ROW_NUMBER() OVER (
            PARTITION BY "testNumber", "questionSetNumber"
            ORDER BY RANDOM()
          ) AS rn
          FROM "Question" q
            WHERE "testNumber" BETWEEN 1 AND 10
            AND "questionSetNumber" BETWEEN 1 AND 10
          ) sub
            WHERE sub.rn = 1
            ORDER BY "testNumber", "questionSetNumber";
        `);

        // 2. Har bir question uchun optionsUz / optionsRu / optionsEn olib kelish
        const enriched = await Promise.all(
            questions.map(async (q: any) => {
                const [optionsUz, optionsRu, optionsEn] = await Promise.all([
                    this.prisma.optionsUz.findMany({ where: { questionId: q.id } }),
                    this.prisma.optionsRu.findMany({ where: { questionId: q.id } }),
                    this.prisma.optionsEn.findMany({ where: { questionId: q.id } }),
                ]);

                return {
                    ...q,
                    id: q.id?.toString?.() || q.id, // bigint bo‘lsa oldini oladi
                    questionSetNumber: q.questionSetNumber,
                    testNumber: q.testNumber,
                    optionsUz: optionsUz.map((o) => ({
                        ...o,
                        id: o.id?.toString?.(),
                        questionId: o.questionId?.toString?.(),
                    })),
                    optionsRu: optionsRu.map((o) => ({
                        ...o,
                        id: o.id?.toString?.(),
                        questionId: o.questionId?.toString?.(),
                    })),
                    optionsEn: optionsEn.map((o) => ({
                        ...o,
                        id: o.id?.toString?.(),
                        questionId: o.questionId?.toString?.(),
                    })),
                };
            })
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
