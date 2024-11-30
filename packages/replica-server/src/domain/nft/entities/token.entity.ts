import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Metadata } from './metadata.entity';
import { Listing } from '../../../domain/marketplace/entities/listing.entity';
import { TransferEventEntity } from './transfer-event.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  contractId: string; // id from the contract

  @Column()
  owner: string;

  // @OneToOne(() => Metadata, { cascade: ['soft-remove', 'recover'] })
  // metadata: Metadata;

  // @OneToMany(() => Listing, (listing: Listing) => listing.token, {
  //   cascade: false,
  // })
  // listing: Listing[];

  @OneToOne(() => Metadata, (metadata) => metadata.token)
  metadata: Metadata;

  // One Token can have many Listings
  @OneToMany(() => Listing, (listing) => listing.token)
  listing: Listing[];

  @OneToMany(
    () => TransferEventEntity,
    (transferEvent: TransferEventEntity) => transferEvent.token,
    {
      cascade: false,
    },
  )
  @JoinColumn()
  transferEvent: TransferEventEntity[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
