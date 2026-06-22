import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { DashboardOverview } from '../../../shared/models';

@Component({
  selector: 'ft-dashboard-overview',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DecimalPipe, PercentPipe, RouterLink],
  template: `
    <div class="p-6 space-y-6">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-white font-display">Dashboard</h1>
          <p class="text-gray-400 text-sm mt-1">
            Resumen en tiempo real ·
            <span class="inline-flex items-center gap-1 text-green-400">
              <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              {{ onlineUsers() }} usuarios en línea
            </span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn-ghost text-sm px-4 py-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Exportar
          </button>
          <button class="btn-primary text-sm px-4 py-2" routerLink="/dashboard/eventos">
            + Crear Evento
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        @for (kpi of kpis(); track kpi.label) {
          <div class="glass-dark rounded-2xl p-5 relative overflow-hidden group hover:border-electric-blue-500/30 border border-transparent transition-all duration-300">
            <!-- Glow on hover -->
            <div class="absolute inset-0 bg-electric-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div class="flex items-center justify-between mb-3">
              <div class="text-2xl">{{ kpi.icon }}</div>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                [class.text-green-400]="kpi.change >= 0"
                [class.bg-green-500]="kpi.change >= 0"
                [class.bg-opacity-10]="kpi.change >= 0"
                [class.text-red-400]="kpi.change < 0"
                [class.bg-red-500]="kpi.change < 0"
              >
                {{ kpi.change >= 0 ? '+' : '' }}{{ kpi.change }}%
              </span>
            </div>

            <div class="text-2xl font-black text-white font-display mb-1">
              @if (kpi.isCurrency) {
                {{ kpi.value | currency:'COP':'symbol-narrow':'1.0-0' }}
              } @else if (kpi.isPercent) {
                {{ kpi.value | percent:'1.1-1' }}
              } @else {
                {{ kpi.value | number }}
              }
            </div>
            <p class="text-gray-400 text-xs font-medium">{{ kpi.label }}</p>
          </div>
        }
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Sales chart -->
        <div class="lg:col-span-2 glass-dark rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-white font-display">Ventas del Mes</h2>
            <div class="flex items-center gap-2">
              @for (period of ['7d', '30d', '90d']; track period) {
                <button
                  class="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  [class.bg-electric-blue-500]="selectedPeriod() === period"
                  [class.text-white]="selectedPeriod() === period"
                  [class.text-gray-400]="selectedPeriod() !== period"
                  [class.hover:text-white]="selectedPeriod() !== period"
                  (click)="selectedPeriod.set(period)"
                >{{ period }}</button>
              }
            </div>
          </div>
          <!-- Chart placeholder — real implementation uses ApexCharts -->
          <div class="h-48 flex items-end gap-1">
            @for (bar of chartBars(); track $index) {
              <div class="flex-1 rounded-t-sm transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                [style.height.%]="bar.height"
                [style.background]="'linear-gradient(to top, #0099FF, #0A1F44)'"
                [title]="bar.label + ': ' + bar.value"
              >
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-blue-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {{ bar.label }}: {{ bar.value | currency:'COP':'symbol-narrow':'1.0-0' }}
                </div>
              </div>
            }
          </div>
          <div class="flex justify-between text-gray-500 text-xs mt-2">
            <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="glass-dark rounded-2xl p-6 space-y-4">
          <h2 class="text-lg font-bold text-white font-display">Distribución por método de pago</h2>
          @for (method of paymentMethods(); track method.name) {
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-300">{{ method.name }}</span>
                <span class="text-white font-semibold">{{ method.percent }}%</span>
              </div>
              <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  [style.width.%]="method.percent"
                  [style.background]="method.color"
                ></div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Events and Recent Orders -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Top Events -->
        <div class="glass-dark rounded-2xl p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-bold text-white font-display">Top Eventos</h2>
            <a routerLink="/dashboard/eventos" class="text-electric-blue-400 text-sm hover:text-electric-blue-300">Ver todos →</a>
          </div>
          <div class="space-y-3">
            @for (event of topEvents(); track event.id; let i = $index) {
              <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                  [style.background]="i === 0 ? 'linear-gradient(135deg,#FFD700,#FF8C00)' : i === 1 ? 'rgba(192,192,192,0.2)' : 'rgba(205,127,50,0.2)'"
                  [style.color]="i === 0 ? '#000' : '#fff'"
                >{{ i + 1 }}</div>
                <div class="flex-1 min-w-0">
                  <p class="text-white text-sm font-semibold truncate">{{ event.title }}</p>
                  <p class="text-gray-400 text-xs">{{ event.sold }} entradas · {{ event.revenue | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
                </div>
                <div class="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-electric-blue-500 rounded-full" [style.width.%]="event.percent"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Recent Sales -->
        <div class="glass-dark rounded-2xl p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-bold text-white font-display">Últimas Ventas</h2>
            <span class="text-green-400 text-xs font-semibold flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              En vivo
            </span>
          </div>
          <div class="space-y-3">
            @for (sale of recentSales(); track sale.id) {
              <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all animate-fade-in">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue-500 to-edm-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {{ sale.userName.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-white text-sm font-semibold truncate">{{ sale.userName }}</p>
                  <p class="text-gray-400 text-xs truncate">{{ sale.eventName }} · {{ sale.tierName }}</p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-white text-sm font-bold">{{ sale.amount | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
                  <p class="text-gray-500 text-xs">{{ sale.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OverviewComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private socket?: Socket;

  onlineUsers = signal(0);
  selectedPeriod = signal('30d');

  kpis = signal([
    { label: 'Ventas hoy', value: 4250000, isCurrency: true, isPercent: false, change: 12, icon: '💰' },
    { label: 'Ventas del mes', value: 87500000, isCurrency: true, isPercent: false, change: 8, icon: '📈' },
    { label: 'Entradas vendidas', value: 1243, isCurrency: false, isPercent: false, change: 15, icon: '🎫' },
    { label: 'Usuarios registrados', value: 25847, isCurrency: false, isPercent: false, change: 5, icon: '👥' },
    { label: 'Eventos activos', value: 12, isCurrency: false, isPercent: false, change: 2, icon: '🎪' },
    { label: 'Tasa de conversión', value: 0.034, isCurrency: false, isPercent: true, change: 3, icon: '⚡' },
    { label: 'Ticket promedio', value: 280000, isCurrency: true, isPercent: false, change: -2, icon: '🎯' },
    { label: 'Usuarios en línea', value: 0, isCurrency: false, isPercent: false, change: 0, icon: '🟢' },
  ]);

  chartBars = signal(
    [65, 80, 45, 90, 70, 100, 55].map((h, i) => ({
      height: h,
      label: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][i],
      value: h * 500000,
    }))
  );

  paymentMethods = signal([
    { name: 'Tarjeta Crédito', percent: 38, color: '#0099FF' },
    { name: 'Nequi', percent: 27, color: '#9B59B6' },
    { name: 'PSE', percent: 20, color: '#27AE60' },
    { name: 'Stripe', percent: 10, color: '#FF6A00' },
    { name: 'Daviplata', percent: 5, color: '#E74C3C' },
  ]);

  topEvents = signal([
    { id: '1', title: 'Ultra Colombia 2025', sold: 542, revenue: 135500000, percent: 100 },
    { id: '2', title: 'Tomorrowland Bogotá', sold: 421, revenue: 102200000, percent: 78 },
    { id: '3', title: 'EDC Medellín Night', sold: 280, revenue: 71400000, percent: 52 },
  ]);

  recentSales = signal([
    { id: '1', userName: 'Alejandro M.', eventName: 'Ultra Colombia', tierName: 'VIP', amount: 350000, time: 'hace 2 min' },
    { id: '2', userName: 'Valentina R.', eventName: 'Tomorrowland', tierName: 'General', amount: 180000, time: 'hace 5 min' },
    { id: '3', userName: 'Carlos H.', eventName: 'EDC Medellín', tierName: 'Platinum', amount: 620000, time: 'hace 8 min' },
    { id: '4', userName: 'Daniela P.', eventName: 'Ultra Colombia', tierName: 'Early Bird', amount: 120000, time: 'hace 12 min' },
  ]);

  ngOnInit(): void {
    this.connectWebSocket();
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.socket?.disconnect();
  }

  private connectWebSocket(): void {
    this.socket = io(environment.wsUrl);
    this.socket.emit('join:admin');

    this.socket.on('analytics:realtime', (data: any) => {
      this.onlineUsers.set(data.onlineUsers ?? 0);
      this.kpis.update(kpis => kpis.map(k =>
        k.label === 'Usuarios en línea' ? { ...k, value: data.onlineUsers } : k
      ));
    });

    this.socket.on('payment:confirmed', (data: any) => {
      // Add new sale to recent list
      this.recentSales.update(sales => [
        {
          id: data.orderId,
          userName: 'Nuevo cliente',
          eventName: '—',
          tierName: '—',
          amount: data.amount ?? 0,
          time: 'ahora',
        },
        ...sales.slice(0, 3),
      ]);
    });
  }

  private loadDashboard(): void {
    this.http.get<DashboardOverview>(`${environment.apiUrl}/analytics/overview`).subscribe({
      next: (data) => {
        // Populate from real API when available
      },
    });
  }
}
