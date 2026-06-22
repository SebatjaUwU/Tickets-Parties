import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async generateTicket(ticket: any, event: any): Promise<Buffer> {
    this.logger.log(`[TODO] Generate PDF for ticket ${ticket.id}`);
    return Buffer.from(`TICKET PDF - ${ticket.ticketNumber}`);
  }
}
