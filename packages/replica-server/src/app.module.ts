import { Module } from '@nestjs/common';
import { BlockchainListenerService } from './blockchain-listner/blockchain-listner.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { TransferEventService } from './nft/services/transfer-event.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  providers: [BlockchainListenerService, TransferEventService],
})
export class AppModule {}
