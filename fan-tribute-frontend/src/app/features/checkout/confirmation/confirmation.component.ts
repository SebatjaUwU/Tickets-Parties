import { Component, OnInit, inject, input, signal, DestroyRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { Order } from '../../../shared/models';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4 max-w-2xl text-center">

        @if (loading()) {
          <div class="glass-card rounded-2xl p-12">
            <div class="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-400">Cargando confirmación...</p>
          </div>

        } @else if (order() && order()!.status === 'completed') {
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

        } @else if (order() && order()!.status === 'pending') {
          <!-- Pending state: Wompi sandbox redirect returned but webhook hasn't fired yet -->
          <div class="glass-card rounded-2xl p-12">
            <div class="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
              <span class="text-4xl">⏳</span>
            </div>
            <h1 class="text-2xl font-rajdhani font-bold text-white mb-2">Pago en verificación</h1>
            <p class="text-gray-400 mb-6">
              Orden <span class="text-electric-blue font-mono">#{{ order()!.orderNumber }}</span>.
              Wompi está procesando tu pago — esto puede tardar unos segundos.
            </p>

            @if (devConfirming()) {
              <div class="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            } @else {
              <button (click)="pollOrDevConfirm()" class="btn-primary mb-4">
                Verificar estado del pago
              </button>
            }
            @if (devMsg()) {
              <p class="text-sm mt-2" [class.text-green-400]="devMsgOk()" [class.text-red-400]="!devMsgOk()">
                {{ devMsg() }}
              </p>
            }
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
  private readonly destroyRef = inject(DestroyRef);
  order = signal<Order | null>(null);
  loading = signal(true);
  devConfirming = signal(false);
  devMsg = signal<string | null>(null);
  devMsgOk = signal(false);

  ngOnInit(): void {
    if (this.orderId()) {
      this.fetchOrder();
    } else {
      this.loading.set(false);
    }
  }

  private fetchOrder(): void {
    this.http.get<Order>(`${environment.apiUrl}/payments/order/${this.orderId()}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order) => {
          this.order.set(order);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  pollOrDevConfirm(): void {
    if (this.devConfirming()) return;
    this.devConfirming.set(true);
    this.devMsg.set(null);

    this.http.get<Order>(`${environment.apiUrl}/payments/order/${this.orderId()}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order) => {
          if (order.status === 'completed') {
            this.order.set(order);
            this.devConfirming.set(false);
            return;
          }
          this.http
            .post<{ message: string }>(`${environment.apiUrl}/payments/dev/confirm/${this.orderId()}`, {})
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.devMsgOk.set(true);
                this.devMsg.set('Pago confirmado. Cargando orden...');
                this.devConfirming.set(false);
                this.fetchOrder();
              },
              error: (err) => {
                this.devConfirming.set(false);
                this.devMsgOk.set(false);
                this.devMsg.set(err?.error?.message ?? 'No se pudo confirmar el pago.');
              },
            });
        },
        error: () => {
          this.devConfirming.set(false);
          this.devMsg.set('Error al consultar el estado de la orden.');
          this.devMsgOk.set(false);
        },
      });
  }
}
