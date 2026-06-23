import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum CouponType { PERCENTAGE = 'percentage', FIXED = 'fixed_amount' }

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) code: string;
  @Column() name: string;
  @Column({ type: 'enum', enum: CouponType }) type: CouponType;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) value: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) minPurchase: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true }) maxDiscount: number;
  @Column({ type: 'int', nullable: true }) usageLimit: number;
  @Column({ type: 'int', default: 0 }) usageCount: number;
  @Column({ type: 'int', default: 1 }) userLimit: number;
  @Column({ default: true }) isActive: boolean;
  @Column({ type: 'timestamp' }) validFrom: Date;
  @Column({ type: 'timestamp', nullable: true }) validUntil: Date;
  @CreateDateColumn() createdAt: Date;
}
