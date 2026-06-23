import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
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

          <!-- Nombre y apellido -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Nombre *</label>
              <input
                formControlName="firstName"
                type="text"
                placeholder="Tu nombre"
                class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
                [class.border-red-500]="isInvalid('firstName')"
                [class.border-white/10]="!isInvalid('firstName')"
                [class.focus:border-electric-blue]="!isInvalid('firstName')"
              />
              @if (isInvalid('firstName')) {
                <p class="text-red-400 text-xs mt-1">Mínimo 2 caracteres</p>
              }
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Apellido *</label>
              <input
                formControlName="lastName"
                type="text"
                placeholder="Tu apellido"
                class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
                [class.border-red-500]="isInvalid('lastName')"
                [class.border-white/10]="!isInvalid('lastName')"
              />
              @if (isInvalid('lastName')) {
                <p class="text-red-400 text-xs mt-1">Mínimo 2 caracteres</p>
              }
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
            <input
              formControlName="email"
              type="email"
              placeholder="tu@email.com"
              class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
              [class.border-red-500]="isInvalid('email')"
              [class.border-white/10]="!isInvalid('email')"
            />
            @if (isInvalid('email')) {
              <p class="text-red-400 text-xs mt-1">Email inválido</p>
            }
          </div>

          <!-- Cédula y Celular -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Cédula *</label>
              <input
                formControlName="cedula"
                type="text"
                inputmode="numeric"
                placeholder="Ej: 1098765432"
                class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
                [class.border-red-500]="isInvalid('cedula')"
                [class.border-white/10]="!isInvalid('cedula')"
              />
              @if (isInvalid('cedula')) {
                <p class="text-red-400 text-xs mt-1">Solo números, 6-12 dígitos</p>
              }
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Celular *</label>
              <input
                formControlName="phone"
                type="tel"
                placeholder="Ej: 3001234567"
                class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
                [class.border-red-500]="isInvalid('phone')"
                [class.border-white/10]="!isInvalid('phone')"
              />
              @if (isInvalid('phone')) {
                <p class="text-red-400 text-xs mt-1">Número inválido</p>
              }
            </div>
          </div>

          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Contraseña *</label>
            <input
              formControlName="password"
              [type]="showPassword() ? 'text' : 'password'"
              placeholder="Mínimo 8 caracteres"
              class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
              [class.border-red-500]="isInvalid('password')"
              [class.border-white/10]="!isInvalid('password')"
            />
            @if (isInvalid('password')) {
              <p class="text-red-400 text-xs mt-1">Mínimo 8 caracteres</p>
            }
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
    lastName:  ['', [Validators.required, Validators.minLength(2)]],
    email:     ['', [Validators.required, Validators.email]],
    cedula:    ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)]],
    phone:     ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
    password:  ['', [Validators.required, Validators.minLength(8)]],
  });

  isInvalid(field: string): boolean {
    const ctrl: AbstractControl | null = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { firstName, lastName, email, cedula, phone, password } = this.form.value;
    this.store.dispatch(AuthActions.register({
      dto: {
        firstName: firstName!,
        lastName:  lastName!,
        email:     email!,
        cedula:    cedula!,
        phone:     phone!,
        password:  password!,
      },
    }));
  }
}
