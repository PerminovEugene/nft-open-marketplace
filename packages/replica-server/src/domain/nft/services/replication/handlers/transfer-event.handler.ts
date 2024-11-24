import { Injectable } from '@nestjs/common';
import { TransferEventService } from '../transfer-event.service';
import { ContractEventHandler } from 'src/core/bus/types';

@Injectable()
export class TransferEventHandler implements ContractEventHandler {
  constructor(private transferEventService: TransferEventService) {}

  async handle(data: any, isUnsyncedEvent: boolean = false): Promise<void> {
    console.log('Handling transfer event:', data);
    await this.transferEventService.save(data, isUnsyncedEvent);
  }
}
