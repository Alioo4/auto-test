import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ClickPayService } from './click-pay.service';
import { CompleteClickPayDto, PrepareClickPayDto } from './dto';
import { Response } from 'express';
import { Public } from '../auth/guards';

@Controller('click-pay')
export class ClickPayController {
    constructor(private readonly clickPayService: ClickPayService) {}

    @Public()
    @Post('pre-pare')
    @HttpCode(HttpStatus.OK)
    prepare(@Body() prepareData: PrepareClickPayDto, @Res() res: Response) {
        console.log(prepareData);
        

        const result = this.clickPayService.prepare(prepareData);

        const encoded = new URLSearchParams(result as any).toString();

        res.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        return res.send(encoded);
    }

    @Public()
    @Post('complete')
    @HttpCode(HttpStatus.OK)
    async complete(@Body() completeData: CompleteClickPayDto, @Res() res: Response) {
        const result = await this.clickPayService.complete(completeData); // ✅ not 'prepare'

        const encoded = new URLSearchParams(result as any).toString();

        res.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        return res.send(encoded);
    }
}
