import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Event, EventFilters } from '../../shared/models';
import { EventsActions } from './events.actions';

export interface EventsState extends EntityState<Event> {
  featuredEvents: Event[];
  selectedEvent: Event | null;
  filters: EventFilters;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const adapter = createEntityAdapter<Event>();

const initialState: EventsState = adapter.getInitialState({
  featuredEvents: [],
  selectedEvent: null,
  filters: { page: 1, limit: 12, sortBy: 'start_date', order: 'ASC' },
  total: 0,
  totalPages: 0,
  loading: false,
  error: null,
});

export const eventsReducer = createReducer(
  initialState,

  // Load events
  on(EventsActions.loadEvents, state => ({ ...state, loading: true, error: null })),
  on(EventsActions.loadEventsSuccess, (state, { response }) =>
    adapter.setAll(response.data, {
      ...state,
      loading: false,
      total: response.total,
      totalPages: response.totalPages,
    })
  ),
  on(EventsActions.loadEventsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Featured events
  on(EventsActions.loadFeaturedEvents, state => ({ ...state, loading: true })),
  on(EventsActions.loadFeaturedEventsSuccess, (state, { events }) => ({
    ...state,
    featuredEvents: events,
    loading: false,
  })),
  on(EventsActions.loadFeaturedEventsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Single event
  on(EventsActions.loadEvent, state => ({ ...state, loading: true, selectedEvent: null })),
  on(EventsActions.loadEventSuccess, (state, { event }) => ({
    ...state,
    selectedEvent: event,
    loading: false,
  })),
  on(EventsActions.loadEventFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Create
  on(EventsActions.createEventSuccess, (state, { event }) =>
    adapter.addOne(event, state)
  ),

  // Update
  on(EventsActions.updateEventSuccess, (state, { event }) =>
    adapter.updateOne({ id: event.id, changes: event }, state)
  ),

  // Delete
  on(EventsActions.deleteEventSuccess, (state, { id }) =>
    adapter.removeOne(id, state)
  ),

  // Toggle favorite
  on(EventsActions.toggleFavoriteSuccess, (state, { eventId, isFavorite }) =>
    adapter.updateOne({ id: eventId, changes: { isFavorite } }, {
      ...state,
      featuredEvents: state.featuredEvents.map(e =>
        e.id === eventId ? { ...e, isFavorite } : e
      ),
    })
  ),

  // Filters
  on(EventsActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters, page: 1 },
  })),
  on(EventsActions.resetFilters, state => ({
    ...state,
    filters: { page: 1, limit: 12, sortBy: 'start_date' as const, order: 'ASC' as const },
  })),
  on(EventsActions.setPage, (state, { page }) => ({
    ...state,
    filters: { ...state.filters, page },
  })),
);

export const {
  selectAll: selectAllEvents,
  selectEntities: selectEventEntities,
  selectIds: selectEventIds,
  selectTotal: selectEventsCount,
} = adapter.getSelectors();
