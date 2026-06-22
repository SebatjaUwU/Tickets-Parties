import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { TicketTier } from './entities/ticket-tier.entity';
import { StorageService } from '../../common/services/storage.service';
import { PdfService } from '../../common/services/pdf.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(TicketTier) private readonly tierRepo: Repository<TicketTier>,
    private readonly storageService: StorageService,
    private readonly pdfService: PdfService,
  ) {}

  async createOrder(body: any, userId: string): Promise<{ orderId: string; orderNumber: string }> {
    const items: Array<{ tierId: string; quantity: number; unitPrice: number; eventId?: string }> = body.items ?? [];
    const subtotal = items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0);
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;
    const eventId = body.eventId ?? items[0]?.eventId ?? '';

    const order = this.orderRepo.create({
      userId,
      eventId,
      orderNumber: `ORD-${Date.now()}`,
      status: 'completed',
      subtotal,
      discountAmount: 0,
      serviceFee,
      taxes: 0,
      total,
      currency: 'COP',
    });
    const saved = await this.orderRepo.save(order);

    for (const item of items) {
      await this.orderItemRepo.save(this.orderItemRepo.create({
        orderId: saved.id,
        ticketTierId: item.tierId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.unitPrice) * item.quantity,
      }));
    }

    return { orderId: saved.id, orderNumber: saved.orderNumber };
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepo.find({ where: { userId } });
  }

  async getOrderById(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id, userId } });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }

  async getUserTickets(userId: string): Promise<Ticket[]> {
    return this.ticketRepo.find({ where: { userId } });
  }

  async getTicketById(id: string, userId: string): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({ where: { id, userId } });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');
    return ticket;
  }

  async generateForOrder(orderId: string): Promise<Ticket[]> {
    return [];
  }

  async validateQR(qrCode: string, scannedById: string): Promise<{ valid: boolean; message: string }> {
    return { valid: false, message: '[TODO] QR validation not implemented' };
  }

  async transferTicket(ticketId: string, fromUserId: string, toEmail: string): Promise<void> {
    // TODO: implement transfer
  }
}
