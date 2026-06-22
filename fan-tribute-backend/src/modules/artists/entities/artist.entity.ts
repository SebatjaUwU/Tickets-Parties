import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ nullable: true }) slug: string;
  @Column({ nullable: true }) genre: string;
  @Column({ nullable: true }) country: string;
  @Column({ type: 'bigint', default: 0 }) followers: number;
  @Column({ type: 'int', nullable: true }) rank: number;
  @Column({ type: 'text', nullable: true }) bio: string;
  @Column({ nullable: true }) imageUrl: string;
  @Column({ nullable: true }) spotifyUrl: string;
  @Column({ nullable: true }) instagramUrl: string;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
