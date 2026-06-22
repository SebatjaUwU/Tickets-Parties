import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-dark-900 flex items-center justify-center text-center px-4">
      <div>
        <h1 class="text-[10rem] font-rajdhani font-black text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-edm-orange leading-none mb-4">
          404
        </h1>
        <h2 class="text-3xl font-bold text-white mb-4">Página no encontrada</h2>
        <p class="text-gray-400 mb-8 max-w-md mx-auto">
          La página que buscas no existe o fue movida. Regresa al inicio y sigue disfrutando la música.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a routerLink="/" class="btn-primary">Ir al inicio</a>
          <a routerLink="/eventos" class="btn-ghost">Ver eventos</a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
