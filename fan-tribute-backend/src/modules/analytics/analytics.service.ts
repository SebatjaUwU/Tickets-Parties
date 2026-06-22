import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  getOverview() {
    return {
      totalSalesToday: 0, totalSalesMonth: 0, totalRevenue: 0,
      totalUsers: 0, activeEvents: 0, ticketsSold: 0,
      conversionRate: 0, avgTicketPrice: 0, onlineUsers: 0,
      salesByDay: [], topEvents: [], revenueByProvider: [],
    };
  }

  async getRealtimeData() {
    return {
      salesLast5Min: 0, onlineUsers: 0, activeCheckouts: 0,
      recentOrders: [], ticketsSoldToday: 0, revenueToday: 0,
    };
  }
}
