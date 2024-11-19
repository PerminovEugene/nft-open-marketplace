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

  @OneToOne(() => Listing, (listing) => listing.transaction, {
    nullable: true, // Transaction may not always be linked to a Listing
    onDelete: 'SET NULL',
  })
  @JoinColumn() // This will store the foreign key in the Transaction table
  listing?: Listing;
}
