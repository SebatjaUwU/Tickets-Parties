import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { TicketTier } from './entities/ticket-tier.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { StorageService } from '../../common/services/storage.service';
import { PdfService } from '../../common/services/pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Order, OrderItem, TicketTier]),
    NotificationsModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService, StorageService, PdfService],
  exports: [TicketsService],
})
export class TicketsModule {}
