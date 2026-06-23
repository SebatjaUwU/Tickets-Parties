import { Component, input, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

interface HeroStat {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

@Component({
  selector: 'ft-hero-section',
  standalone: true,
  imports: [RouterLink, NgClass],
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
            <a routerLink="/artistas" class="btn-secondary text-base px-8 py-4 text-lg font-bold w-full sm:w-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
              Top 20 Artistas
            </a>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up" style="animation-delay: 0.4s;">
            @for (stat of stats; track stat.label) {
              <div class="glass-card p-5 text-center">
                <div class="text-3xl mb-2">{{ stat.icon }}</div>
                <div class="text-2xl md:text-3xl font-black text-white font-display mb-1 gradient-text-blue">
                  {{ animatedValues[stats.indexOf(stat)] }}{{ stat.suffix }}
                </div>
                <div class="text-xs text-gray-400 font-medium uppercase tracking-wide">{{ stat.label }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <span class="text-gray-400 text-xs uppercase tracking-widest">Scroll</span>
          <div class="w-px h-12 bg-gradient-to-b from-electric-blue-500 to-transparent"></div>
        </div>
      </div>
    </section>
  `,
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  readonly stats: HeroStat[] = [
    { label: 'Eventos publicados', value: 150, suffix: '+', icon: '🎪' },
    { label: 'Entradas vendidas', value: 50000, suffix: '+', icon: '🎫' },
    { label: 'Usuarios registrados', value: 25000, suffix: '+', icon: '👥' },
    { label: 'Visitas mensuales', value: 500000, suffix: '+', icon: '👁️' },
  ];

  animatedValues: string[] = ['0', '0', '0', '0'];
  private animationFrames: number[] = [];
  private timeoutIds: ReturnType<typeof setTimeout>[] = [];
  private destroyed = false;

  ngOnInit(): void {
    this.stats.forEach((stat, index) => {
      const id = setTimeout(() => {
        if (!this.destroyed) {
          this.animateCounter(stat.value, index);
        }
      }, index * 200);
      this.timeoutIds.push(id);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.animationFrames.forEach(id => cancelAnimationFrame(id));
    this.timeoutIds = [];
    this.animationFrames = [];
  }

  private animateCounter(target: number, index: number): void {
    const duration = 2000;
    const start = Date.now();

    const update = () => {
      if (this.destroyed) return;

      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      this.animatedValues[index] = current >= 1000
        ? (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'k'
        : current.toString();

      if (progress < 1) {
        this.animationFrames[index] = requestAnimationFrame(update);
      } else {
        this.animatedValues[index] = target >= 1000
          ? (target / 1000).toFixed(target >= 10000 ? 0 : 1) + 'k'
          : target.toString();
      }
    };

    this.animationFrames[index] = requestAnimationFrame(update);
  }
}
