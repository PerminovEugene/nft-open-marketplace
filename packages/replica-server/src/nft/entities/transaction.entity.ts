import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionHash: string;

  @Column()
  blockHash: string;

  @Column()
  blockNumber: string;

  @Column()
  address: string;
}