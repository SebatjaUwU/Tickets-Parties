import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../../../core/services/cart.service';
import { CartActions } from '../../../store/cart/cart.actions';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4 max-w-4xl">
        <h1 class="text-3xl font-rajdhani font-bold text-white mb-8">Carrito de compras</h1>

        @if (cartService.items().length === 0) {
          <div class="glass-card rounded-2xl p-12 text-center">
            <p class="text-6xl mb-4">🎟️</p>
            <h2 class="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h2>
            <p class="text-gray-400 mb-6">Explora nuestros eventos y consigue tus entradas</p>
            <a routerLink="/eventos" class="btn-primary">Ver Eventos</a>
          </div>
        } @else {
          <div class="space-y-4 mb-8">
            @for (item of cartService.items(); track item.tierId) {
              <div class="glass rounded-2xl p-5 flex items-center justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-white font-semibold">{{ item.eventTitle }}</h3>
                  <p class="text-gray-400 text-sm">{{ item.tierName }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <button (click)="decrement(item.tierId)" class="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-electric-blue/20 transition-colors">-</button>
                  <span class="text-white font-bold w-4 text-center">{{ item.quantity }}</span>
                  <button (click)="increment(item.tierId)" class="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-electric-blue/20 transition-colors">+</button>
                </div>
                <div class="text-electric-blue font-bold w-24 text-right">
                  {{ item.unitPrice * item.quantity | currency:'COP':'symbol-narrow':'1.0-0' }}
                </div>
                <button (click)="remove(item.tierId)" class="text-gray-500 hover:text-red-400 transition-colors">✕</button>
              </div>
            }
          </div>

          <!-- Summary -->
          <div class="glass-card rounded-2xl p-6">
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>{{ cartService.subtotal() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Cargo por servicio (5%)</span>
                <span>{{ cartService.serviceFee() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
              <div class="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-xl">
                <span>Total</span>
                <span class="text-electric-blue">{{ cartService.total() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
            </div>
            <button
              (click)="proceedToPayment()"
              [disabled]="creatingOrder()"
              class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (creatingOrder()) { Preparando orden... } @else { Proceder al pago }
            </button>
          </div>
        }
      </div>
    </section>
  `,
})
export class CartComponent {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  readonly cartService = inject(CartService);
  creatingOrder = signal(false);

  constructor() {
    // Reset loading on success or failure
    this.actions$.pipe(
      ofType(CartActions.createOrderSuccess, CartActions.createOrderFailure),
      takeUntilDestroyed(),
    ).subscribe(() => this.creatingOrder.set(false));
  }

  proceedToPayment(): void {
    this.creatingOrder.set(true);
    this.store.dispatch(CartActions.createOrder());
  }

  increment(tierId: string): void {
    const item = this.cartService.items().find(i => i.tierId === tierId);
    if (item) {
      this.store.dispatch(CartActions.updateQuantity({ tierId, quantity: item.quantity + 1 }));
    }
  }

  decrement(tierId: string): void {
    const item = this.cartService.items().find(i => i.tierId === tierId);
    if (item && item.quantity > 1) {
      this.store.dispatch(CartActions.updateQuantity({ tierId, quantity: item.quantity - 1 }));
    } else {
      this.remove(tierId);
    }
  }

  remove(tierId: string): void {
    this.store.dispatch(CartActions.removeItem({ tierId }));
  }
}
