import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
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
      amount: Math.round(Number(order.total) * 100), // Stripe expects cents
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

  // ─── Wompi ───────────────────────────────────────────────────────────────

  async initiatePsePayment(orderId: string, body: any, userId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.status !== 'pending') throw new BadRequestException('La orden ya fue procesada');

    const wompiKey = this.config.get<string>('WOMPI_PUBLIC_KEY', '');
    if (!wompiKey || wompiKey.includes('placeholder')) {
      this.logger.warn('Wompi not configured — confirming order as dev mock');
      await this.confirmPayment(orderId, 'wompi_mock_dev', 'wompi_mock');
      const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:4200');
      return { redirectUrl: `${frontendUrl}/checkout/confirmacion/${orderId}`, paymentId: 'wompi_mock' };
    }

    const integritySecret = this.config.get<string>('WOMPI_INTEGRITY_SECRET', '');
    const reference = `FT-${orderId.substring(0, 8).toUpperCase()}`;
    const amountCents = Math.round(Number(order.total) * 100);

    // Generate integrity signature: SHA256(reference + amount + currency + secret)
    const { createHash } = await import('crypto');
    const signature = createHash('sha256')
      .update(`${reference}${amountCents}COP${integritySecret}`)
      .digest('hex');

    // Use backend public URL so Wompi can redirect to a public endpoint (avoids localhost block)
    const backendPublicUrl = this.config.get('BACKEND_PUBLIC_URL') || this.config.get('BACKEND_URL', 'http://localhost:3000');
    const redirectUrl = `${backendPublicUrl}/v1/payments/wompi/return/${orderId}`;

    const payment = this.paymentRepo.create({
      orderId,
      provider: 'wompi',
      status: 'pending',
      amount: Number(order.total),
      currency: 'COP',
      providerRef: reference,
    });
    await this.paymentRepo.save(payment);

    // Wompi checkout URL — method pre-selection from body.method (pse | nequi | daviplata)
    const methodType = (body.method ?? '').toUpperCase();
    const checkoutParams: Record<string, string> = {
      'public-key': wompiKey,
      'currency': 'COP',
      'amount-in-cents': String(amountCents),
      'reference': reference,
      'redirect-url': redirectUrl,
      'signature:integrity': signature,
    };
    if (['PSE', 'NEQUI', 'DAVIPLATA'].includes(methodType)) {
      checkoutParams['payment-method[type]'] = methodType;
    }
    const wompiCheckoutUrl = `https://checkout.wompi.co/p/?${new URLSearchParams(checkoutParams).toString()}`;

    return {
      wompiCheckoutUrl,
      reference,
      amountInCents: amountCents,
      currency: 'COP',
      redirectUrl,
      paymentId: payment.id,
    };
  }

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

  // ─── Dev-only: manually confirm a pending order (for sandbox testing) ──────

  async devConfirmOrder(orderId: string, userId: string): Promise<{ message: string }> {
    if (this.config.get('NODE_ENV') === 'production') {
      throw new BadRequestException('Este endpoint solo está disponible en desarrollo');
    }
    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order) throw new NotFoundException('Orden no encontrada');
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

    // Generate QR tickets
    const tickets = await this.ticketsService.generateForOrder(orderId);

    // Send confirmation email
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (order) {
      const user = await this.usersService.findById(order.userId);
      if (user) {
        await this.notificationsService.sendOrderConfirmationEmail(
          { email: user.email, firstName: user.firstName },
          { orderNumber: order.orderNumber, total: Number(order.total), currency: order.currency },
          tickets,
        );
      }
    }

    this.logger.log(`Order ${orderId} confirmed via ${provider} — ${tickets.length} tickets generated`);
  }
}
