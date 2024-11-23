import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { RedisModule } from 'src/config/redis.module';
import { BusModule } from './core/bus/bus.module';
import { DomainModule } from './domain/domain.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule,
    BusModule,

    CoreModule,
    DomainModule,
  ],
  providers: [],
})
export class AppModule {}
