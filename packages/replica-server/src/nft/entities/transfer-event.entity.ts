import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Token } from './token.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class TransferEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @OneToOne(() => Token, { cascade: true})
  @JoinColumn()
  token: Token;

  @OneToOne(() => Token, { cascade: true})
  @JoinColumn()
  transaction: Transaction;
}