import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Event, EventFilters, PaginatedResponse } from '../../shared/models';

export const EventsActions = createActionGroup({
  source: 'Events',
  events: {
    // Load list
    'Load Events': props<{ filters?: EventFilters }>(),
    'Load Events Success': props<{ response: PaginatedResponse<Event> }>(),
    'Load Events Failure': props<{ error: string }>(),

    // Featured
    'Load Featured Events': emptyProps(),
    'Load Featured Events Success': props<{ events: Event[] }>(),
    'Load Featured Events Failure': props<{ error: string }>(),

    // Detail
    'Load Event': props<{ slug: string }>(),
    'Load Event Success': props<{ event: Event }>(),
    'Load Event Failure': props<{ error: string }>(),

    // CRUD
    'Create Event': props<{ data: Partial<Event> }>(),
    'Create Event Success': props<{ event: Event }>(),
    'Create Event Failure': props<{ error: string }>(),

    'Update Event': props<{ id: string; data: Partial<Event> }>(),
    'Update Event Success': props<{ event: Event }>(),
    'Update Event Failure': props<{ error: string }>(),

    'Delete Event': props<{ id: string }>(),
    'Delete Event Success': props<{ id: string }>(),
    'Delete Event Failure': props<{ error: string }>(),

    'Publish Event': props<{ id: string }>(),
    'Publish Event Success': props<{ event: Event }>(),
    'Publish Event Failure': props<{ error: string }>(),

    // Favorites
    'Toggle Favorite': props<{ eventId: string }>(),
    'Toggle Favorite Success': props<{ eventId: string; isFavorite: boolean }>(),
    'Toggle Favorite Failure': props<{ error: string }>(),

    // Filters
    'Update Filters': props<{ filters: EventFilters }>(),
    'Reset Filters': emptyProps(),
    'Set Page': props<{ page: number }>(),
  },
});
