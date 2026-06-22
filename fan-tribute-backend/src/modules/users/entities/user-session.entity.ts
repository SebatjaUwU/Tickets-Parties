import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user: User;
  @Column() userId: string;
  @Column({ type: 'text' }) refreshToken: string;
  @Column({ nullable: true }) ipAddress: string;
  @Column({ nullable: true }) userAgent: string;
  @Column() expiresAt: Date;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
}
