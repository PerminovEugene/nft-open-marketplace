import { Injectable } from '@nestjs/common';
import { ContractEventHandler } from '../bus-processor/types';
import { buildJobName } from '../bus-processor/utils/job-names';

@Injectable()
export class EventHandlersRegistry {
  private handlers: Map<string, ContractEventHandler> = new Map();

  registerHandler(
    contractName: string,
    eventName: string,
    handler: ContractEventHandler,
  ): void {
    const jobName = buildJobName(contractName, eventName);
    console.log('register handler for event:', jobName);
    this.handlers.set(jobName, handler);
  }

  getHandler(jobName: string): ContractEventHandler | undefined {
    return this.handlers.get(jobName);
  }
  onModuleInit() {
    console.log('Init EventHandlersRegistry');
  }
}
