import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymeCheckRequestDto } from './dto';

@Injectable()
export class PaymePayService {
  constructor(private readonly prisma: PrismaService) {}

  async checkPerformTransaction(body: PaymeCheckRequestDto) {
    const { params, id } = body;

    
  }
}
