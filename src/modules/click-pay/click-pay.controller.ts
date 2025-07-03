import { Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ClickPayService } from './click-pay.service';
import { Public } from '../auth/guards';
import { sendMessage } from '../utils';

@Controller('click-pay')
export class ClickPayController {
    constructor(private readonly clickPayService: ClickPayService) {}

    @Public()
    @Post('prepare')
    @HttpCode(HttpStatus.OK)
    async prepare(@Req() req: Request) {
        const result = await this.clickPayService.prepare(req.body);
        await sendMessage(result, 'prepare response');
        return result;
    }

    @Public()
    @Post('complete')
    @HttpCode(HttpStatus.OK)
    async complete(@Req() req: Request) {
        const result = await this.clickPayService.complete(req.body);
        await sendMessage(result, 'complete response');
        return result;
    }
}
