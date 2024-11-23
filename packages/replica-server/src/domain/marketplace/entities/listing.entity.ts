import { Token } from 'src/domain/nft/entities/token.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { NftListedEvent } from './nft-listed-event.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Token, { cascade: ['soft-remove', 'recover'] })
  @JoinColumn()
  token: Token;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  marketplaceFee: number;

  @Column()
  isActive: boolean;

  @OneToOne(() => NftListedEvent, {
    cascade: ['soft-remove', 'recover'],
    nullable: false,
  })
  nftListedEvent: NftListedEvent;

  @Column({ nullable: false })
  seller: string;

  @Column({ nullable: true })
  buyer: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
