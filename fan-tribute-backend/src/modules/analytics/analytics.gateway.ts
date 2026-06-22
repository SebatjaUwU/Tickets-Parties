import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection,
  OnGatewayDisconnect, ConnectedSocket, MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsService } from './analytics.service';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
  namespace: '/',
})
export class AnalyticsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('AnalyticsGateway');

  private onlineUsers = new Map<string, string>(); // socketId -> userId

  constructor(private readonly analyticsService: AnalyticsService) {}

  handleConnection(client: Socket) {
    this.onlineUsers.set(client.id, client.id);
    this.broadcastOnlineCount();
    this.logger.log(`Client connected: ${client.id} | Total: ${this.onlineUsers.size}`);
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers.delete(client.id);
    this.broadcastOnlineCount();
    this.logger.log(`Client disconnected: ${client.id} | Total: ${this.onlineUsers.size}`);
  }

  @SubscribeMessage('join:event')
  handleJoinEvent(@ConnectedSocket() client: Socket, @MessageBody() data: { eventId: string }) {
    client.join(`event:${data.eventId}`);
    this.logger.log(`${client.id} joined event room: ${data.eventId}`);
  }

  @SubscribeMessage('join:admin')
  handleJoinAdmin(@ConnectedSocket() client: Socket) {
    client.join('admin');
  }

  // Broadcast realtime analytics every 5 seconds to admin room
  @Cron(CronExpression.EVERY_5_SECONDS)
  async broadcastRealtimeAnalytics() {
    try {
      const data = await this.analyticsService.getRealtimeData();
      this.server.to('admin').emit('analytics:realtime', {
        ...data,
        onlineUsers: this.onlineUsers.size,
      });
    } catch (error) {
      this.logger.error('Error broadcasting analytics', error);
    }
  }

  // Called by payments service when a payment is confirmed
  emitPaymentConfirmed(orderId: string, userId: string) {
    this.server.emit('payment:confirmed', { orderId, userId });
  }

  // Called by tickets service when a ticket is validated
  emitTicketValidated(ticketId: string, eventId: string) {
    this.server.to(`event:${eventId}`).emit('ticket:validated', { ticketId, eventId });
  }

  // Called by events service when event sells out
  emitEventSoldOut(eventId: string) {
    this.server.emit('event:sold_out', { eventId });
  }

  private broadcastOnlineCount() {
    this.server.emit('users:online', { count: this.onlineUsers.size });
  }
}
