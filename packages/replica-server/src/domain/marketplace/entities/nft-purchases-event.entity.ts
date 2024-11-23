import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from '../../transaction/transaction.entity';
import { Listing } from './listing.entity';

@Entity()
export class NftPurchasedEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buyer: string;

  @Column()
  tokenId: number;

  @Column()
  price: number;

  @Column()
  marketplaceFee: number;

  @OneToOne(() => Listing, { cascade: ['soft-remove', 'recover'] })
  @JoinColumn()
  listing: Listing;

  @OneToOne(() => Transaction, { cascade: false })
  @JoinColumn()
  transaction: Transaction;
}
