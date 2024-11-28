import { Injectable, Scope } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetLatestBlockNumber,
  WithBlockNumberService,
} from '../../synchronizer/sync/sync.decorators';

@WithBlockNumberService()
@Injectable({
  scope: Scope.DEFAULT,
})
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  @GetLatestBlockNumber()
  public async getLatestProcessedBlockNumber() {
    const [transaction] = await this.transactionRepository.find({
      order: {
        blockNumber: 'DESC',
      },
      select: ['id', 'blockNumber'],
      take: 1,
      skip: 0,
    });
    return transaction ? transaction.blockNumber : 0;
  }
}
