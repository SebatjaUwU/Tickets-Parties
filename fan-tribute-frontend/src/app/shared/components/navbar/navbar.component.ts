import { Component, inject, signal, HostListener, OnInit, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'ft-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [ngClass]="scrolled() ? 'glass-dark shadow-glass' : 'bg-transparent'"
    >
      <div class="container-custom">
        <div class="flex items-center justify-between h-18">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="relative">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue-500 to-edm-orange-500 flex items-center justify-center shadow-glow-blue group-hover:shadow-glow-orange transition-all duration-300">
                <span class="text-white font-black text-sm font-display">FT</span>
              </div>
            </div>
            <div>
              <span class="text-white font-black text-xl font-display tracking-wide">FAN TRIBUTE</span>
              <div class="h-0.5 bg-gradient-to-r from-electric-blue-500 to-edm-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </a>

          <!-- Desktop Nav Links -->
          <div class="hidden lg:flex items-center gap-1">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="text-electric-blue-400"
                [routerLinkActiveOptions]="link.exact ? {exact: true} : {exact: false}"
                class="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 relative group"
              >
                {{ link.label }}
                <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-electric-blue-500 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
              </a>
            }
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-3">

            @if (authService.isAuthenticated()) {
              <!-- User Menu -->
              <div class="relative">
                <!-- Botón toggle — stopPropagation para evitar que document:click lo cierre al instante -->
                <button
                  (click)="toggleMenu($event)"
                  class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 outline-none"
                >
                  <!-- Avatar: imagen si existe, iniciales si no -->
                  @if (authService.currentUser()?.avatarUrl) {
                    <img
                      [src]="authService.currentUser()!.avatarUrl!"
                      [alt]="userInitials()"
                      class="w-8 h-8 rounded-lg object-cover ring-2 ring-electric-blue-500/50"
                    />
                  } @else {
                    <div
                      class="w-8 h-8 rounded-lg ring-2 ring-electric-blue-500/50 flex items-center justify-center font-bold text-sm text-white"
                      [style.background]="avatarGradient()"
                    >
                      {{ userInitials() }}
                    </div>
                  }
                  <svg
                    class="w-4 h-4 text-gray-400 transition-transform duration-200"
                    [ngClass]="{'rotate-180': userMenuOpen()}"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                <!-- Dropdown -->
                @if (userMenuOpen()) {
                  <div class="absolute right-0 top-full mt-2 w-56 glass-dark rounded-2xl shadow-glass border border-white/10 py-2 z-[9999]" (click)="$event.stopPropagation()">

                    <!-- Header del menú -->
                    <div class="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                      @if (authService.currentUser()?.avatarUrl) {
                        <img
                          [src]="authService.currentUser()!.avatarUrl!"
                          class="w-9 h-9 rounded-lg object-cover ring-2 ring-electric-blue-500/40"
                        />
                      } @else {
                        <div
                          class="w-9 h-9 rounded-lg ring-2 ring-electric-blue-500/40 flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                          [style.background]="avatarGradient()"
                        >
                          {{ userInitials() }}
                        </div>
                      }
                      <div class="min-w-0">
                        <p class="text-white font-semibold text-sm truncate">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</p>
                        <p class="text-gray-400 text-xs truncate mt-0.5">{{ authService.currentUser()?.email }}</p>
                      </div>
                    </div>

                    <!-- Opciones -->
                    <a routerLink="/perfil" (click)="closeMenu()" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      Mi Perfil
                    </a>
                    @if (authService.isOrganizer()) {
                      <a routerLink="/dashboard" (click)="closeMenu()" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                        Dashboard
                      </a>
                    }
                    <div class="border-t border-white/10 mt-1 pt-1">
                      <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                }
              </div>

            } @else {
              <a routerLink="/auth/login" class="hidden sm:block btn-ghost text-sm px-4 py-2">Iniciar Sesión</a>
              <a routerLink="/auth/registro" class="btn-primary text-sm px-5 py-2.5">Registrarse</a>
            }

            <!-- Mobile Menu Button -->
            <button
              class="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              (click)="toggleMobile($event)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (mobileMenuOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        @if (mobileMenuOpen()) {
          <div class="lg:hidden glass-dark rounded-2xl mb-4 p-4">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="text-electric-blue-400"
                (click)="mobileMenuOpen.set(false)"
                class="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all mb-1"
              >
                {{ link.label }}
              </a>
            }
          </div>
        }
      </div>
    </nav>

    <!-- Spacer -->
    <div class="h-18"></div>
  `,
  styles: [`
    :host { display: block; }
    .h-18 { height: 4.5rem; }
  `],
})
export class NavbarComponent implements OnInit {
  readonly authService = inject(AuthService);

  scrolled       = signal(false);
  userMenuOpen   = signal(false);
  mobileMenuOpen = signal(false);

  // Iniciales del usuario para el avatar por defecto
  userInitials = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return '?';
    const f = user.firstName?.[0]?.toUpperCase() ?? '';
    const l = user.lastName?.[0]?.toUpperCase()  ?? '';
    return (f + l) || (user.email?.[0]?.toUpperCase() ?? '?');
  });

  // Color de fondo basado en las iniciales (consistente por usuario)
  avatarGradient = computed(() => {
    const user = this.authService.currentUser();
    const seed = user?.id ?? user?.email ?? 'default';
    const hue  = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return `linear-gradient(135deg, hsl(${hue},70%,40%), hsl(${(hue + 60) % 360},70%,30%))`;
  });

  readonly navLinks = [
    { path: '/',         label: 'Inicio',   exact: true  },
    { path: '/eventos',  label: 'Eventos',  exact: false },
    { path: '/merch',    label: 'Merch',    exact: false },
    { path: '/nosotros', label: 'Nosotros', exact: false },
    { path: '/contacto', label: 'Contacto', exact: false },
  ];

  ngOnInit(): void {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  // Cierra el menú al hacer click en cualquier parte fuera del dropdown
  @HostListener('document:click')
  onDocumentClick(): void {
    this.userMenuOpen.set(false);
  }

  // ─── Importante: stopPropagation para que document:click no lo cierre al instante ───
  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen.set(!this.userMenuOpen());
  }

  toggleMobile(event: MouseEvent): void {
    event.stopPropagation();
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMenu(): void {
    this.userMenuOpen.set(false);
  }

  logout(): void {
    this.userMenuOpen.set(false);
    this.authService.logout();
  }
}
