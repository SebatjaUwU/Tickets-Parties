import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ArtistCardComponent } from '../../shared/components/artist-card/artist-card.component';
import { ArtistsActions } from '../../store/artists/artists.actions';
import { selectTop20Artists, selectArtistsLoading } from '../../store/artists/artists.selectors';
import { Artist } from '../../shared/models';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, ArtistCardComponent],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4">

        <!-- Header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-electric-blue/10 text-electric-blue border border-electric-blue/30 mb-4">
            TOP 20
          </span>
          <h1 class="text-4xl md:text-6xl font-rajdhani font-bold text-white mb-4">
            ARTISTAS <span class="text-electric-blue">EDM</span>
          </h1>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            Los artistas más influyentes de la música electrónica del momento
          </p>
        </div>

        <!-- Artists grid -->
        @if (loading()) {
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            @for (item of skeletons; track item) {
              <div class="glass rounded-2xl overflow-hidden animate-pulse">
                <div class="bg-white/5" style="aspect-ratio: 3/4"></div>
                <div class="p-4 space-y-2">
                  <div class="h-4 bg-white/5 rounded w-3/4"></div>
                  <div class="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            @for (artist of artists(); track artist.id) {
              <ft-artist-card [artist]="artist" />
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class ArtistsComponent implements OnInit {
  private readonly store = inject(Store);

  artists = this.store.selectSignal<Artist[]>(selectTop20Artists);
  loading = this.store.selectSignal(selectArtistsLoading);
  skeletons = Array(20).fill(0);

  ngOnInit(): void {
    this.store.dispatch(ArtistsActions.loadTop20());
  }
}
