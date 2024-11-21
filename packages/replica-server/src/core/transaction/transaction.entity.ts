import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Listing } from '../marketplace/entities/listing.entity';

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
  address: string;

  // Listing event?
  @OneToOne(() => Listing, (listing) => listing.transaction, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  listing?: Listing;

  // todo link to transfer event
}
