import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Artist } from '../../models';

@Component({
  selector: 'ft-artist-card',
  standalone: true,
  imports: [RouterLink, NgClass],
  template: `
    <article class="glass-card group relative overflow-hidden cursor-pointer" [routerLink]="['/artistas', artist().slug]">

      <!-- Cover / Avatar -->
      <div class="relative aspect-[3/4] overflow-hidden">
        <img
          [src]="artist().coverUrl ?? artist().avatarUrl ?? 'assets/images/artist-placeholder.jpg'"
          [alt]="artist().name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <!-- Gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-dark-blue-800 via-dark-blue-800/30 to-transparent"></div>

        <!-- Ranking badge -->
        @if (showRanking() && artist().ranking > 0) {
          <div class="absolute top-3 left-3 w-9 h-9 rounded-xl bg-gradient-to-br from-electric-blue-500 to-edm-orange-500 flex items-center justify-center font-black text-white text-sm shadow-glow-blue">
            #{{ artist().ranking }}
          </div>
        }

        <!-- Follow button -->
        <button
          class="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 opacity-0 group-hover:opacity-100"
          [ngClass]="artist().isFollowed
            ? 'bg-electric-blue-500 text-white'
            : 'glass border border-white/20 text-white hover:bg-electric-blue-500'"
          (click)="onFollowClick($event)"
        >
          {{ artist().isFollowed ? 'Siguiendo ✓' : '+ Seguir' }}
        </button>

        <!-- Bottom info -->
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <!-- Social links on hover -->
          <div class="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            @if (artist().socialLinks?.instagram) {
              <a [href]="'https://instagram.com/' + artist().socialLinks.instagram" target="_blank" (click)="$event.stopPropagation()"
                class="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white hover:bg-pink-500/20 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            }
            @if (artist().socialLinks?.spotify) {
              <a [href]="artist().socialLinks.spotify" target="_blank" (click)="$event.stopPropagation()"
                class="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white hover:bg-green-500/20 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              </a>
            }
            @if (artist().socialLinks?.youtube) {
              <a [href]="artist().socialLinks.youtube" target="_blank" (click)="$event.stopPropagation()"
                class="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/20 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
              </a>
            }
          </div>

          <h3 class="text-white font-black text-lg font-display leading-tight">{{ artist().name }}</h3>
          <p class="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
            <span>{{ artist().country }}</span>
            @if (artist().genres?.length) {
              <span class="text-gray-600">·</span>
              <span class="text-electric-blue-400">{{ artist().genres[0] }}</span>
            }
          </p>

          <!-- Followers -->
          <div class="flex items-center gap-1 mt-2">
            <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span class="text-gray-500 text-xs">{{ formatFollowers(artist().followersCount) }} seguidores</span>
          </div>
        </div>
      </div>
    </article>
  `,
})
export class ArtistCardComponent {
  artist = input.required<Artist>();
  showRanking = input(false);
  followToggle = output<string>();

  formatFollowers(count: number): string {
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + 'M';
    if (count >= 1_000) return (count / 1_000).toFixed(0) + 'K';
    return count.toString();
  }

  onFollowClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.followToggle.emit(this.artist().id);
  }
}
