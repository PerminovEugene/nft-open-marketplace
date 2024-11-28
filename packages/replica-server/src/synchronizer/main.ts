import { NestFactory } from '@nestjs/core';
import { SynchronizerWorkerModule } from './worker.module';

async function bootstrap() {
  const app = await NestFactory.create(SynchronizerWorkerModule);

  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
