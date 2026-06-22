import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'ft-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass],
  template: `
    <div class="min-h-screen bg-edm-black flex">

      <!-- Sidebar -->
      <aside
        class="fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300"
        [ngClass]="sidebarOpen() ? 'w-64' : 'w-16'"
        style="background: rgba(10,31,68,0.95); border-right: 1px solid rgba(0,153,255,0.1); backdrop-filter: blur(20px);"
      >
        <!-- Logo -->
        <div class="p-4 border-b border-white/5 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue-500 to-edm-orange-500 flex items-center justify-center flex-shrink-0">
            <span class="text-white font-black text-xs">FT</span>
          </div>
          @if (sidebarOpen()) {
            <span class="text-white font-black font-display text-sm animate-fade-in">FAN TRIBUTE</span>
          }
        </div>

        <!-- Toggle button -->
        <button
          (click)="toggleSidebar()"
          class="absolute -right-3 top-20 w-6 h-6 rounded-full bg-electric-blue-500 flex items-center justify-center shadow-glow-blue hover:bg-electric-blue-400 transition-colors"
        >
          <svg class="w-3 h-3 text-white transition-transform duration-300" [class.rotate-180]="!sidebarOpen()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Nav items -->
        <nav class="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          @for (item of navItems; track item.path) {
            @if (!item.adminOnly || authService.isAdmin()) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-electric-blue-500/20 text-electric-blue-400 border-l-2 border-electric-blue-500"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group relative"
                [title]="!sidebarOpen() ? item.label : ''"
              >
                <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
                @if (sidebarOpen()) {
                  <span class="text-sm font-medium animate-fade-in">{{ item.label }}</span>
                }
                @if (!sidebarOpen()) {
                  <div class="absolute left-full ml-2 px-2 py-1 bg-dark-blue-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {{ item.label }}
                  </div>
                }
              </a>
            }
          }
        </nav>

        <!-- Bottom: Back to site + User -->
        <div class="p-3 border-t border-white/5 space-y-2">
          <a routerLink="/" class="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <span class="text-lg flex-shrink-0">🌐</span>
            @if (sidebarOpen()) {
              <span class="text-sm animate-fade-in">Ir al sitio</span>
            }
          </a>
          <div class="flex items-center gap-3 px-3 py-2">
            <img
              [src]="authService.currentUser()?.avatarUrl ?? 'assets/images/avatar-default.png'"
              class="w-8 h-8 rounded-lg object-cover flex-shrink-0"
            />
            @if (sidebarOpen()) {
              <div class="animate-fade-in min-w-0">
                <p class="text-white text-xs font-semibold truncate">{{ authService.currentUser()?.firstName }}</p>
                <p class="text-gray-500 text-xs capitalize">{{ authService.currentUser()?.role }}</p>
              </div>
            }
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main
        class="flex-1 min-h-screen transition-all duration-300"
        [style.margin-left]="sidebarOpen() ? '16rem' : '4rem'"
      >
        <!-- Top bar -->
        <div class="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/5"
          style="background: rgba(17,17,17,0.9); backdrop-filter: blur(10px);">
          <h1 class="text-white font-bold">Dashboard</h1>
          <div class="flex items-center gap-3">
            <button class="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-edm-orange-500 rounded-full"></span>
            </button>
          </div>
        </div>

        <!-- Page content -->
        <router-outlet />
      </main>
    </div>
  `,
})
export class DashboardLayoutComponent {
  readonly authService = inject(AuthService);
  sidebarOpen = signal(true);

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  readonly navItems: NavItem[] = [
    { path: '/dashboard/resumen', label: 'Resumen', icon: '📊' },
    { path: '/dashboard/eventos', label: 'Eventos', icon: '🎪' },
    { path: '/dashboard/entradas', label: 'Entradas', icon: '🎫' },
    { path: '/dashboard/usuarios', label: 'Usuarios', icon: '👥', adminOnly: true },
    { path: '/dashboard/reportes', label: 'Reportes', icon: '📈' },
  ];
}
