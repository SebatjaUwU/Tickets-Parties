import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ unique: true }) slug: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ nullable: true }) genre: string;
  @Column({ type: 'timestamp' }) date: Date;
  @Column({ type: 'timestamp', nullable: true }) endDate: Date;
  @Column({ nullable: true }) venue: string;
  @Column({ nullable: true }) city: string;
  @Column({ nullable: true }) country: string;
  @Column({ nullable: true }) bannerUrl: string;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) minPrice: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) maxPrice: number;
  @Column({ default: 'COP' }) currency: string;
  @Column({ type: 'int', default: 0 }) capacity: number;
  @Column({ default: 'draft' }) status: string;
  @Column({ default: false }) featured: boolean;
  @Column({ type: 'jsonb', nullable: true }) lineup: string[];
  @Column({ type: 'jsonb', nullable: true }) tags: string[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
