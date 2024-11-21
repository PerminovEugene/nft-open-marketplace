import { Token } from 'src/core/nft/entities/token.entity';
import { Transaction } from 'src/core/transaction/transaction.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Token, { cascade: true })
  @JoinColumn()
  token: Token;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  marketplaceFee: number;

  @Column()
  isActive: boolean;

  @OneToOne(() => Transaction, { cascade: true, nullable: false })
  @JoinColumn()
  transaction: Transaction;

  @Column({ nullable: false })
  seller: string;

  @Column({ nullable: true })
  buyer: string;
}
