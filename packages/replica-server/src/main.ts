import { NestFactory } from '@nestjs/core';
import { AppModule } from './rest-server/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS').split(',');

  app.enableCors({
    origin: allowedOrigins,
    credentials: true, // If you need to include cookies in requests
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
