import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { QuestionModule } from './modules/question/question.module';
import { OptionsModule } from './modules/options/options.module';
import { BannersModule } from './modules/banners/banners.module';
import { TariffsModule } from './modules/tariffs/tariffs.module';
import { PromoCodeModule } from './modules/promo-code/promo-code.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ClickPayModule } from './modules/click-pay/click-pay.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { PaymePayModule } from './modules/payme-pay/payme-pay.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        PrismaModule,
        UploadsModule,
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'uploads'),
            serveRoot: '/uploads',
        }),
        QuestionModule,
        OptionsModule,
        BannersModule,
        TariffsModule,
        PromoCodeModule,
        NotificationModule,
        ClickPayModule,
        TransactionModule,
        PaymePayModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
