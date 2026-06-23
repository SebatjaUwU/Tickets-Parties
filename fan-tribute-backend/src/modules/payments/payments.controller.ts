import { Controller, Post, Body, Param, UseGuards, Request, Headers, RawBodyRequest, Req, Get, Res, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly config: ConfigService,
  ) {}

  // ─── Stripe ──────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('stripe/intent')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear PaymentIntent de Stripe' })
  createStripeIntent(@Body() body: { orderId: string }, @Request() req: any) {
    return this.paymentsService.createStripePaymentIntent(body.orderId, req.user.id);
  }

  @Public()
  @Post('stripe/webhook')
  @ApiOperation({ summary: 'Webhook de Stripe (uso interno)' })
  stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
    const raw = (req as any).rawBody ?? Buffer.alloc(0);
    return this.paymentsService.handleStripeWebhook(raw, sig);
  }

  // ─── Wompi ───────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('wompi/initiate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Iniciar pago PSE/Nequi/Daviplata con Wompi' })
  initiateWompi(@Body() body: any, @Request() req: any) {
    return this.paymentsService.initiatePsePayment(body.orderId, body, req.user.id);
  }

  @Public()
  @Post('wompi/callback')
  @ApiOperation({ summary: 'Callback de Wompi (uso interno)' })
  wompiCallback(@Body() body: any) {
    return this.paymentsService.handleWompiCallback(body);
  }

  // Wompi redirects here after payment — we forward to the frontend (supports localhost in dev)
  @Public()
  @Get('wompi/return/:orderId')
  @ApiOperation({ summary: 'Redirección post-pago de Wompi al frontend' })
  wompiReturn(@Param('orderId') orderId: string, @Res() res: Response) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:4200');
    res.redirect(302, `${frontendUrl}/checkout/confirmacion/${orderId}`);
  }

  // ─── Dev sandbox helper ──────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('dev/confirm/:orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[DEV] Confirmar orden manualmente para pruebas sandbox' })
  devConfirm(@Param('orderId') orderId: string, @Request() req: any) {
    const env = this.config.get<string>('NODE_ENV', 'development');
    if (env === 'production' || env === 'staging') {
      throw new ForbiddenException('No disponible en este entorno');
    }
    return this.paymentsService.devConfirmOrder(orderId, req.user.id);
  }
}
