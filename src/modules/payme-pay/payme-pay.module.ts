import { Module } from '@nestjs/common';
import { PaymePayService } from './payme-pay.service';
import { PaymePayController } from './payme-pay.controller';

@Module({
  controllers: [PaymePayController],
  providers: [PaymePayService],
})
export class PaymePayModule {}
