import { Controller, UseGuards } from '@nestjs/common';
import { PaymePayService } from './payme-pay.service';
import { PaymeAuthGuard } from '../auth/guards';

@UseGuards(PaymeAuthGuard)
@Controller('payme-pay')
export class PaymePayController {
  constructor(private readonly paymePayService: PaymePayService) {}

}
