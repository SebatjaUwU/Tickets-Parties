import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4">

        <!-- Hero -->
        <div class="text-center mb-20">
          <h1 class="text-5xl md:text-7xl font-rajdhani font-bold text-white mb-6">
            SOBRE <span class="text-electric-blue">NOSOTROS</span>
          </h1>
          <p class="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            FAN TRIBUTE nació de la pasión por la música electrónica. Somos la plataforma EDM #1 de Colombia,
            conectando artistas, fans y festivales en un solo lugar.
          </p>
        </div>

        <!-- Mission, Vision, Values -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          @for (item of values; track item.title) {
            <div class="glass-card rounded-2xl p-8 text-center">
              <div class="text-5xl mb-4">{{ item.icon }}</div>
              <h3 class="text-2xl font-rajdhani font-bold text-white mb-3">{{ item.title }}</h3>
              <p class="text-gray-400 leading-relaxed">{{ item.description }}</p>
            </div>
          }
        </div>

        <!-- CTA -->
        <div class="text-center">
          <h2 class="text-3xl font-rajdhani font-bold text-white mb-4">¿Listo para vivir la experiencia?</h2>
          <div class="flex gap-4 justify-center flex-wrap">
            <a routerLink="/eventos" class="btn-primary">Ver Eventos</a>
            <a routerLink="/contacto" class="btn-ghost">Contáctanos</a>
          </div>
        </div>

      </div>
    </section>
  `,
})
export class AboutComponent {
  values = [
    {
      icon: '🎵',
      title: 'Misión',
      description: 'Democratizar el acceso a la música electrónica, brindando experiencias únicas a cada fan en Colombia y Latinoamérica.',
    },
    {
      icon: '🚀',
      title: 'Visión',
      description: 'Ser la plataforma de referencia para el ecosistema EDM en habla hispana, impulsando artistas locales al mundo.',
    },
    {
      icon: '💡',
      title: 'Valores',
      description: 'Pasión por la música, transparencia con artistas y fans, innovación tecnológica y comunidad ante todo.',
    },
  ];

}
