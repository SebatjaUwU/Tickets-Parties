import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { Store } from '@ngrx/store';
import { CartActions } from '../../../store/cart/cart.actions';

type PaymentMethod = 'stripe' | 'wompi_pse' | 'wompi_nequi' | 'wompi_daviplata' | 'mercadopago';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4 max-w-2xl">
        <h1 class="text-3xl font-rajdhani font-bold text-white mb-8">Método de pago</h1>

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
            <!-- International -->
            <p class="text-xs uppercase tracking-wider text-gray-500 pt-2">Internacional</p>
            @for (method of internationalMethods; track method.id) {
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

            <!-- Colombia -->
            <p class="text-xs uppercase tracking-wider text-gray-500 pt-2">Colombia</p>
            @for (method of colombiaMethods; track method.id) {
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
      </div>
    </section>
  `,
})
export class PaymentComponent {
  private readonly store = inject(Store);
  readonly cartService = inject(CartService);

  selectedMethod = signal<PaymentMethod | null>(null);
  loading = signal(false);

  internationalMethods = [
    { id: 'stripe' as PaymentMethod, icon: '💳', name: 'Tarjeta de crédito/débito', description: 'Visa, Mastercard, Amex — via Stripe' },
    { id: 'mercadopago' as PaymentMethod, icon: '🛒', name: 'MercadoPago', description: 'Todas las opciones MercadoPago' },
  ];

  colombiaMethods = [
    { id: 'wompi_pse' as PaymentMethod, icon: '🏦', name: 'PSE', description: 'Débito bancario en línea' },
    { id: 'wompi_nequi' as PaymentMethod, icon: '📱', name: 'Nequi', description: 'Paga desde tu app Nequi' },
    { id: 'wompi_daviplata' as PaymentMethod, icon: '📲', name: 'Daviplata', description: 'Paga desde tu app Daviplata' },
  ];

  onPay(): void {
    if (!this.selectedMethod()) return;
    this.loading.set(true);
    this.store.dispatch(CartActions.createOrder());
  }
}
