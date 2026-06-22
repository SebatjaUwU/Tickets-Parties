import { Controller, Post, Body, Param, UseGuards, Request, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('stripe/intent')
  @UseGuards(JwtAuthGuard)
  createStripeIntent(@Body() body: { orderId: string }, @Request() req: any) {
    return this.paymentsService.createStripePaymentIntent(body.orderId, req.user.id);
  }

  @Post('stripe/webhook')
  stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
    const raw = (req as any).rawBody ?? Buffer.alloc(0);
    return this.paymentsService.handleStripeWebhook(raw, sig);
  }

  @Post('pse/initiate')
  @UseGuards(JwtAuthGuard)
  initiatePse(@Body() body: any, @Request() req: any) {
    return this.paymentsService.initiatePsePayment(body.orderId, body, req.user.id);
  }

  @Post('pse/callback')
  pseCallback(@Body() body: any) {
    return this.paymentsService.handlePseCallback(body);
  }
}
