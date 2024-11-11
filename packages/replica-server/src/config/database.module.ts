import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDbConfig } from './datasource';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Make sure ConfigModule is imported
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => 
        getDbConfig(configService)
      ,
    }),
  ],
})
export class DatabaseModule {}
