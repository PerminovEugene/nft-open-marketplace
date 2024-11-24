import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Transaction } from '../../transaction/transaction.entity';
import { Listing } from './listing.entity';

@Entity()
export class NftListedEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seller: string;

  @Column()
  price: number;

  @Column()
  marketplaceFee: number;

  @ManyToOne(() => Listing, { cascade: ['soft-remove', 'recover'] })
  @JoinColumn()
  listing: Listing;

  @OneToOne(() => Transaction, { cascade: false })
  @JoinColumn()
  transaction: Transaction;
}
