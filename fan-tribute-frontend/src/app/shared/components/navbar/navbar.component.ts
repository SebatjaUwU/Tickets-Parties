import { Component, signal, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

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
          <a routerLink="/" class="flex items-center group">
            <span class="text-white font-black text-xl font-display tracking-wide group-hover:opacity-80 transition-opacity duration-300">FAN TRIBUTE</span>
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
  scrolled       = signal(false);
  mobileMenuOpen = signal(false);

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

  toggleMobile(event: MouseEvent): void {
    event.stopPropagation();
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }
}
