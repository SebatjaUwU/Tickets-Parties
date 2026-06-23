import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ unique: true }) slug: string;
  @Column({ type: 'text', nullable: true }) excerpt: string;
  @Column({ type: 'text' }) content: string;
  @Column({ nullable: true }) bannerUrl: string;
  @Column({ nullable: true }) authorName: string;
  @Column({ default: 'published' }) status: string;
  @Column({ type: 'jsonb', nullable: true }) tags: string[];
  @Column({ default: false }) isFeatured: boolean;
  @Column({ type: 'int', default: 0 }) viewsCount: number;
  @Column({ type: 'int', default: 0 }) likesCount: number;
  @Column({ type: 'int', default: 3 }) readTime: number;
  @Column({ nullable: true }) publishedAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
