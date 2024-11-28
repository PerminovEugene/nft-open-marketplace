import { Module } from '@nestjs/common';
import { EventHandlersRegistry } from './event-handler.registry';

@Module({
  providers: [EventHandlersRegistry],
  exports: [EventHandlersRegistry],
})
export class EventHandlersModule {}
