import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Metadata } from './metadata.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  internalId: number;

  @Column()
  id: string;

  @OneToOne(() => Metadata, { cascade: true})
  @JoinColumn()
  metadata: Metadata;
}