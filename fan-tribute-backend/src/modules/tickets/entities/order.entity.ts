import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) orderNumber: string;
  @ManyToOne(() => User) user: User;
  @Column() userId: string;
  @Column() eventId: string;
  @Column({ default: 'pending' }) status: string;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) subtotal: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) discountAmount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) serviceFee: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) taxes: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) total: number;
  @Column({ default: 'COP' }) currency: string;
  @OneToMany(() => OrderItem, item => item.order, { cascade: true, eager: true }) items: OrderItem[];
  @CreateDateColumn() createdAt: Date;
}
