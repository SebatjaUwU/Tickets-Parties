import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ticket_tiers')
export class TicketTier {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() eventId: string;
  @Column() name: string;
  @Column({ nullable: true }) description: string;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) price: number;
  @Column({ default: 'COP' }) currency: string;
  @Column({ type: 'int' }) quantityTotal: number;
  @Column({ type: 'int', default: 0 }) quantitySold: number;
  @Column({ type: 'int', default: 0 }) quantityReserved: number;
  @Column({ type: 'int', default: 10 }) maxPerOrder: number;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
}
