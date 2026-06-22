import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { TicketTier } from './ticket-tier.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Order, order => order.items) order: Order;
  @Column() orderId: string;
  @ManyToOne(() => TicketTier, { eager: true }) ticketTier: TicketTier;
  @Column() ticketTierId: string;
  @Column({ type: 'int' }) quantity: number;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) unitPrice: number;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) totalPrice: number;
}
