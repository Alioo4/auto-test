import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { timezoneOffsetMiddleware } from '../utils';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        this.$use(timezoneOffsetMiddleware);
        await this.$disconnect();
    }

    async runInTransaction<T>(
        callback: (
            prisma: Omit<
                PrismaClient,
                '$on' | '$connect' | '$disconnect' | '$use' | '$transaction' | '$extends'
            >
        ) => Promise<T>
    ): Promise<T> {
        return await this.$transaction(async (tx) => {
            return callback(tx);
        });
    }
}
