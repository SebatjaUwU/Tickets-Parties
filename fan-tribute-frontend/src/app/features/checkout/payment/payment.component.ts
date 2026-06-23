import { Component, OnInit, signal } from '@angular/core';
import { APP_CONFIG } from '../../../core/config/app.config';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16 flex items-center justify-center">
      <div class="container mx-auto px-4 max-w-xl text-center">
        <div class="glass-card rounded-2xl p-12">
          <p class="text-5xl mb-6">🎟️</p>
          <h1 class="text-2xl font-rajdhani font-bold text-white mb-3">Registro de entradas</h1>
          <p class="text-gray-400 mb-8">
            Serás redirigido al formulario de registro. Completa tus datos y nos pondremos en contacto contigo para confirmar tu entrada.
          </p>
          @if (redirecting()) {
            <div class="flex items-center justify-center gap-3 text-electric-blue">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>Redirigiendo al formulario...</span>
            </div>
          } @else {
            <a [href]="formUrl" target="_blank" rel="noopener" class="btn-primary inline-block">
              Ir al formulario de registro →
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class PaymentComponent implements OnInit {
  readonly formUrl = APP_CONFIG.registrationFormUrl;
  redirecting = signal(false);

  ngOnInit(): void {
    // Auto-redirect after short delay so the user sees the message
    this.redirecting.set(true);
    setTimeout(() => {
      window.open(this.formUrl, '_blank', 'noopener');
      this.redirecting.set(false);
    }, 1500);
  }
}
