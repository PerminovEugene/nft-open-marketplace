import { NestFactory } from '@nestjs/core';
import { NodeListenerWorkerModule } from './worker.module';

async function bootstrap() {
  const app = await NestFactory.create(NodeListenerWorkerModule);
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
