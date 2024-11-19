import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { RedisModule } from 'src/config/redis.module';
import { SyncModule } from './core/sync/sync.module';
import { MarketplaceModule } from './core/marketplace/marketplace.module';
import { TransactionModule } from './core/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule,
    TransactionModule,
    SyncModule,
  ],
  providers: [],
})
export class AppModule {}
