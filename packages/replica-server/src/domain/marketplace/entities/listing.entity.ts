import { Token } from '../../../domain/nft/entities/token.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { NftListedEventEntity } from './nft-listed-event.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Token, (token) => token.listing, {
    cascade: ['soft-remove', 'recover'],
  })
  @JoinColumn()
  token: Token;

  @Column({ type: 'bigint', nullable: false })
  price: string;

  @Column({ type: 'bigint', nullable: false })
  marketplaceFee: string;

  @Column()
  isActive: boolean;

  @OneToOne(() => NftListedEventEntity, {
    cascade: ['soft-remove', 'recover'],
  })
  nftListedEvents: NftListedEventEntity;

  @Column({ nullable: false })
  seller: string;

  @Column({ nullable: true })
  buyer: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
