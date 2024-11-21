import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { RedisModule } from 'src/config/redis.module';
import { SyncModule } from './core/sync/sync.module';
import { TransactionModule } from './core/transaction/transaction.module';
import { BusModule } from './core/bus/bus.module';
import { TransferModule } from './core/event-transfer/transfer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule,
    BusModule,
    TransferModule,
    TransactionModule,
    SyncModule,
  ],
  providers: [],
})
export class AppModule {}
