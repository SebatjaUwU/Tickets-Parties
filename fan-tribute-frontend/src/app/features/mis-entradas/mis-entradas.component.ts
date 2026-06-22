import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface OrderResumen {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  items: { ticketTier: { name: string }; quantity: number; unitPrice: number }[];
}

@Component({
  selector: 'app-mis-entradas',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4 max-w-4xl">

        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-white font-display">Mis Entradas</h1>
          <a routerLink="/eventos" class="btn-primary text-sm">Ver Eventos</a>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-20">
            <div class="w-12 h-12 border-4 border-electric-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else if (orders().length === 0) {
          <div class="glass-card rounded-2xl p-16 text-center">
            <p class="text-6xl mb-4">🎟️</p>
            <h2 class="text-2xl font-bold text-white mb-2">Aún no tienes entradas</h2>
            <p class="text-gray-400 mb-6">Explora los eventos disponibles y consigue tus tickets</p>
            <a routerLink="/eventos" class="btn-primary">Ver Eventos</a>
          </div>
        } @else {
          <div class="space-y-4">
            @for (order of orders(); track order.id) {
              <div class="glass-card rounded-2xl p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <span class="text-xs text-gray-500 font-mono">{{ order.orderNumber }}</span>
                    <p class="text-gray-400 text-sm mt-0.5">{{ order.createdAt | date:'d MMMM yyyy, h:mm a' }}</p>
                  </div>
                  <span
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                    [class]="order.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'"
                  >
                    {{ order.status === 'completed' ? '✓ Pagado' : 'Pendiente' }}
                  </span>
                </div>

                <div class="space-y-2 mb-4">
                  @for (item of order.items; track $index) {
                    <div class="flex items-center justify-between text-sm bg-white/5 rounded-xl px-4 py-3">
                      <div class="flex items-center gap-3">
                        <span class="text-2xl">🎫</span>
                        <div>
                          <p class="text-white font-semibold">{{ item.ticketTier?.name }}</p>
                          <p class="text-gray-400 text-xs">× {{ item.quantity }}</p>
                        </div>
                      </div>
                      <span class="text-white font-bold">
                        {{ item.unitPrice * item.quantity | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </span>
                    </div>
                  }
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-white/10">
                  <span class="text-gray-400 text-sm">Total pagado</span>
                  <span class="text-xl font-black text-white font-display">
                    {{ order.total | currency:'COP':'symbol-narrow':'1.0-0' }}
                  </span>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class MisEntradasComponent implements OnInit {
  private readonly http = inject(HttpClient);

  orders = signal<OrderResumen[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.http.get<OrderResumen[]>(`${environment.apiUrl}/tickets/orders`).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
