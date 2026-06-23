import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4 max-w-4xl">

        <h1 class="text-3xl font-rajdhani font-bold text-white mb-8">Mi Perfil</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Avatar & basic info -->
          <div class="glass-card rounded-2xl p-8 text-center">
            <div class="w-24 h-24 rounded-full bg-electric-blue/20 border-2 border-electric-blue flex items-center justify-center mx-auto mb-4">
              @if (user()?.avatarUrl) {
                <img [src]="user()!.avatarUrl" [alt]="user()!.fullName" class="w-full h-full rounded-full object-cover" />
              } @else {
                <span class="text-4xl text-electric-blue font-bold">{{ user()?.fullName?.charAt(0) }}</span>
              }
            </div>
            <h2 class="text-xl font-bold text-white mb-1">{{ user()?.fullName }}</h2>
            <p class="text-gray-400 text-sm mb-4">{{ user()?.email }}</p>
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-electric-blue/10 text-electric-blue border border-electric-blue/30">
              {{ user()?.role }}
            </span>
            <div class="mt-6 pt-6 border-t border-white/10 text-sm text-gray-400">
              Miembro desde {{ user()?.createdAt | date:'MMMM yyyy' }}
            </div>
          </div>

          <!-- Edit form -->
          <div class="lg:col-span-2 glass-card rounded-2xl p-8">
            <h3 class="text-xl font-bold text-white mb-6">Editar información</h3>
            <form [formGroup]="form" (ngSubmit)="onSave()" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Nombre completo</label>
                <input
                  formControlName="fullName"
                  type="text"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                <input
                  formControlName="phone"
                  type="tel"
                  placeholder="+57 300 000 0000"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Ciudad</label>
                <input
                  formControlName="city"
                  type="text"
                  placeholder="Tu ciudad"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>
              <button type="submit" [disabled]="form.invalid || form.pristine || saving" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                @if (saving) { Guardando... } @else { Guardar cambios }
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);

  user = this.authService.currentUser;
  saving = false;

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
    city:  [''],
  });

  constructor() {
    // Sync form when user signal resolves (handles async load on F5)
    effect(() => {
      const u = this.user();
      if (u && this.form.pristine) {
        this.form.patchValue({
          fullName: u.fullName ?? `${u.firstName} ${u.lastName}`.trim(),
          phone:    u.phone ?? '',
          city:     u.city  ?? '',
        }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.http.put(`${environment.apiUrl}/users/me`, this.form.value).subscribe({
      next: () => {
        this.saving = false;
        this.notify.success('Perfil actualizado correctamente.');
        this.form.markAsPristine();
      },
      error: () => {
        this.saving = false;
        this.notify.error('No se pudo actualizar el perfil. Inténtalo de nuevo.');
      },
    });
  }
}
