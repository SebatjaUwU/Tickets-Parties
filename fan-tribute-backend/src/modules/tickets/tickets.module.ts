import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { Ticket } from './entities/ticket.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { TicketTier } from './entities/ticket-tier.entity';
import { Coupon } from './entities/coupon.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Order, OrderItem, TicketTier, Coupon]),
    NotificationsModule,
  ],
  controllers: [TicketsController, CouponsController],
  providers: [TicketsService, CouponsService],
  exports: [TicketsService, CouponsService],
})
export class TicketsModule {}
