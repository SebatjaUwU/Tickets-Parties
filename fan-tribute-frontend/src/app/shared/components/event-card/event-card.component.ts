import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Event } from '../../models';

@Component({
  selector: 'ft-event-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, NgClass],
  template: `
    <article class="glass-card group overflow-hidden relative" [class.ring-2]="event().isFavorite" [class.ring-electric-blue-500]="event().isFavorite">

      <!-- Banner Image -->
      <div class="relative aspect-video overflow-hidden">
        <img
          [src]="event().bannerUrl ?? 'assets/images/event-placeholder.jpg'"
          [alt]="event().title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <!-- Gradient overlay on image -->
        <div class="absolute inset-0 bg-gradient-card opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

        <!-- Status badge -->
        <div class="absolute top-3 left-3">
          <span
            class="badge text-xs"
            [ngClass]="{
              'badge-blue': event().status === 'published',
              'badge-orange': event().status === 'sold_out',
              'badge-red': event().status === 'cancelled'
            }"
          >
            {{ statusLabel[event().status] }}
          </span>
        </div>

        <!-- Featured badge -->
        @if (event().isFeatured) {
          <div class="absolute top-3 right-3">
            <span class="badge badge-orange text-xs">⭐ Destacado</span>
          </div>
        }

        <!-- Favorite button -->
        <button
          class="absolute bottom-3 right-3 p-2 rounded-lg glass opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          (click)="onFavoriteClick($event)"
          [title]="event().isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
        >
          <svg class="w-4 h-4 transition-colors duration-200" [class.text-red-400]="event().isFavorite" [class.text-gray-400]="!event().isFavorite" fill="currentColor" viewBox="0 0 24 24">
            @if (event().isFavorite) {
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            } @else {
              <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
            }
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-5">

        <!-- Date & City -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-1.5 text-electric-blue-400 text-xs font-semibold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ event().startDate | date:'dd MMM yyyy' }}
          </div>
          @if (event().venue) {
            <div class="flex items-center gap-1.5 text-gray-400 text-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ event().venue?.city }}
            </div>
          }
        </div>

        <!-- Title -->
        <h3 class="text-white font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-electric-blue-300 transition-colors duration-200 font-display">
          {{ event().title }}
        </h3>

        <!-- Artists -->
        @if (event().artists?.length) {
          <div class="flex items-center gap-2 mb-4">
            <div class="flex -space-x-2">
              @for (ea of event().artists.slice(0, 3); track ea.artist.id) {
                <img
                  [src]="ea.artist.avatarUrl ?? 'assets/images/avatar-default.png'"
                  [alt]="ea.artist.name"
                  class="w-6 h-6 rounded-full border border-dark-blue-800 object-cover"
                />
              }
            </div>
            <span class="text-gray-400 text-xs">
              {{ event().artists[0]?.artist?.name }}
              @if (event().artists.length > 1) {
                + {{ event().artists.length - 1 }} más
              }
            </span>
          </div>
        }

        <!-- Genres -->
        @if (event().genres?.length) {
          <div class="flex flex-wrap gap-1.5 mb-4">
            @for (genre of event().genres.slice(0, 3); track genre) {
              <span class="tag text-xs">{{ genre }}</span>
            }
          </div>
        }

        <!-- Footer: Price + CTA -->
        <div class="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            @if (event().ticketTiers?.length) {
              <p class="text-gray-400 text-xs">Desde</p>
              <p class="text-white font-black text-xl font-display">
                {{ minPrice | currency:event().ticketTiers![0].currency:'symbol-narrow':'1.0-0' }}
              </p>
            } @else {
              <p class="text-gray-400 text-sm">Precio TBA</p>
            }
          </div>
          <a
            [routerLink]="['/eventos', event().slug]"
            class="btn-primary text-sm px-5 py-2.5"
            (click)="$event.stopPropagation()"
          >
            Comprar
          </a>
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class EventCardComponent {
  event = input.required<Event>();
  favoriteToggle = output<string>();

  readonly statusLabel: Record<string, string> = {
    published: 'Disponible',
    sold_out: 'Agotado',
    cancelled: 'Cancelado',
    draft: 'Próximamente',
    completed: 'Finalizado',
  };

  get minPrice(): number {
    const tiers = this.event().ticketTiers ?? [];
    return tiers.reduce((min, t) => t.price < min ? t.price : min, tiers[0]?.price ?? 0);
  }

  onFavoriteClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggle.emit(this.event().id);
  }
}
