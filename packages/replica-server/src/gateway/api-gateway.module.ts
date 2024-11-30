import { Module } from '@nestjs/common';
import { DomainApiModule } from '../domain/domain.module';

@Module({
  imports: [DomainApiModule],
})
export class ApiWorkerModule {}
