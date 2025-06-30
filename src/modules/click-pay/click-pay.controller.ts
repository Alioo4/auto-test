import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { ClickPayService } from './click-pay.service';
  import { CompleteClickPayDto, PrepareClickPayDto } from './dto';
  import { Public } from '../auth/guards';
  
  @Controller('click-pay')
  export class ClickPayController {
    constructor(private readonly clickPayService: ClickPayService) {}
  
    private sendURLEncoded(res: Response, data: Record<string, any>) {
      const encoded = new URLSearchParams(data).toString();
      res.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      return res.send(encoded);
    }
  
    @Public()
    @Post('prepare') 
    @HttpCode(HttpStatus.OK)
    async prepare(
      @Body() prepareData: PrepareClickPayDto,
      @Res() res: Response,
      @Req() req: Request,
    ) { 
      const result = await this.clickPayService.prepare(req.body);
      return this.sendURLEncoded(res, result);
    }
  
    @Public()
    @Post('complete')
    @HttpCode(HttpStatus.OK)
    async complete(
      @Body() completeData: CompleteClickPayDto,
      @Res() res: Response,
    ) {
      const result = await this.clickPayService.complete(completeData);
      return this.sendURLEncoded(res, result);
    }
  }
  