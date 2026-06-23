import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { User } from '../users/entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly resend: Resend | null = null;
  private readonly from: string;
  private readonly fromName: string;
  private readonly frontendUrl: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = config.get<string>('RESEND_API_KEY', '');
    if (apiKey && !apiKey.includes('placeholder')) {
      this.resend = new Resend(apiKey);
    }
    this.from = config.get('RESEND_FROM_EMAIL', 'noreply@fantribute.com');
    this.fromName = config.get('RESEND_FROM_NAME', 'FAN TRIBUTE');
    this.frontendUrl = config.get('FRONTEND_URL', 'http://localhost:4200');
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
      return;
    }
    try {
      await this.resend.emails.send({ from: `${this.fromName} <${this.from}>`, to, subject, html });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (e) {
      this.logger.error(`Failed to send email to ${to}: ${(e as Error).message}`);
    }
  }

  async sendVerificationEmail(user: User | { id?: string; email: string; firstName?: string }, verificationToken?: string): Promise<void> {
    const name = ('firstName' in user && user.firstName) ? user.firstName : 'Usuario';
    const verifyUrl = verificationToken
      ? `${this.frontendUrl}/auth/verify-email?token=${verificationToken}`
      : this.frontendUrl;
    await this.send(
      user.email,
      '✅ Verifica tu cuenta — FAN TRIBUTE',
      `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:16px">
        <h1 style="color:#00d4ff;font-size:24px;margin:0 0 8px">¡Hola, ${name}!</h1>
        <p style="color:#aaa;margin:0 0 24px">Gracias por unirte a la comunidad EDM más grande de Colombia. Verifica tu email para activar tu cuenta.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#ff6b35);color:#000;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none">
          Verificar mi cuenta →
        </a>
        <p style="color:#555;font-size:12px;margin-top:32px">Este enlace expira en 24 horas. Si no creaste esta cuenta, ignora este mensaje.</p>
      </div>`,
    );
  }

  async sendOrderConfirmationEmail(
    user: { email: string; firstName: string },
    order: { orderNumber: string; total: number; currency: string; eventTitle?: string },
    tickets: Ticket[],
  ): Promise<void> {
    const ticketsHtml = tickets.map((t, i) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #222;color:#fff">#${i + 1}</td>
        <td style="padding:8px;border-bottom:1px solid #222;color:#00d4ff">${t.ticketNumber}</td>
        <td style="padding:8px;border-bottom:1px solid #222;color:#aaa">${t.status}</td>
      </tr>
    `).join('');

    const qrSection = tickets.length > 0 && tickets[0].qrCode
      ? `<div style="text-align:center;margin:24px 0">
           <p style="color:#aaa;margin-bottom:8px">Tu código QR de acceso (ticket #1):</p>
           <img src="${tickets[0].qrCode}" alt="QR Code" style="width:200px;height:200px;border-radius:8px"/>
         </div>`
      : '';

    await this.send(
      user.email,
      `🎫 Confirmación de compra ${order.orderNumber} — FAN TRIBUTE`,
      `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:16px">
        <h1 style="color:#00d4ff;font-size:22px;margin:0 0 4px">¡Compra confirmada!</h1>
        <p style="color:#aaa;margin:0 0 24px">Hola ${user.firstName}, tus entradas están listas.</p>

        <div style="background:#111;border-radius:12px;padding:16px;margin-bottom:24px">
          <p style="margin:4px 0;color:#aaa">Orden: <strong style="color:#fff">${order.orderNumber}</strong></p>
          ${order.eventTitle ? `<p style="margin:4px 0;color:#aaa">Evento: <strong style="color:#fff">${order.eventTitle}</strong></p>` : ''}
          <p style="margin:4px 0;color:#aaa">Total: <strong style="color:#ff6b35">${order.currency} ${Number(order.total).toLocaleString('es-CO')}</strong></p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <thead>
            <tr style="background:#111">
              <th style="padding:8px;text-align:left;color:#555">#</th>
              <th style="padding:8px;text-align:left;color:#555">Número</th>
              <th style="padding:8px;text-align:left;color:#555">Estado</th>
            </tr>
          </thead>
          <tbody>${ticketsHtml}</tbody>
        </table>

        ${qrSection}

        <a href="${this.frontendUrl}/mis-entradas" style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#ff6b35);color:#000;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none">
          Ver mis entradas →
        </a>

        <p style="color:#555;font-size:11px;margin-top:32px">
          Presenta el código QR en la entrada del evento. FAN TRIBUTE no realiza reembolsos.
        </p>
      </div>`,
    );
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/auth/reset-password?token=${token}`;
    await this.send(
      email,
      '🔐 Recupera tu contraseña — FAN TRIBUTE',
      `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:16px">
        <h1 style="color:#00d4ff;font-size:22px;margin:0 0 8px">Recupera tu contraseña</h1>
        <p style="color:#aaa;margin:0 0 24px">Haz clic en el botón para establecer una nueva contraseña. Este enlace expira en 1 hora.</p>
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#ff6b35);color:#000;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none">
          Cambiar contraseña →
        </a>
        <p style="color:#555;font-size:12px;margin-top:32px">Si no solicitaste esto, ignora este mensaje.</p>
      </div>`,
    );
  }

  async sendPasswordChangedEmail(user: User | { email: string }): Promise<void> {
    await this.send(
      user.email,
      '🔒 Tu contraseña fue cambiada — FAN TRIBUTE',
      `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:16px">
        <h1 style="color:#00d4ff;font-size:22px;margin:0 0 8px">Contraseña actualizada</h1>
        <p style="color:#aaa">Tu contraseña fue cambiada exitosamente. Si no fuiste tú, contacta a soporte de inmediato.</p>
      </div>`,
    );
  }
}
