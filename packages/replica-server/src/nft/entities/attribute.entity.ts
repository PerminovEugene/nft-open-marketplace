import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Metadata } from './metadata.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  traitType: string;

  @Column()
  value: string;

  @ManyToOne(() => Metadata, (metadata: Metadata) => metadata.attributes)
  metadata: Metadata;
}