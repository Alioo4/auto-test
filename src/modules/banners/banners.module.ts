import { Module } from '@nestjs/common';
import { BannerController } from './banners.controller';
import { BannerService } from './banners.service';

@Module({
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannersModule {}
