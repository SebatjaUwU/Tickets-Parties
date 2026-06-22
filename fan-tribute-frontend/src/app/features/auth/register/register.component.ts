import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="w-full max-w-md mx-auto">
      <div class="glass-card rounded-2xl p-8">
        <h1 class="text-3xl font-rajdhani font-bold text-white mb-1">Crear cuenta</h1>
        <p class="text-gray-400 text-sm mb-8">Únete a la comunidad EDM más grande de Colombia</p>

        @if (error()) {
          <div class="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {{ error() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Nombre</label>
              <input
                formControlName="firstName"
                type="text"
                placeholder="Tu nombre"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Apellido</label>
              <input
                formControlName="lastName"
                type="text"
                placeholder="Tu apellido"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              formControlName="email"
              type="email"
              placeholder="tu@email.com"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
            <input
              formControlName="password"
              [type]="showPassword() ? 'text' : 'password'"
              placeholder="Mínimo 8 caracteres"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
            />
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="show" (change)="showPassword.set(!showPassword())" class="rounded" />
            <label for="show" class="text-sm text-gray-400 cursor-pointer">Mostrar contraseña</label>
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            @if (loading()) { Registrando... } @else { Crear cuenta }
          </button>
        </form>

        <p class="text-center text-sm text-gray-400 mt-6">
          ¿Ya tienes cuenta?
          <a routerLink="/auth/login" class="text-electric-blue hover:text-white transition-colors ml-1">Iniciar sesión</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  loading = this.store.selectSignal(selectAuthLoading);
  error = this.store.selectSignal(selectAuthError);
  showPassword = signal(false);

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    const { firstName, email, password, lastName } = this.form.value;
    this.store.dispatch(AuthActions.register({
      dto: {
        firstName: firstName!,
        lastName: lastName!,
        email: email!,
        password: password!,
      },
    }));
  }
}
