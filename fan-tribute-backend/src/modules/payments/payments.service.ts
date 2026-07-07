import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import Stripe from 'stripe';
import { Payment } from './entities/payment.entity';
import { Order } from '../tickets/entities/order.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { TicketsService } from '../tickets/tickets.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe | null = null;

  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly config: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
  ) {
    const stripeKey = config.get<string>('STRIPE_SECRET_KEY', '');
    if (stripeKey && !stripeKey.includes('placeholder')) {
      this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' as any });
    }
  }

  // ─── Guest Checkout (Wompi, no auth required) ────────────────────────────

  async guestCheckout(body: {
    eventId: string;
    items: Array<{ tierId: string; quantity: number }>;
    buyer: { name: string; email: string; phone?: string };
  }) {
    if (!body.buyer?.name || !body.buyer?.email) {
      throw new BadRequestException('Nombre y email son requeridos');
    }
    if (!body.items?.length) {
      throw new BadRequestException('Selecciona al menos una entrada');
    }

    const { orderId, orderNumber, total } = await this.ticketsService.createGuestOrder(body);
    const wompiResult = await this.buildWompiUrl(orderId, total);

    return { ...wompiResult, orderId, orderNumber };
  }

  async getOrderPublic(orderId: string): Promise<Order | null> {
    return this.ticketsService.getOrderPublic(orderId);
  }

  // ─── Wompi URL builder ────────────────────────────────────────────────────

  private async buildWompiUrl(orderId: string, total: number) {
    const wompiKey = this.config.get<string>('WOMPI_PUBLIC_KEY', '');

    if (!wompiKey || wompiKey.includes('placeholder')) {
      this.logger.warn('Wompi not configured — confirming order as dev mock');
      await this.confirmPayment(orderId, 'wompi_mock_dev', 'wompi_mock');
      const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:4200');
      return { wompiCheckoutUrl: `${frontendUrl}/checkout/confirmacion/${orderId}`, reference: 'mock' };
    }

    const integritySecret = this.config.get<string>('WOMPI_INTEGRITY_SECRET', '');
    const reference = `FT-${orderId.substring(0, 8).toUpperCase()}`;
    const amountCents = Math.round(total * 100);

    const railwayDomain = this.config.get<string>('RAILWAY_PUBLIC_DOMAIN', '');
    const backendPublicUrl =
      this.config.get<string>('BACKEND_PUBLIC_URL', '') ||
      (railwayDomain ? `https://${railwayDomain}` : '') ||
      this.config.get<string>('BACKEND_URL', 'http://localhost:3000');

    const redirectUrl = `${backendPublicUrl}/v1/payments/wompi/return/${orderId}`;

    const payment = this.paymentRepo.create({
      orderId,
      provider: 'wompi',
      status: 'pending',
      amount: total,
      currency: 'COP',
      providerRef: reference,
    });
    await this.paymentRepo.save(payment);

    const baseParams = new URLSearchParams({
      'public-key': wompiKey,
      'currency': 'COP',
      'amount-in-cents': String(amountCents),
      'reference': reference,
      'redirect-url': redirectUrl,
    });

    // signature:integrity must NOT be percent-encoded (%3A) — Wompi parses the raw colon
    let wompiCheckoutUrl = `https://checkout.wompi.co/p/?${baseParams.toString()}`;

    if (integritySecret) {
      const signature = createHash('sha256')
        .update(`${reference}${amountCents}COP${integritySecret}`)
        .digest('hex');
      wompiCheckoutUrl += `&signature:integrity=${signature}`;
    }
    return { wompiCheckoutUrl, reference, amountInCents: amountCents, redirectUrl };
  }

  // ─── Wompi webhook callback ───────────────────────────────────────────────

  async handleWompiCallback(body: any) {
    const { data } = body;
    if (!data?.transaction) return { status: 'ignored' };

    const { reference, status, id: transactionId } = data.transaction;
    const order = await this.orderRepo.findOne({ where: { orderNumber: reference } })
      ?? await this.orderRepo.createQueryBuilder('o')
          .where(`o.id LIKE :ref`, { ref: `${reference.replace('FT-', '')}%` })
          .getOne();

    if (!order) return { status: 'order_not_found' };

    if (status === 'APPROVED') {
      await this.confirmPayment(order.id, transactionId, 'wompi');
    } else if (['DECLINED', 'VOIDED', 'ERROR'].includes(status)) {
      await this.paymentRepo.update({ providerRef: reference }, { status: 'rejected' });
      await this.orderRepo.update(order.id, { status: 'failed' });
    }

    return { status: 'processed' };
  }

  // ─── Stripe ──────────────────────────────────────────────────────────────

  async createStripePaymentIntent(orderId: string, userId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.status !== 'pending') throw new BadRequestException('La orden ya fue procesada');

    if (!this.stripe) {
      this.logger.warn('Stripe not configured — confirming order as dev mock');
      await this.confirmPayment(orderId, 'stripe_mock_dev', 'stripe_mock');
      return { clientSecret: 'pi_mock_secret_test', paymentId: 'pay_mock', confirmed: true };
    }

    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(order.total) * 100),
      currency: order.currency.toLowerCase(),
      metadata: { orderId, userId },
    });

    const payment = this.paymentRepo.create({
      orderId,
      provider: 'stripe',
      status: 'pending',
      amount: Number(order.total),
      currency: order.currency,
      providerRef: intent.id,
    });
    await this.paymentRepo.save(payment);

    return { clientSecret: intent.client_secret, paymentId: payment.id };
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string): Promise<void> {
    if (!this.stripe) return;

    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET', '');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (e) {
      throw new BadRequestException(`Webhook signature inválida: ${(e as Error).message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      await this.confirmPayment(intent.metadata['orderId'], intent.id, 'stripe');
    }

    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as Stripe.PaymentIntent;
      await this.paymentRepo.update({ providerRef: intent.id }, { status: 'rejected' });
      await this.orderRepo.update({ id: intent.metadata['orderId'] }, { status: 'failed' });
    }
  }

  // ─── Dev-only: manually confirm a pending order ───────────────────────────

  async devConfirmOrder(orderId: string, userId: string): Promise<{ message: string }> {
    if (this.config.get('NODE_ENV') === 'production') {
      throw new BadRequestException('Este endpoint solo está disponible en desarrollo');
    }
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.userId && order.userId !== userId) throw new NotFoundException('Orden no encontrada');
    if (order.status === 'completed') {
      return { message: 'La orden ya estaba confirmada' };
    }
    await this.confirmPayment(orderId, 'dev_manual_confirm', 'dev');
    return { message: `Orden ${orderId} confirmada manualmente en modo dev` };
  }

  // ─── Shared confirm logic ─────────────────────────────────────────────────

  private async confirmPayment(orderId: string, providerRef: string, provider: string): Promise<void> {
    await this.paymentRepo.update({ orderId }, { status: 'approved', paidAt: new Date(), providerRef });
    await this.orderRepo.update(orderId, { status: 'completed' });

    const tickets = await this.ticketsService.generateForOrder(orderId);

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (order) {
      let recipientEmail: string | null = null;
      let recipientName = 'Cliente';

      if (order.buyerEmail) {
        recipientEmail = order.buyerEmail;
        recipientName = order.buyerName ?? 'Cliente';
      } else if (order.userId) {
        const user = await this.usersService.findById(order.userId);
        if (user) {
          recipientEmail = user.email;
          recipientName = user.firstName;
        }
      }

      if (recipientEmail) {
        await this.notificationsService.sendOrderConfirmationEmail(
          { email: recipientEmail, firstName: recipientName },
          { orderNumber: order.orderNumber, total: Number(order.total), currency: order.currency },
          tickets,
        );
      }
    }

    this.logger.log(`Order ${orderId} confirmed via ${provider} — ${tickets.length} tickets generated`);
  }
}

