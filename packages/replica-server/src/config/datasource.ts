import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { QueueOptions } from 'bullmq';

const cs = new ConfigService();

export const getDbConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // TODO set to false in production
    // TO generate intial migration:
    // npm run typeorm -- migration:generate -d ./src/config/datasource.ts ./src/migrations/initial.ts
    migrations: [__dirname + '/../migrations/*.entity{.ts,.js}'],
    logging: false,
  };
};

export const AppDataSource = new DataSource(
  getDbConfig(cs) as PostgresConnectionOptions,
);

export const getRedisConfig = (configService: ConfigService): QueueOptions => {
  return {
    connection: {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
    },
  };
};
