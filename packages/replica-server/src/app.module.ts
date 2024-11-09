import { Module } from '@nestjs/common';
import { BlockchainListenerService } from './blockchain/events-consumer.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { TransferEventService } from './nft/services/transfer-event.service';
import { MetadataService } from './blockchain/metadata.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  providers: [BlockchainListenerService, TransferEventService, MetadataService],
})
export class AppModule {}
