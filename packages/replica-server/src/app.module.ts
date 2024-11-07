import { Module } from '@nestjs/common';
import { BlockchainListenerService } from './blockchain-listner/blockchain-listner.service';

@Module({
  imports: [],
  // controllers: [AppController],
  providers: [BlockchainListenerService],
})
export class AppModule {}
