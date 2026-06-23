import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { Ticket } from './entities/ticket.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { TicketTier } from './entities/ticket-tier.entity';
import { CouponsService } from './coupons.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(TicketTier) private readonly tierRepo: Repository<TicketTier>,
    private readonly couponsService: CouponsService,
  ) {}

  async createOrder(body: any, userId: string): Promise<{ orderId: string; orderNumber: string }> {
    const items: Array<{ tierId: string; quantity: number; unitPrice: number; eventId?: string }> = body.items ?? [];
    const subtotal = items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0);
    const serviceFee = subtotal * 0.05;
    const eventId = body.eventId ?? items[0]?.eventId ?? '';

    // Apply coupon if provided
    let discountAmount = 0;
    let couponId: string | null = null;
    if (body.couponCode) {
      const { coupon, discount } = await this.couponsService.validate(body.couponCode, subtotal);
      discountAmount = discount;
      couponId = coupon.id;
    }

    const total = subtotal + serviceFee - discountAmount;

    const order = this.orderRepo.create({
      userId,
      eventId,
      orderNumber: `ORD-${Date.now()}`,
      status: 'pending',
      subtotal,
      discountAmount,
      serviceFee,
      taxes: 0,
      total: Math.max(total, 0),
      currency: 'COP',
    });
    const saved = await this.orderRepo.save(order);

    // Mark coupon as used
    if (couponId) await this.couponsService.apply(couponId);

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

  async generateForOrder(orderId: string): Promise<Ticket[]> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.ticketTier'],
    });
    if (!order) throw new NotFoundException('Orden no encontrada');

    const tickets: Ticket[] = [];

    for (const item of order.items) {
      for (let i = 0; i < item.quantity; i++) {
        const ticketNumber = `FT-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`;

        // Payload that will be encoded in the QR
        const qrPayload = JSON.stringify({
          ticketNumber,
          orderId,
          eventId: order.eventId,
          tierId: item.ticketTierId,
          v: 1,
        });

        const qrCode = await QRCode.toDataURL(qrPayload, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 300,
          color: { dark: '#000000', light: '#ffffff' },
        });

        const ticket = this.ticketRepo.create({
          ticketNumber,
          orderId,
          eventId: order.eventId,
          userId: order.userId,
          qrCode,
          status: 'available',
        });

        tickets.push(await this.ticketRepo.save(ticket));

        // Decrease available stock
        await this.tierRepo.increment({ id: item.ticketTierId }, 'quantitySold', 1);
      }
    }

    // Mark order as completed
    await this.orderRepo.update(orderId, { status: 'completed' });

    return tickets;
  }

  async validateQR(qrCode: string, scannedById: string): Promise<{ valid: boolean; message: string; ticket?: Ticket }> {
    try {
      const payload = JSON.parse(qrCode);
      const ticket = await this.ticketRepo.findOne({ where: { ticketNumber: payload.ticketNumber } });

      if (!ticket) return { valid: false, message: 'Ticket no encontrado' };
      if (ticket.status === 'used') return { valid: false, message: 'Ticket ya utilizado' };
      if (ticket.status !== 'available') return { valid: false, message: `Estado inválido: ${ticket.status}` };

      await this.ticketRepo.update(ticket.id, { status: 'used', usedAt: new Date() });
      return { valid: true, message: '✅ Acceso permitido', ticket };
    } catch {
      return { valid: false, message: 'QR inválido o corrupto' };
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['items', 'items.ticketTier'],
    });
  }

  async getOrderById(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id, userId },
      relations: ['items', 'items.ticketTier'],
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }

  async getUserTickets(userId: string): Promise<Ticket[]> {
    return this.ticketRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTicketById(id: string, userId: string): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({ where: { id, userId } });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');
    return ticket;
  }
}
