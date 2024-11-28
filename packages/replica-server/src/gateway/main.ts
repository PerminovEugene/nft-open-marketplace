// import { NestFactory } from '@nestjs/core';
// import { ConfigService } from '@nestjs/config';
// import { ReplicatorWorkerModule } from './worker.module';

// async function bootstrap() {
//   const app = await NestFactory.create(ReplicatorWorkerModule);

//   const configService = app.get(ConfigService);
//   const allowedOrigins = configService
//     .get<string>('ALLOWED_ORIGINS')
//     .split(',');

//   app.enableCors({
//     origin: allowedOrigins,
//     credentials: true, // If you need to include cookies in requests
//   });

//   await app.listen(process.env.PORT ?? 3002);
// }
// bootstrap();
