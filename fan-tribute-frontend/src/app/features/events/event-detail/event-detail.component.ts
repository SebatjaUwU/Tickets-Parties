import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, NgClass, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { switchMap } from 'rxjs';
import { EventsService } from '../../../core/services/events.service';
import { Event } from '../../../shared/models';
import { APP_CONFIG, SPOTIFY_EMBED_URL } from '../../../core/config/app.config';

@Component({
  selector: 'ft-event-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, NgClass, DecimalPipe],
  template: `
    @if (event(); as ev) {
      <!-- Hero Banner -->
      <div class="relative h-[60vh] min-h-96 overflow-hidden">
        <img [src]="ev.bannerUrl ?? 'assets/images/event-placeholder.jpg'" [alt]="ev.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        <!-- Breadcrumb -->
        <div class="absolute top-6 left-0 right-0">
          <div class="container-custom">
            <nav class="flex items-center gap-2 text-sm text-gray-400">
              <a routerLink="/" class="hover:text-white transition-colors">Inicio</a>
              <span>/</span>
              <a routerLink="/eventos" class="hover:text-white transition-colors">Eventos</a>
              <span>/</span>
              <span class="text-white">{{ ev.title }}</span>
            </nav>
          </div>
        </div>

        <!-- Event title overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <div class="container-custom">
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <span class="badge badge-blue">{{ ev.status }}</span>
              @if (ev.isFeatured) { <span class="badge badge-orange">⭐ Destacado</span> }
              @if (ev.isInternational) { <span class="badge badge-blue">🌍 Internacional</span> }
              @for (genre of ev.genres.slice(0,3); track genre) {
                <span class="tag text-xs">{{ genre }}</span>
              }
            </div>
            <h1 class="text-4xl md:text-6xl font-black text-white font-display leading-tight mb-2">{{ ev.title }}</h1>
            <div class="flex flex-wrap items-center gap-6 text-gray-300">
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5 text-electric-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {{ ev.startDate | date:'EEEE, d MMMM yyyy' }}
              </span>
              @if (ev.venue) {
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-edm-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                  {{ ev.venue.name }}, {{ ev.venue.city }}
                </span>
              }
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                {{ ev.totalCapacity | number }} personas
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="container-custom py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <!-- Left: Main Info -->
          <div class="lg:col-span-2 space-y-8">

            <!-- Description -->
            <div class="glass-dark rounded-2xl p-6">
              <h2 class="text-xl font-bold text-white font-display mb-4">Acerca del Evento</h2>
              <div class="text-gray-300 leading-relaxed prose prose-invert max-w-none">
                <p>{{ ev.description }}</p>
              </div>
              @if (ev.minAge) {
                <div class="flex items-center gap-2 mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <svg class="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-2.694-.834-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                  <span class="text-yellow-400 text-sm font-medium">Edad mínima: {{ ev.minAge }}+ años</span>
                </div>
              }
            </div>

            <!-- Artists Lineup -->
            @if (ev.artists?.length) {
              <div class="glass-dark rounded-2xl p-6">
                <h2 class="text-xl font-bold text-white font-display mb-6">Lineup de Artistas</h2>
                <div class="space-y-4">
                  @for (ea of ev.artists; track ea.artist.id) {
                    <div class="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                      <img [src]="ea.artist.avatarUrl" [alt]="ea.artist.name" class="w-14 h-14 rounded-xl object-cover" />
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <h3 class="text-white font-bold">{{ ea.artist.name }}</h3>
                          @if (ea.isHeadliner) {
                            <span class="badge badge-orange text-xs">Headliner</span>
                          }
                        </div>
                        <p class="text-gray-400 text-sm">{{ ea.artist.genres?.[0] }} · {{ ea.artist.country }}</p>
                        @if (ea.setTime) {
                          <p class="text-electric-blue-400 text-xs mt-0.5">{{ ea.setTime | date:'HH:mm' }} {{ ea.stage ? '· ' + ea.stage : '' }}</p>
                        }
                      </div>
                      <a [routerLink]="['/artistas', ea.artist.slug]" class="btn-ghost text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver artista
                      </a>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Spotify Playlist -->
            <div class="glass-dark rounded-2xl p-6">
              <h2 class="text-xl font-bold text-white font-display mb-4">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                  Playlist del Evento
                </span>
              </h2>
              <iframe
                [src]="spotifyUrl"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                class="rounded-xl"
              ></iframe>
            </div>

            <!-- Map -->
            @if (ev.venue?.latitude && ev.venue?.longitude) {
              <div class="glass-dark rounded-2xl p-6">
                <h2 class="text-xl font-bold text-white font-display mb-4">Ubicación</h2>
                <p class="text-gray-400 text-sm mb-4">
                  📍 {{ ev.venue?.address }}, {{ ev.venue?.city }}, {{ ev.venue?.country }}
                </p>
                <div class="rounded-xl overflow-hidden h-64 bg-gray-800 flex items-center justify-center">
                  <p class="text-gray-400 text-sm">Mapa integrado con Google Maps API</p>
                </div>
              </div>
            }

          </div>

          <!-- Right: Registration Sidebar (sticky) -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-4">

              <!-- Registration CTA -->
              <div class="glass-dark rounded-2xl p-6 border border-electric-blue-500/30">
                <h3 class="text-white font-bold text-lg font-display mb-2">¡Asegura tu lugar!</h3>
                <p class="text-gray-400 text-sm mb-6">
                  Completa el formulario de registro y nos pondremos en contacto contigo para confirmar tu entrada.
                </p>
                <a
                  [href]="formUrl"
                  target="_blank"
                  rel="noopener"
                  class="btn-primary w-full text-center py-4 text-lg font-black block"
                >
                  🎫 REGISTRARSE AHORA
                </a>
                <p class="text-center text-gray-500 text-xs mt-4">
                  El registro no garantiza la entrada hasta recibir confirmación.
                </p>
              </div>

              <!-- Share -->
              <div class="glass-dark rounded-2xl p-4">
                <p class="text-gray-400 text-sm mb-3 text-center">Compartir evento</p>
                <div class="flex justify-center gap-3">
                  <a [href]="shareWhatsApp(ev.title)" target="_blank" rel="noopener"
                    class="w-10 h-10 rounded-xl glass hover:bg-green-500/20 hover:text-green-400 text-gray-400 flex items-center justify-center transition-all" title="WhatsApp">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </a>
                  <a [href]="shareTwitter(ev.title)" target="_blank" rel="noopener"
                    class="w-10 h-10 rounded-xl glass hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 flex items-center justify-center transition-all" title="Twitter/X">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a [href]="shareFacebook()" target="_blank" rel="noopener"
                    class="w-10 h-10 rounded-xl glass hover:bg-blue-600/20 hover:text-blue-500 text-gray-400 flex items-center justify-center transition-all" title="Facebook">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <button (click)="copyLink()"
                    class="w-10 h-10 rounded-xl glass hover:bg-white/20 hover:text-white text-gray-400 flex items-center justify-center transition-all"
                    [title]="copied ? '¡Copiado!' : 'Copiar enlace'">
                    @if (copied) {
                      <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    } @else {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    }
                  </button>
                </div>
                @if (copied) {
                  <p class="text-center text-green-400 text-xs mt-2">¡Enlace copiado!</p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <!-- Loading state -->
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-electric-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-400">Cargando evento...</p>
        </div>
      </div>
    }
  `,
})
export class EventDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventsService = inject(EventsService);
  private readonly sanitizer = inject(DomSanitizer);

  event = signal<Event | null>(null);
  readonly formUrl = APP_CONFIG.registrationFormUrl;
  readonly spotifyUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    SPOTIFY_EMBED_URL(APP_CONFIG.spotifyPlaylistId)
  );
  copied = false;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => this.eventsService.getEventBySlug(params.get('slug')!)),
    ).subscribe(ev => this.event.set(ev));
  }

  shareWhatsApp(title: string): string {
    const text = encodeURIComponent(`¡Mira este evento: ${title}! ${window.location.href}`);
    return `https://wa.me/?text=${text}`;
  }

  shareTwitter(title: string): string {
    const text = encodeURIComponent(`¡${title}! Consigue tu entrada en FAN TRIBUTE`);
    const url = encodeURIComponent(window.location.href);
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }

  shareFacebook(): string {
    const url = encodeURIComponent(window.location.href);
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.copied = true;
      setTimeout(() => { this.copied = false; }, 2000);
    });
  }
}
