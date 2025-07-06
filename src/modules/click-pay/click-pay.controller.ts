import { Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ClickPayService } from './click-pay.service';
import { Public } from '../auth/guards';

@Controller('click-pay')
export class ClickPayController {
    constructor(private readonly clickPayService: ClickPayService) {}

    @Public()
    @Post('prepare')
    @HttpCode(HttpStatus.OK)
    async prepare(@Req() req: Request) {
        return await this.clickPayService.prepare(req.body);;
    }

    @Public()
    @Post('complete')
    @HttpCode(HttpStatus.OK)
    async complete(@Req() req: Request) {
        return await this.clickPayService.complete(req.body);
    }
}
