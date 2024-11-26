import { Token } from 'src/domain/nft/entities/token.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { NftListedEventEntity } from './nft-listed-event.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Token, { cascade: ['soft-remove', 'recover'] })
  @JoinColumn()
  token: Token;

  @Column({ type: 'bigint', nullable: false })
  price: string;

  @Column({ type: 'bigint', nullable: false })
  marketplaceFee: string;

  @Column()
  isActive: boolean;

  @OneToMany(
    () => NftListedEventEntity,
    (nftListedEvent: NftListedEventEntity) => nftListedEvent.listing,
    {
      cascade: ['soft-remove', 'recover'],
    },
  )
  nftListedEvents: NftListedEventEntity;

  @Column({ nullable: false })
  seller: string;

  @Column({ nullable: true })
  buyer: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
