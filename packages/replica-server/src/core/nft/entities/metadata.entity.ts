import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Attribute } from './attribute.entity';

@Entity()
export class Metadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Attribute, (attribute: Attribute) => attribute.metadata, {cascade:['insert', 'update']})
  attributes: Attribute[]

  @Column()
  image: string;

  @Column({nullable: true})
  external_url: string;

  @Column({nullable: true})
  animation_url: string;

  @Column({nullable: true})
  background_color: string;

  @Column({nullable: true})
  youtube_url: string;
}