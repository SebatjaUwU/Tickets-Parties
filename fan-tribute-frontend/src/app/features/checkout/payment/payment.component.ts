import { Component, OnInit, inject, signal, input, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface Tier {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantityAvailable?: number;
  maxPerOrder: number;
  isActive: boolean;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4 max-w-2xl">

        <!-- Header -->
        <div class="text-center mb-8">
          <p class="text-electric-blue text-sm font-semibold uppercase tracking-widest mb-2">Checkout seguro</p>
          <h1 class="text-3xl font-rajdhani font-bold text-white">Comprar Entradas</h1>
        </div>

        @if (!eventId()) {
          <!-- No event selected -->
          <div class="glass-card rounded-2xl p-12 text-center">
            <p class="text-5xl mb-4">🎟️</p>
            <h2 class="text-xl font-bold text-white mb-2">Ningún evento seleccionado</h2>
            <a routerLink="/eventos" class="btn-primary mt-4 inline-block">Ver Eventos</a>
          </div>

        } @else if (loadingTiers()) {
          <!-- Loading tiers -->
          <div class="space-y-4">
            @for (s of [1,2]; track s) {
              <div class="glass rounded-2xl p-5 animate-pulse">
                <div class="h-5 bg-white/10 rounded w-1/3 mb-2"></div>
                <div class="h-4 bg-white/10 rounded w-1/4"></div>
              </div>
            }
          </div>

        } @else if (tiersError()) {
          <div class="glass-card rounded-2xl p-8 text-center text-red-400">
            {{ tiersError() }}
            <br>
            <a routerLink="/eventos" class="btn-ghost mt-4 inline-block">Volver a eventos</a>
          </div>

        } @else {

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">

            <!-- Ticket selection -->
            <div class="glass-dark rounded-2xl p-6">
              <h2 class="text-lg font-bold text-white font-display mb-4">Selecciona tus entradas</h2>
              <div class="space-y-3">
                @for (tier of tiers(); track tier.id) {
                  <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-electric-blue/40 transition-colors">
                    <div class="flex-1">
                      <p class="text-white font-semibold">{{ tier.name }}</p>
                      @if (tier.description) {
                        <p class="text-gray-400 text-sm">{{ tier.description }}</p>
                      }
                      <p class="text-electric-blue font-bold mt-1">
                        {{ tier.price | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </p>
                    </div>
                    <div class="flex items-center gap-3 ml-4">
                      <button
                        type="button"
                        (click)="decrement(tier.id)"
                        [disabled]="(quantities()[tier.id] ?? 0) === 0"
                        class="w-9 h-9 rounded-full glass text-white hover:bg-electric-blue/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-lg"
                      >-</button>
                      <span class="text-white font-bold w-5 text-center">{{ quantities()[tier.id] ?? 0 }}</span>
                      <button
                        type="button"
                        (click)="increment(tier.id)"
                        [disabled]="(quantities()[tier.id] ?? 0) >= tier.maxPerOrder"
                        class="w-9 h-9 rounded-full glass text-white hover:bg-electric-blue/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-lg"
                      >+</button>
                    </div>
                  </div>
                }
              </div>
            </div>

            @if (hasItems()) {
              <!-- Subtotal -->
              <div class="glass-dark rounded-2xl p-4 space-y-2 text-sm">
                <div class="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{{ subtotal() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                </div>
                <div class="flex justify-between text-gray-400">
                  <span>Cargo por servicio (5%)</span>
                  <span>{{ serviceFee() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                </div>
                <div class="flex justify-between text-white font-bold text-base border-t border-white/10 pt-2">
                  <span>Total</span>
                  <span class="text-electric-blue">{{ total() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                </div>
              </div>

              <!-- Buyer info -->
              <div class="glass-dark rounded-2xl p-6">
                <h2 class="text-lg font-bold text-white font-display mb-4">Tus datos</h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-gray-300 text-sm mb-1">Nombre completo *</label>
                    <input
                      formControlName="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue/60 transition-colors"
                    />
                    @if (form.get('name')?.invalid && form.get('name')?.touched) {
                      <p class="text-red-400 text-xs mt-1">Nombre requerido (mínimo 3 caracteres)</p>
                    }
                  </div>
                  <div>
                    <label class="block text-gray-300 text-sm mb-1">Email *</label>
                    <input
                      formControlName="email"
                      type="email"
                      placeholder="tu@email.com"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue/60 transition-colors"
                    />
                    @if (form.get('email')?.invalid && form.get('email')?.touched) {
                      <p class="text-red-400 text-xs mt-1">Email inválido</p>
                    }
                    <p class="text-gray-500 text-xs mt-1">Recibirás tu entrada en este correo</p>
                  </div>
                  <div>
                    <label class="block text-gray-300 text-sm mb-1">Teléfono / WhatsApp *</label>
                    <input
                      formControlName="phone"
                      type="tel"
                      placeholder="3001234567"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue/60 transition-colors"
                    />
                    @if (form.get('phone')?.invalid && form.get('phone')?.touched) {
                      <p class="text-red-400 text-xs mt-1">Teléfono requerido</p>
                    }
                  </div>
                </div>
              </div>

              @if (submitError()) {
                <p class="text-red-400 text-sm text-center p-3 glass rounded-xl border border-red-500/20">
                  {{ submitError() }}
                </p>
              }

              <!-- Pay button -->
              <button
                type="submit"
                [disabled]="form.invalid || submitting()"
                class="btn-primary w-full py-4 text-lg font-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (submitting()) {
                  <span class="flex items-center justify-center gap-3">
                    <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Redirigiendo a pago seguro...
                  </span>
                } @else {
                  🔒 Pagar con Wompi — {{ total() | currency:'COP':'symbol-narrow':'1.0-0' }}
                }
              </button>

              <p class="text-center text-gray-500 text-xs">
                Serás redirigido a Wompi, la plataforma de pagos segura de Bancolombia.
                Acepta tarjetas, PSE, Nequi y Daviplata.
              </p>
            }

          </form>
        }
      </div>
    </section>
  `,
})
export class PaymentComponent implements OnInit {
  readonly eventId = input<string>('');

  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  tiers = signal<Tier[]>([]);
  quantities = signal<Record<string, number>>({});
  loadingTiers = signal(true);
  tiersError = signal<string | null>(null);
  submitting = signal(false);
  submitError = signal<string | null>(null);

  readonly form = this.fb.group({
    name:  ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
  });

  readonly subtotal = computed(() =>
    this.tiers().reduce((s, t) => s + (this.quantities()[t.id] ?? 0) * t.price, 0)
  );
  readonly serviceFee = computed(() => Math.round(this.subtotal() * 0.05));
  readonly total = computed(() => this.subtotal() + this.serviceFee());
  readonly hasItems = computed(() => Object.values(this.quantities()).some(q => q > 0));

  ngOnInit(): void {
    if (this.eventId()) {
      this.loadTiers();
    } else {
      this.loadingTiers.set(false);
    }
  }

  private loadTiers(): void {
    this.http.get<Tier[]>(`${environment.apiUrl}/events/${this.eventId()}/tickets`).subscribe({
      next: (tiers) => {
        const active = tiers.filter(t => t.isActive);
        this.tiers.set(active);
        const q: Record<string, number> = {};
        active.forEach(t => (q[t.id] = 0));
        this.quantities.set(q);
        this.loadingTiers.set(false);
      },
      error: () => {
        this.tiersError.set('No se pudieron cargar las categorías de tickets.');
        this.loadingTiers.set(false);
      },
    });
  }

  increment(tierId: string): void {
    const tier = this.tiers().find(t => t.id === tierId);
    if (!tier) return;
    const current = this.quantities()[tierId] ?? 0;
    if (current < tier.maxPerOrder) {
      this.quantities.update(q => ({ ...q, [tierId]: current + 1 }));
    }
  }

  decrement(tierId: string): void {
    const current = this.quantities()[tierId] ?? 0;
    if (current > 0) {
      this.quantities.update(q => ({ ...q, [tierId]: current - 1 }));
    }
  }

  submit(): void {
    if (this.form.invalid || !this.hasItems() || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, phone } = this.form.value;
    const items = this.tiers()
      .filter(t => (this.quantities()[t.id] ?? 0) > 0)
      .map(t => ({ tierId: t.id, quantity: this.quantities()[t.id] }));

    this.submitting.set(true);
    this.submitError.set(null);

    this.http.post<{ wompiCheckoutUrl: string }>(
      `${environment.apiUrl}/payments/checkout`,
      { eventId: this.eventId(), items, buyer: { name, email, phone } }
    ).subscribe({
      next: ({ wompiCheckoutUrl }) => {
        window.location.href = wompiCheckoutUrl;
      },
      error: (err) => {
        this.submitError.set(err?.error?.message ?? 'Error al procesar. Intenta de nuevo.');
        this.submitting.set(false);
      },
    });
  }
}
