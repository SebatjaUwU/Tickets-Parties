import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { HeroSectionComponent } from '../../shared/components/hero-section/hero-section.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';
import { EventsActions } from '../../store/events/events.actions';
import { BlogActions } from '../../store/blog/blog.actions';
import { selectFeaturedEvents } from '../../store/events/events.selectors';
import { selectFeaturedPosts } from '../../store/blog/blog.selectors';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ft-home',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    FormsModule,
    HeroSectionComponent,
    EventCardComponent,
    NewsCardComponent,
  ],
  template: `
    <!-- Hero -->
    <ft-hero-section />

    <!-- Featured Events -->
    <section class="section bg-gradient-to-b from-black to-dark-blue-800">
      <div class="container-custom">
        <div class="section-title mb-12">
          <span class="subtitle">Próximos Festivales</span>
          <h2>Eventos <span class="gradient-text">Destacados</span></h2>
          <p>Los eventos más esperados del año te están esperando. No te quedes sin entradas.</p>
        </div>

        @if (featuredEvents$ | async; as events) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (event of events; track event.id) {
              <ft-event-card [event]="event" (favoriteToggle)="onFavoriteToggle($event)" />
            }
          </div>
        } @else {
          <!-- Skeleton loading -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3]; track i) {
              <div class="glass-card overflow-hidden">
                <div class="skeleton aspect-video"></div>
                <div class="p-5 space-y-3">
                  <div class="skeleton h-4 w-1/3 rounded"></div>
                  <div class="skeleton h-6 w-full rounded"></div>
                  <div class="skeleton h-4 w-2/3 rounded"></div>
                  <div class="skeleton h-10 w-1/2 rounded-xl"></div>
                </div>
              </div>
            }
          </div>
        }

        <div class="text-center mt-10">
          <a routerLink="/eventos" class="btn-secondary px-8 py-3">
            Ver Todos los Eventos →
          </a>
        </div>
      </div>
    </section>

    <!-- Why FAN TRIBUTE -->
    <section class="section bg-black relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-hero"></div>
      <div class="container-custom relative z-10">
        <div class="section-title mb-16">
          <span class="subtitle">Por qué elegirnos</span>
          <h2>La Plataforma <span class="gradient-text">EDM #1</span></h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (feature of features; track feature.title) {
            <div class="glass-card p-6 text-center reveal">
              <div class="text-4xl mb-4">{{ feature.icon }}</div>
              <h3 class="text-white font-bold text-lg mb-2 font-display">{{ feature.title }}</h3>
              <p class="text-gray-400 text-sm leading-relaxed">{{ feature.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Latest News -->
    <section class="section bg-dark-blue-800">
      <div class="container-custom">
        <div class="section-title mb-12">
          <span class="subtitle">Últimas Noticias</span>
          <h2>Blog & <span class="gradient-text">Noticias</span></h2>
          <p>Mantente al día con todo lo que pasa en el mundo EDM.</p>
        </div>

        @if (posts$ | async; as posts) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (post of posts; track post.id) {
              <ft-news-card [post]="post" />
            }
          </div>
        }

        <div class="text-center mt-10">
          <a routerLink="/blog" class="btn-secondary px-8 py-3">
            Ver Todas las Noticias →
          </a>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="section bg-gradient-to-r from-dark-blue-800 via-electric-blue-900 to-dark-blue-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-1/4 w-64 h-64 bg-electric-blue-500 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-edm-orange-500 rounded-full blur-3xl"></div>
      </div>
      <div class="container-custom relative z-10">
        <div class="max-w-2xl mx-auto text-center">
          <span class="subtitle">Newsletter</span>
          <h2 class="text-3xl md:text-4xl font-black text-white font-display mb-4">
            ¡No te pierdas <span class="gradient-text">ningún evento!</span>
          </h2>
          <p class="text-gray-300 mb-8">
            Suscríbete y recibe noticias, pre-ventas exclusivas y acceso anticipado a los mejores festivales EDM.
          </p>

          <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" (ngSubmit)="onNewsletterSubmit()">
            <input
              type="email"
              [(ngModel)]="newsletterEmail"
              name="email"
              placeholder="tu@email.com"
              class="input-field flex-1"
              required
            />
            <button type="submit" class="btn-orange px-6 py-3 whitespace-nowrap">
              Suscribirme 🎵
            </button>
          </form>

          @if (newsletterSuccess()) {
            <p class="text-green-400 text-sm mt-3 animate-fade-up">
              ✅ ¡Te has suscrito exitosamente! Revisa tu correo.
            </p>
          }

          <p class="text-gray-500 text-xs mt-4">
            Sin spam. Puedes darte de baja cuando quieras.
          </p>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  featuredEvents$ = this.store.select(selectFeaturedEvents);
  posts$ = this.store.select(selectFeaturedPosts);

  newsletterEmail = '';
  newsletterSuccess = signal(false);
  private newsletterTimerId: ReturnType<typeof setTimeout> | null = null;

  readonly features = [
    { icon: '🎫', title: 'Entradas Seguras', desc: 'Compra con confianza. Pagos seguros con SSL y múltiples métodos de pago.' },
    { icon: '⚡', title: 'Acceso Instantáneo', desc: 'Recibe tus tickets digitales inmediatamente después de comprar.' },
    { icon: '🌍', title: 'Eventos Globales', desc: 'Los mejores festivales de Colombia, LATAM y el mundo en un solo lugar.' },
    { icon: '🎵', title: 'Comunidad EDM', desc: 'Conecta con miles de fans, sigue tus artistas favoritos y comparte experiencias.' },
  ];

  ngOnInit(): void {
    this.store.dispatch(EventsActions.loadFeaturedEvents());
    this.store.dispatch(BlogActions.loadFeaturedPosts());
  }

  ngOnDestroy(): void {
    if (this.newsletterTimerId !== null) {
      clearTimeout(this.newsletterTimerId);
    }
  }

  onFavoriteToggle(eventId: string): void {
    this.store.dispatch(EventsActions.toggleFavorite({ eventId }));
  }

  onNewsletterSubmit(): void {
    if (!this.newsletterEmail) return;
    if (this.newsletterTimerId !== null) clearTimeout(this.newsletterTimerId);
    this.newsletterSuccess.set(true);
    this.newsletterEmail = '';
    this.newsletterTimerId = setTimeout(() => {
      this.newsletterSuccess.set(false);
      this.newsletterTimerId = null;
    }, 5000);
  }
}
