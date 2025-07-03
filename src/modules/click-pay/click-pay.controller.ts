import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ClickPayService } from './click-pay.service';
import { Public } from '../auth/guards';
import { sendMessage } from '../utils';

@Controller('click-pay')
export class ClickPayController {
    constructor(private readonly clickPayService: ClickPayService) {}

    @Public()
    @Post('prepare')
    @HttpCode(HttpStatus.OK)
    async prepare(@Res() res: Response, @Req() req: Request) {
        const result = await this.clickPayService.prepare(req.body);
        return result;
    }

    @Public()
    @Post('complete')
    @HttpCode(HttpStatus.OK)
    async complete(@Res() res: Response, @Req() req: Request) {
        await sendMessage(req.body);
        const result = await this.clickPayService.complete(req.body);
        return result;
    }
}
