import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { TicketTier } from '../tickets/entities/ticket-tier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, TicketTier])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService, TypeOrmModule],
})
export class EventsModule {}
