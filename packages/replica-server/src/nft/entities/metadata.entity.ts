import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Metadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  // TODO add attributes

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