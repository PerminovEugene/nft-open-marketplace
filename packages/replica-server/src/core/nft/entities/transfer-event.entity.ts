import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
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

  @ManyToOne(() => Token, (token: Token) => token.transferEvent)
  @JoinColumn()
  token: Token;

  @OneToOne(() => Transaction, { cascade: true })
  @JoinColumn()
  transaction: Transaction;
}
