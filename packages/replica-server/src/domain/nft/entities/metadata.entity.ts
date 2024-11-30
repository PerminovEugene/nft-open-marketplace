import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Attribute } from './attribute.entity';
import { Token } from './token.entity';

@Entity()
export class Metadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  externalUrl: string;

  @Column({ nullable: true })
  animationUrl: string;

  @Column({ nullable: true })
  backgroundColor: string;

  @Column({ nullable: true })
  youtubeUrl: string;

  @OneToMany(() => Attribute, (attribute: Attribute) => attribute.metadata, {
    cascade: ['soft-remove', 'recover', 'insert'],
  })
  attributes: Attribute[];

  @OneToOne(() => Token, { cascade: ['soft-remove', 'recover'] })
  @JoinColumn()
  token: Token;

  @DeleteDateColumn()
  deletedAt?: Date;
}
