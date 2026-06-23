import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { APP_CONFIG } from '../../core/config/app.config';

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
                <p class="text-green-400 font-semibold">¡Listo! Se abrirá tu cliente de correo con el mensaje pre-rellenado.</p>
                <button type="button" (click)="sent.set(false)" class="text-gray-400 text-sm mt-2 hover:text-white transition-colors">
                  Enviar otro mensaje
                </button>
              </div>
            } @else {
              <button
                type="submit"
                [disabled]="form.invalid"
                class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar mensaje
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

  sent = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  contactInfo = [
    { icon: '📧', label: 'Email', value: APP_CONFIG.email },
    { icon: '📍', label: 'Ciudad', value: APP_CONFIG.city },
  ];

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const subject = encodeURIComponent(`[FAN TRIBUTE] ${v.subject} — de ${v.name}`);
    const body = encodeURIComponent(
      `Nombre: ${v.name}\nEmail: ${v.email}\nAsunto: ${v.subject}\n\n${v.message}`
    );
    window.location.href = `mailto:${APP_CONFIG.email}?subject=${subject}&body=${body}`;
    this.sent.set(true);
    this.form.reset();
  }
}
