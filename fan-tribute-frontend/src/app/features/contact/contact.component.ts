import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { APP_CONFIG } from '../../core/config/app.config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4 max-w-2xl">

        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-6xl font-rajdhani font-bold text-white mb-4">
            CONTÁCT<span class="text-electric-blue">ANOS</span>
          </h1>
          <p class="text-gray-400 text-lg">
            ¿Tienes una propuesta, pregunta o quieres organizar un evento? Escríbenos.
          </p>
        </div>

        <!-- Contact form -->
        <div class="glass-card rounded-2xl p-8">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                <input
                  formControlName="name"
                  type="text"
                  placeholder="Tu nombre"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  formControlName="email"
                  type="email"
                  placeholder="tu@email.com"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Asunto</label>
              <select
                formControlName="subject"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors"
              >
                <option value="">Selecciona un asunto</option>
                <option value="event">Propuesta de evento</option>
                <option value="artist">Booking de artista</option>
                <option value="support">Soporte técnico</option>
                <option value="press">Prensa</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Mensaje</label>
              <textarea
                formControlName="message"
                rows="6"
                placeholder="Cuéntanos en qué podemos ayudarte..."
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors resize-none"
              ></textarea>
            </div>

            @if (sent()) {
              <div class="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                <p class="text-green-400 font-semibold text-lg">✅ ¡Mensaje enviado!</p>
                <p class="text-gray-400 text-sm mt-1">Te responderemos a {{ form.get('email')?.value || 'tu correo' }} pronto.</p>
                <button type="button" (click)="sent.set(false)" class="text-electric-blue-400 text-sm mt-3 hover:text-white transition-colors">
                  Enviar otro mensaje
                </button>
              </div>
            } @else if (error()) {
              <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center mb-4">
                <p class="text-red-400 text-sm">{{ error() }}</p>
              </div>
              <button
                type="submit"
                [disabled]="form.invalid || sending()"
                class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reintentar
              </button>
            } @else {
              <button
                type="submit"
                [disabled]="form.invalid || sending()"
                class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (sending()) {
                  <span class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Enviando...
                  </span>
                } @else {
                  Enviar mensaje
                }
              </button>
            }
          </form>
        </div>

        <!-- Contact info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          @for (info of contactInfo; track info.label) {
            <div class="glass rounded-xl p-5 text-center">
              <div class="text-3xl mb-2">{{ info.icon }}</div>
              <div class="text-sm text-gray-400 mb-1">{{ info.label }}</div>
              <div class="text-white font-medium">{{ info.value }}</div>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);

  sending = signal(false);
  sent    = signal(false);
  error   = signal<string | null>(null);

  form = this.fb.group({
    name:    ['', Validators.required],
    email:   ['', Validators.required],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  contactInfo = [
    { icon: '📧', label: 'Email', value: APP_CONFIG.email },
    { icon: '📍', label: 'Ciudad', value: APP_CONFIG.city },
  ];

  onSubmit(): void {
    if (this.form.invalid || this.sending()) return;
    this.sending.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();

    emailjs.send(
      environment.emailjs.serviceId,
      environment.emailjs.templateId,
      {
        from_name:    v.name,
        from_email:   v.email,
        reply_to:     v.email,
        subject:      v.subject,
        message:      v.message,
        to_email:     APP_CONFIG.email,
      },
      { publicKey: environment.emailjs.publicKey }
    ).then(() => {
      this.sent.set(true);
      this.form.reset();
    }).catch(() => {
      this.error.set('No se pudo enviar el mensaje. Escríbenos directamente a ' + APP_CONFIG.email);
    }).finally(() => {
      this.sending.set(false);
    });
  }
}
