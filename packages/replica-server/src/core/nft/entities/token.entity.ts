import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Metadata } from './metadata.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contractId: string; // id from the contract

  @OneToOne(() => Metadata, { cascade: true})
  @JoinColumn()
  metadata: Metadata;

  @Column()
  owner: string;
}