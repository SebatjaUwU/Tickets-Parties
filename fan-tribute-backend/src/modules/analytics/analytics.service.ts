import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Order } from '../tickets/entities/order.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
  ) {}

  async getOverview() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, activeEvents, ticketsSold, salesTodayResult, salesMonthResult, totalRevenueResult, avgTicketResult, salesByDayRaw] = await Promise.all([
      this.userRepo.count(),
      this.eventRepo.count({ where: { status: 'published' } }),
      this.ticketRepo.count(),
      this.orderRepo
        .createQueryBuilder('o')
        .select('COALESCE(SUM(CAST(o.total AS DECIMAL)), 0)', 'total')
        .where('o.status = :s', { s: 'completed' })
        .andWhere('o.createdAt >= :d', { d: startOfDay })
        .getRawOne(),
      this.orderRepo
        .createQueryBuilder('o')
        .select('COALESCE(SUM(CAST(o.total AS DECIMAL)), 0)', 'total')
        .where('o.status = :s', { s: 'completed' })
        .andWhere('o.createdAt >= :d', { d: startOfMonth })
        .getRawOne(),
      this.orderRepo
        .createQueryBuilder('o')
        .select('COALESCE(SUM(CAST(o.total AS DECIMAL)), 0)', 'total')
        .where('o.status = :s', { s: 'completed' })
        .getRawOne(),
      this.orderRepo
        .createQueryBuilder('o')
        .select('COALESCE(AVG(CAST(o.total AS DECIMAL)), 0)', 'avg')
        .where('o.status = :s', { s: 'completed' })
        .getRawOne(),
      this.orderRepo
        .createQueryBuilder('o')
        .select('DATE(o.createdAt)', 'date')
        .addSelect('COALESCE(SUM(CAST(o.total AS DECIMAL)), 0)', 'total')
        .where('o.status = :s', { s: 'completed' })
        .andWhere('o.createdAt >= :d', { d: sevenDaysAgo })
        .groupBy('DATE(o.createdAt)')
        .orderBy('DATE(o.createdAt)', 'ASC')
        .getRawMany(),
    ]);

    return {
      totalSalesToday: Number(salesTodayResult?.total ?? 0),
      totalSalesMonth: Number(salesMonthResult?.total ?? 0),
      totalRevenue: Number(totalRevenueResult?.total ?? 0),
      totalUsers,
      activeEvents,
      ticketsSold,
      conversionRate: 3.4,
      avgTicketPrice: Number(avgTicketResult?.avg ?? 0),
      onlineUsers: 0,
      salesByDay: salesByDayRaw.map((r: any) => ({ date: r.date, total: Number(r.total) })),
      topEvents: [],
      revenueByProvider: [],
    };
  }

  async getRealtimeData() {
    return {
      salesLast5Min: 0, onlineUsers: 0, activeCheckouts: 0,
      recentOrders: [], ticketsSoldToday: 0, revenueToday: 0,
    };
  }
}
