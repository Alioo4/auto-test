import { Module } from '@nestjs/common';
import { ClickPayService } from './click-pay.service';
import { ClickPayController } from './click-pay.controller';

@Module({
  controllers: [ClickPayController],
  providers: [ClickPayService],
})
export class ClickPayModule {}
