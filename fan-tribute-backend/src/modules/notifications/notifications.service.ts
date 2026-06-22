import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    this.logger.log(`[TODO] Welcome email to ${email} (${firstName})`);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    this.logger.log(`[TODO] Password reset email to ${email}`);
  }

  async sendVerificationEmail(user: User | { email: string; firstName?: string }): Promise<void> {
    this.logger.log(`[TODO] Verification email to ${user.email}`);
  }

  async sendPasswordChangedEmail(user: User | { email: string }): Promise<void> {
    this.logger.log(`[TODO] Password changed email to ${user.email}`);
  }

  async sendOrderConfirmationEmail(email: string, orderId: string): Promise<void> {
    this.logger.log(`[TODO] Order confirmation to ${email} for order ${orderId}`);
  }

  async sendTicketConfirmation(email: string, orderId: string): Promise<void> {
    this.logger.log(`[TODO] Ticket confirmation to ${email} for order ${orderId}`);
  }

  async sendEmailVerification(email: string, token: string): Promise<void> {
    this.logger.log(`[TODO] Email verification to ${email}`);
  }
}
