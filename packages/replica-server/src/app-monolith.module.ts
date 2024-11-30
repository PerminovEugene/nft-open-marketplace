import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { RedisModule } from './config/redis.module';
import { CoreModule } from './core/core.module';
import { ApiWorkerModule } from './gateway/api-gateway.module';
import { NodeListenerWorkerModule } from './node-listner/worker.module';
import { ReplicatorWorkerModule } from './replicator/worker.module';
import { SynchronizerWorkerModule } from './synchronizer/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule,
    CoreModule,
    ApiWorkerModule,
    NodeListenerWorkerModule,
    ReplicatorWorkerModule,
    SynchronizerWorkerModule,
  ],
})
export class AppModule {}
