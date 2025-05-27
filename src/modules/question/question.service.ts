import { Injectable } from '@nestjs/common';
import { CreateQuestionDto, GetQuestionsQueryDto, UpdateQuestionDto } from './dto';
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

        const enriched = await Promise.all(
            questions.map(async (q: any) => {
                const [optionsUz, optionsRu, optionsEn] = await Promise.all([
                    this.prisma.optionsUz.findMany({ where: { questionId: q.id } }),
                    this.prisma.optionsRu.findMany({ where: { questionId: q.id } }),
                    this.prisma.optionsEn.findMany({ where: { questionId: q.id } }),
                ]);

                return {
                    ...q,
                    id: q.id?.toString?.() || q.id,
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

    async countAllQuestions() {
        const [allCount, testNumbers, setNumbers] = await Promise.all([
            this.prisma.question.count(),

            this.prisma.question.findMany({
                distinct: ['testNumber'],
                select: { testNumber: true },
            }),

            this.prisma.question.findMany({
                distinct: ['questionSetNumber'],
                select: { questionSetNumber: true },
            }),
        ]);

        return {
            data: {
                allCount,
                testNumberCount: testNumbers.length,
                questionSetNumberCount: setNumbers.length,
            },
            message: 'Total number of questions and unique test/set numbers',
            status: 'success',
        };
    }

    async findAllForAdmin(query: GetQuestionsQueryDto) {
        const MAX_LIMIT = 100;
        const safeLimit = Math.min(query.limit ?? 10, MAX_LIMIT);
        const skip = (query.page ?? 1 - 1) * safeLimit;

        const where: any = {};

        if (query.search?.trim()) {
            where.OR = [
                { question_uz: { contains: query.search, mode: 'insensitive' } },
                { question_ru: { contains: query.search, mode: 'insensitive' } },
                { question_en: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        if (query.testNumber) {
            where.testNumber = query.testNumber;
        }

        if (query.questionSetNumber) {
            where.questionSetNumber = query.questionSetNumber;
        }

        const [questions, totalCount] = await Promise.all([
            this.prisma.question.findMany({
                where,
                skip,
                take: safeLimit,
                orderBy: { id: 'desc' },
                include: {
                    optionsUz: true,
                    optionsRu: true,
                    optionsEn: true,
                },
            }),
            this.prisma.question.count({ where }),
        ]);

        return {
            data: questions,
            totalCount: totalCount,
            page: query.page,
            limit: safeLimit,
        };
    }
}
