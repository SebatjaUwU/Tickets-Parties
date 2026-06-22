import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from './order.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) ticketNumber: string;
  @ManyToOne(() => Order) order: Order;
  @Column() orderId: string;
  @Column() eventId: string;
  @ManyToOne(() => User) user: User;
  @Column() userId: string;
  @Column({ nullable: true }) attendeeName: string;
  @Column({ nullable: true }) attendeeEmail: string;
  @Column({ type: 'text', nullable: true }) qrCode: string;
  @Column({ nullable: true }) qrCodeUrl: string;
  @Column({ nullable: true }) pdfUrl: string;
  @Column({ default: 'available' }) status: string;
  @Column({ nullable: true }) usedAt: Date;
  @CreateDateColumn() createdAt: Date;
}
