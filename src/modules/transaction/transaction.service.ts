import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
    constructor(private readonly prisma: PrismaService) {}
    async create(createTransactionDto: CreateTransactionDto, userId: string, deviceId: string) {
        const transaction = await this.prisma.transaction.create({
            data: {
                tariffId: createTransactionDto.tariffId,
                promocodeId: createTransactionDto.promocodeId,
                userId: userId,
                deviceId: deviceId,
            },
            select: { id: true },
        });

        return {
            transactionId: transaction.id,
        };
    }
}
