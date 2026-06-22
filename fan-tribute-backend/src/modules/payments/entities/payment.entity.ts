import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() orderId: string;
  @Column() provider: string;
  @Column({ default: 'pending' }) status: string;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) amount: number;
  @Column({ default: 'COP' }) currency: string;
  @Column({ nullable: true }) providerRef: string;
  @Column({ nullable: true }) errorMessage: string;
  @Column({ nullable: true }) paidAt: Date;
  @CreateDateColumn() createdAt: Date;
}
