import { Address } from '../../core/blockchain/types';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionHash: string;

  @Column('int')
  transactionIndex: number;

  @Column()
  blockHash: string;

  @Column('int')
  blockNumber: number;

  @Column()
  address: Address;
}
