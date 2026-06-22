import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="w-full max-w-md mx-auto">
      <div class="glass-card rounded-2xl p-8">
        <h1 class="text-3xl font-rajdhani font-bold text-white mb-1">Recuperar contraseña</h1>
        <p class="text-gray-400 text-sm mb-8">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>

        @if (sent()) {
          <div class="text-center py-6">
            <div class="text-5xl mb-4">📧</div>
            <h2 class="text-xl font-bold text-white mb-2">¡Email enviado!</h2>
            <p class="text-gray-400 text-sm mb-6">Revisa tu bandeja de entrada y sigue las instrucciones.</p>
            <a routerLink="/auth/login" class="text-electric-blue hover:text-white transition-colors text-sm">Volver al login</a>
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                formControlName="email"
                type="email"
                placeholder="tu@email.com"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
              />
            </div>

            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (loading()) { Enviando... } @else { Enviar instrucciones }
            </button>
          </form>

          <p class="text-center text-sm text-gray-400 mt-6">
            <a routerLink="/auth/login" class="text-electric-blue hover:text-white transition-colors">← Volver al login</a>
          </p>
        }
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  loading = signal(false);
  sent = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.authService.forgotPassword(this.form.value.email!).subscribe({
      next: () => {
        this.sent.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('No pudimos enviar el email. Verifica que esté registrado.');
        this.loading.set(false);
      },
    });
  }
}
