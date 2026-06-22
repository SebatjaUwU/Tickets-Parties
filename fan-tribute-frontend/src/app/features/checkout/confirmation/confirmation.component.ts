import { Component, OnInit, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Order } from '../../../shared/models';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4 max-w-2xl text-center">

        @if (loading()) {
          <div class="glass-card rounded-2xl p-12">
            <div class="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-400">Cargando confirmación...</p>
          </div>
        } @else if (order()) {
          <!-- Success state -->
          <div class="glass-card rounded-2xl p-12">
            <div class="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <span class="text-4xl text-green-400">✓</span>
            </div>
            <h1 class="text-3xl font-rajdhani font-bold text-white mb-2">¡Compra exitosa!</h1>
            <p class="text-gray-400 mb-8">
              Tu orden <span class="text-electric-blue font-mono">#{{ order()!.orderNumber }}</span> ha sido procesada.
              Recibirás las entradas en tu email.
            </p>

            <div class="glass rounded-xl p-5 text-left mb-8 space-y-3">
              @for (item of order()!.items; track item.id) {
                <div class="flex justify-between text-sm">
                  <span class="text-gray-300">{{ item.ticketTier.name }} × {{ item.quantity }}</span>
                  <span class="text-white">{{ item.unitPrice * item.quantity | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                </div>
              }
              <div class="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span class="text-white">Total pagado</span>
                <span class="text-electric-blue">{{ order()!.total | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
            </div>

            <div class="flex gap-4 justify-center flex-wrap">
              <a routerLink="/mis-entradas" class="btn-primary">Ver mis entradas</a>
              <a routerLink="/eventos" class="btn-ghost">Más eventos</a>
            </div>
          </div>
        } @else {
          <div class="glass-card rounded-2xl p-12">
            <p class="text-6xl mb-4">😞</p>
            <h2 class="text-2xl font-bold text-white mb-2">Orden no encontrada</h2>
            <a routerLink="/" class="btn-ghost mt-4 inline-block">Volver al inicio</a>
          </div>
        }

      </div>
    </section>
  `,
})
export class ConfirmationComponent implements OnInit {
  readonly orderId = input<string>('');

  private readonly http = inject(HttpClient);
  order = signal<Order | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    if (this.orderId()) {
      this.http.get<Order>(`${environment.apiUrl}/tickets/orders/${this.orderId()}`).subscribe({
        next: (order) => {
          this.order.set(order);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.loading.set(false);
    }
  }
}
