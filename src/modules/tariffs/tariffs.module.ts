import { Module } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';

@Module({
  controllers: [TariffsController],
  providers: [TariffsService],
})
export class TariffsModule {}
