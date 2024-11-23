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
import { Listing } from 'src/domain/marketplace/entities/listing.entity';
import { TransferEvent } from './transfer-event.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contractId: string; // id from the contract

  @Column()
  owner: string;

  @OneToOne(() => Metadata, { cascade: ['soft-remove', 'recover'] })
  metadata: Metadata;

  @OneToMany(() => Listing, (listing: Listing) => listing.token, {
    cascade: false,
  })
  listing: Listing[];

  @OneToMany(
    () => TransferEvent,
    (transferEvent: TransferEvent) => transferEvent.token,
    {
      cascade: false,
    },
  )
  @JoinColumn()
  transferEvent: TransferEvent[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
