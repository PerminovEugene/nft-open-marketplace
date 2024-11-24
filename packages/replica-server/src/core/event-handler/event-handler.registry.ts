import { Injectable } from '@nestjs/common';
import { ContractEventHandler } from '../bus/types';

@Injectable()
export class EventHandlersRegistry {
  private handlers: Map<string, ContractEventHandler> = new Map();

  registerHandler(eventType: string, handler: ContractEventHandler): void {
    console.log('register handler for event:', eventType);
    this.handlers.set(eventType, handler);
  }

  getHandler(eventName: string): ContractEventHandler | undefined {
    return this.handlers.get(eventName);
  }
  onModuleInit() {
    console.log('Init EventHandlersRegistry');
  }
}
