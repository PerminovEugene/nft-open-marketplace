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
  external_url: string;

  @Column({ nullable: true })
  animation_url: string;

  @Column({ nullable: true })
  background_color: string;

  @Column({ nullable: true })
  youtube_url: string;

  @OneToMany(() => Attribute, (attribute: Attribute) => attribute.metadata, {
    cascade: ['soft-remove', 'recover'],
  })
  attributes: Attribute[];

  @OneToOne(() => Token, { cascade: ['soft-remove', 'recover'] })
  @JoinColumn()
  token: Token;

  @DeleteDateColumn()
  deletedAt?: Date;
}
