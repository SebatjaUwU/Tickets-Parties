import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-dark-blue-900 flex items-center justify-center relative overflow-hidden">
      <!-- Background glow effects -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-edm-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Logo -->
      <div class="absolute top-8 left-8">
        <a href="/" class="text-2xl font-display font-bold text-white">
          FAN <span class="text-electric-blue-500">TRIBUTE</span>
        </a>
      </div>

      <router-outlet />
    </div>
  `,
})
export class AuthLayoutComponent {}
