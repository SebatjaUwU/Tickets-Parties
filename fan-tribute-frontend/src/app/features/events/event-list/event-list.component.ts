import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { EventsActions } from '../../../store/events/events.actions';
import { selectAllEventsEntities, selectEventsLoading } from '../../../store/events/events.selectors';
import { Event } from '../../../shared/models';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4">

        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-6xl font-rajdhani font-bold text-white mb-4">
            EVENTOS <span class="text-electric-blue">EDM</span>
          </h1>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            Los mejores festivales y conciertos de música electrónica en Colombia y el mundo
          </p>
        </div>

        <!-- Events grid -->
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (item of skeletons; track $index) {
              <div class="glass rounded-2xl overflow-hidden animate-pulse">
                <div class="bg-white/5 h-48"></div>
                <div class="p-5 space-y-3">
                  <div class="h-4 bg-white/5 rounded w-3/4"></div>
                  <div class="h-4 bg-white/5 rounded w-1/2"></div>
                  <div class="h-10 bg-white/5 rounded"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (event of events(); track event.id) {
              <ft-event-card [event]="event" (favoriteToggle)="onFavoriteToggle($event)" />
            }
          </div>

          @if (events().length === 0) {
            <div class="text-center py-20">
              <p class="text-6xl mb-4">🎵</p>
              <p class="text-gray-400 text-xl">No hay eventos disponibles por el momento</p>
            </div>
          }
        }
      </div>
    </section>
  `,
})
export class EventListComponent implements OnInit {
  private readonly store = inject(Store);

  events = this.store.selectSignal<Event[]>(selectAllEventsEntities);
  loading = this.store.selectSignal(selectEventsLoading);
  skeletons = Array(6).fill(0);

  ngOnInit(): void {
    this.store.dispatch(EventsActions.loadEvents({}));
  }

  onFavoriteToggle(eventId: string): void {
    this.store.dispatch(EventsActions.toggleFavorite({ eventId }));
  }
}
