import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('orders')
  createOrder(@Body() body: any, @Request() req: any) {
    return this.ticketsService.createOrder(body, req.user.id);
  }

  @Get('orders')
  getMyOrders(@Request() req: any) {
    return this.ticketsService.getUserOrders(req.user.id);
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string, @Request() req: any) {
    return this.ticketsService.getOrderById(id, req.user.id);
  }

  @Get('my')
  getMyTickets(@Request() req: any) {
    return this.ticketsService.getUserTickets(req.user.id);
  }
}
