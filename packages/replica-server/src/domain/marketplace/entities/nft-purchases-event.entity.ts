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

@Entity({ name: 'nft_purchased_event' })
export class NftPurchasedEventEntity {
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

  @ManyToOne(() => Listing, { cascade: ['soft-remove', 'recover'] })
  @JoinColumn()
  listing: Listing;

  @OneToOne(() => Transaction, { cascade: false })
  @JoinColumn()
  transaction: Transaction;
}
