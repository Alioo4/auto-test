import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards';
import { PromoCodeModule } from '../promo-code/promo-code.module';

@Module({
    imports: [JwtModule.register({}), PromoCodeModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: 'APP_GUARD',
            useClass: AuthGuard,
        },
    ],
})
export class AuthModule {}
