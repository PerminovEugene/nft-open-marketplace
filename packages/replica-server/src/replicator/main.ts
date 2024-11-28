import { NestFactory } from '@nestjs/core';
import { ReplicatorWorkerModule } from './worker.module';

async function bootstrap() {
  const app = await NestFactory.create(ReplicatorWorkerModule);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
