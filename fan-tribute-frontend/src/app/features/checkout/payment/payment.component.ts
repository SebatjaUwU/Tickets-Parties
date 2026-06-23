import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../../../core/services/cart.service';
import { CartActions } from '../../../store/cart/cart.actions';
import { environment } from '../../../../environments/environment';

type PaymentMethod = 'wompi_pse' | 'wompi_nequi' | 'wompi_daviplata';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4 max-w-2xl">
        <h1 class="text-3xl font-rajdhani font-bold text-white mb-8">Método de pago</h1>

        @if (!orderId()) {
          <div class="glass-card rounded-2xl p-8 text-center">
            <p class="text-red-400 text-lg">No se encontró una orden activa.</p>
            <p class="text-gray-400 text-sm mt-2">Por favor regresa al carrito e intenta de nuevo.</p>
          </div>
        } @else {
          <!-- Order summary -->
          <div class="glass rounded-2xl p-5 mb-6">
            <h3 class="text-white font-semibold mb-3">Resumen del pedido</h3>
            @for (item of cartService.items(); track item.tierId) {
              <div class="flex justify-between text-sm text-gray-300 py-1">
                <span>{{ item.eventTitle }} × {{ item.quantity }}</span>
                <span>{{ item.unitPrice * item.quantity | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
            }
            <div class="border-t border-white/10 mt-3 pt-3 flex justify-between font-bold text-white">
              <span>Total</span>
              <span class="text-electric-blue">{{ cartService.total() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
            </div>
          </div>

          <!-- Payment methods -->
          <div class="glass-card rounded-2xl p-6 mb-6">
            <h3 class="text-white font-semibold mb-4">Selecciona tu método de pago</h3>
            <div class="space-y-3">
              @for (method of paymentMethods; track method.id) {
                <button
                  (click)="selectedMethod.set(method.id)"
                  [class.border-electric-blue]="selectedMethod() === method.id"
                  class="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-electric-blue/50 transition-all"
                >
                  <span class="text-2xl">{{ method.icon }}</span>
                  <div class="text-left">
                    <p class="text-white font-medium">{{ method.name }}</p>
                    <p class="text-xs text-gray-400">{{ method.description }}</p>
                  </div>
                  @if (selectedMethod() === method.id) {
                    <span class="ml-auto text-electric-blue font-bold">✓</span>
                  }
                </button>
              }
            </div>
          </div>

          @if (errorMsg()) {
            <div class="glass rounded-xl p-4 mb-4 border border-red-500/40 text-red-400 text-sm">
              {{ errorMsg() }}
            </div>
          }

          <button
            [disabled]="!selectedMethod() || loading()"
            (click)="onPay()"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (loading()) {
              Procesando pago...
            } @else {
              Pagar {{ cartService.total() | currency:'COP':'symbol-narrow':'1.0-0' }}
            }
          </button>
        }
      </div>
    </section>
  `,
})
export class PaymentComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  readonly cartService = inject(CartService);

  orderId = signal<string | null>(null);
  selectedMethod = signal<PaymentMethod | null>(null);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  readonly paymentMethods: { id: PaymentMethod; icon: string; name: string; description: string }[] = [
    { id: 'wompi_pse',       icon: '🏦', name: 'PSE',       description: 'Débito bancario en línea' },
    { id: 'wompi_nequi',     icon: '📱', name: 'Nequi',     description: 'Paga desde tu app Nequi' },
    { id: 'wompi_daviplata', icon: '📲', name: 'Daviplata', description: 'Paga desde tu app Daviplata' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('orderId');
    if (id) this.orderId.set(id);
  }

  onPay(): void {
    const method = this.selectedMethod();
    const id = this.orderId();
    if (!method || !id) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    const wompiMethod = method.replace('wompi_', '');
    this.http
      .post<{ wompiCheckoutUrl?: string; redirectUrl?: string }>(
        `${environment.apiUrl}/payments/wompi/initiate`,
        { orderId: id, method: wompiMethod },
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.store.dispatch(CartActions.clearCart());
          const target = res.wompiCheckoutUrl ?? res.redirectUrl;
          if (target && this.isSafeUrl(target)) {
            window.location.href = target;
          } else {
            this.router.navigate(['/checkout/confirmacion', id]);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(err?.error?.message ?? 'Error al iniciar el pago. Inténtalo de nuevo.');
        },
      });
  }

  private isSafeUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
      return false;
    }
  }
}
