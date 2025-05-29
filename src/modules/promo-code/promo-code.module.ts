import { Module } from '@nestjs/common';
import { PromoController } from './promo-code.controller';
import { PromoService } from './promo-code.service';

@Module({
  controllers: [PromoController],
  providers: [PromoService],
})
export class PromoCodeModule {}
