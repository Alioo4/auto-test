import { Module } from '@nestjs/common';
import { TariffController } from './tariffs.controller';
import { TariffService } from './tariffs.service';

@Module({
    controllers: [TariffController],
    providers: [TariffService],
})
export class TariffsModule {}
