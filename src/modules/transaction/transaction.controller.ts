import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DeviceId, User } from '../auth/guards';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post()
    create(
        @Body() createTransactionDto: CreateTransactionDto,
        @User('sub') userId: string,
        @DeviceId() deviceId: string
    ) {
        return this.transactionService.create(createTransactionDto, userId, deviceId);
    }
}
