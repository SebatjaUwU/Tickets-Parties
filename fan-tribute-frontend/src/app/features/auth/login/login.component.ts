import { Component, inject, signal } from '@angular/core';
import { APP_CONFIG } from '../../../core/config/app.config';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'ft-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass, AsyncPipe],
  template: `
    <div class="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-12 relative overflow-hidden">

      <!-- Background effects -->
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-electric-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-edm-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="relative w-full max-w-md">

        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex flex-col items-center gap-2">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-blue-500 to-edm-orange-500 flex items-center justify-center shadow-glow-blue">
              <span class="text-white font-black text-2xl font-display">FT</span>
            </div>
            <span class="text-white font-black text-xl font-display">FAN TRIBUTE</span>
          </a>
          <h1 class="text-2xl font-black text-white mt-4">Bienvenido de vuelta</h1>
          <p class="text-gray-400 text-sm mt-1">Inicia sesión para acceder a tu cuenta</p>
        </div>

        <!-- Form Card -->
        <div class="glass-dark rounded-3xl p-8 shadow-hero">

          <!-- Google Login -->
          <button
            type="button"
            class="w-full flex items-center justify-center gap-3 btn-ghost py-3 mb-6 text-sm"
            (click)="loginWithGoogle()"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <!-- Divider -->
          <div class="flex items-center gap-3 mb-6">
            <div class="flex-1 h-px bg-white/10"></div>
            <span class="text-gray-500 text-xs">o con tu correo</span>
            <div class="flex-1 h-px bg-white/10"></div>
          </div>

          <!-- Email/Password Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">

            <div>
              <label class="input-label">Correo electrónico</label>
              <input
                formControlName="email"
                type="email"
                class="input-field"
                [ngClass]="{'error': loginForm.get('email')?.invalid && loginForm.get('email')?.touched}"
                placeholder="tu@email.com"
                autocomplete="email"
              />
              @if (loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched) {
                <p class="text-red-400 text-xs mt-1">El correo es requerido</p>
              }
              @if (loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched) {
                <p class="text-red-400 text-xs mt-1">Ingresa un correo válido</p>
              }
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="input-label mb-0">Contraseña</label>
                <a routerLink="/auth/recuperar-contrasena" class="text-electric-blue-400 text-xs hover:text-electric-blue-300 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div class="relative">
                <input
                  formControlName="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  class="input-field pr-12"
                  [ngClass]="{'error': loginForm.get('password')?.invalid && loginForm.get('password')?.touched}"
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  (click)="togglePassword()"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (showPassword()) {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    } @else {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    }
                  </svg>
                </button>
              </div>
              @if (loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched) {
                <p class="text-red-400 text-xs mt-1">La contraseña es requerida</p>
              }
            </div>

            <!-- Error global -->
            @if (error$ | async; as error) {
              <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p class="text-red-400 text-sm">{{ error }}</p>
              </div>
            }

            <!-- Submit -->
            <button
              type="submit"
              class="btn-primary w-full py-3.5 text-base font-bold mt-2"
              [disabled]="loginForm.invalid || (loading$ | async)"
            >
              @if (loading$ | async) {
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Iniciando sesión...
              } @else {
                Iniciar Sesión
              }
            </button>
          </form>

          <p class="text-center text-gray-400 text-sm mt-6">
            ¿No tienes cuenta?
            <a routerLink="/auth/registro" class="text-electric-blue-400 font-semibold hover:text-electric-blue-300 transition-colors ml-1">
              Regístrate gratis
            </a>
          </p>
        </div>

        <!-- Contact support -->
        <div class="mt-6 text-center">
          <p class="text-gray-500 text-xs">
            ¿Problemas para acceder? Escríbenos a
            <a [href]="'mailto:' + email" class="text-electric-blue-400 hover:text-electric-blue-300 transition-colors">
              {{ email }}
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  readonly email = APP_CONFIG.email;

  showPassword = signal(false);
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.store.dispatch(AuthActions.login({ dto: this.loginForm.getRawValue() }));
  }

  loginWithGoogle(): void {
    import('firebase/auth').then(async ({ getAuth, signInWithPopup, GoogleAuthProvider }) => {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      this.store.dispatch(AuthActions.googleLogin({ idToken }));
    });
  }
}
