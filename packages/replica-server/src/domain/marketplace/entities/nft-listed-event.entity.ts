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

@Entity({ name: 'nft_listed_event' })
export class NftListedEventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seller: string;

  @Column({ type: 'bigint' })
  price: string;

  @Column({ type: 'bigint' })
  marketplaceFee: string;

  @OneToOne(() => Listing, { cascade: ['soft-remove', 'recover'] })
  @JoinColumn()
  listing: Listing;

  @OneToOne(() => Transaction, { cascade: false })
  @JoinColumn()
  transaction: Transaction;
}
