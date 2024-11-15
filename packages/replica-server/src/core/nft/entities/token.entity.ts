import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Metadata } from './metadata.entity';
import { Listing } from 'src/core/marketplace/entities/listing.entity';
import { TransferEvent } from './transfer-event.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contractId: string; // id from the contract

  @Column()
  owner: string;

  @OneToOne(() => Metadata, { cascade: true })
  @JoinColumn()
  metadata: Metadata;

  @OneToMany(() => Listing, (listing: Listing) => listing.token, {
    cascade: ['insert', 'update'],
  })
  listing: Listing[];

  @OneToMany(
    () => TransferEvent,
    (transferEvent: TransferEvent) => transferEvent.token,
    {
      cascade: ['insert', 'update'],
    },
  )
  @JoinColumn()
  transferEvent: TransferEvent[];
}
