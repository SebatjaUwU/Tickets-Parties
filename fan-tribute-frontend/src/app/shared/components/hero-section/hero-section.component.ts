import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ft-hero-section',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative min-h-screen flex items-center overflow-hidden particle-bg">

      <!-- Video Background -->
      <div class="absolute inset-0 z-0">
        <video
          autoplay
          muted
          loop
          playsinline
          class="w-full h-full object-cover opacity-30"
          poster="assets/images/hero-poster.jpg"
        >
          <source src="assets/videos/hero-edm.mp4" type="video/mp4">
        </video>
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-dark-blue-800/80 to-black"></div>
        <!-- Radial glow effects -->
        <div class="absolute top-1/3 left-1/4 w-96 h-96 bg-electric-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-edm-orange-500/15 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 container-custom w-full py-20">
        <div class="max-w-4xl mx-auto text-center">

          <!-- Logo -->
          <div class="flex justify-center mb-8 animate-fade-down">
            <img src="logo.png?v=2" alt="FAN TRIBUTE" class="h-64 md:h-80 w-auto object-contain drop-shadow-2xl" />
          </div>

          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-electric-blue-500/30 mb-8 animate-fade-down">
            <span class="w-2 h-2 bg-electric-blue-500 rounded-full animate-pulse"></span>
            <span class="text-electric-blue-400 text-sm font-semibold tracking-widest uppercase">La Comunidad EDM #1</span>
          </div>

          <!-- Main title -->


          <!-- Subtitle -->
          <p class="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed" style="animation-delay: 0.2s;">
            Descubre artistas, compra entradas para los mejores festivales EDM y únete a la comunidad más vibrante del mundo.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style="animation-delay: 0.3s;">
            <a routerLink="/eventos" class="btn-primary text-base px-8 py-4 text-lg font-bold w-full sm:w-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Ver Eventos
            </a>
          </div>

        </div>

      </div>
    </section>
  `,
})
export class HeroSectionComponent {}
