import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Token } from './token.entity';
import { Transaction } from '../../transaction/transaction.entity';

@Entity({ name: 'transfer_event' })
export class TransferEventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @ManyToOne(() => Token, (token: Token) => token.transferEvent)
  @JoinColumn()
  token: Token;

  @OneToOne(() => Transaction, { cascade: false })
  @JoinColumn()
  transaction: Transaction;
}
