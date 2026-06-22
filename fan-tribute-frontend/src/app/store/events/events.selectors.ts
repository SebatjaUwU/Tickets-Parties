import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventsState, selectAllEvents, selectEventEntities } from './events.reducer';

const selectEventsState = createFeatureSelector<EventsState>('events');

export const selectAllEventsEntities = createSelector(selectEventsState, selectAllEvents);
export const selectFeaturedEvents = createSelector(selectEventsState, s => s.featuredEvents);
export const selectSelectedEvent = createSelector(selectEventsState, s => s.selectedEvent);
export const selectEventsFilters = createSelector(selectEventsState, s => s.filters);
export const selectEventsTotal = createSelector(selectEventsState, s => s.total);
export const selectEventsTotalPages = createSelector(selectEventsState, s => s.totalPages);
export const selectEventsLoading = createSelector(selectEventsState, s => s.loading);
export const selectEventsError = createSelector(selectEventsState, s => s.error);

export const selectEventBySlug = (slug: string) =>
  createSelector(selectAllEventsEntities, events => events.find(e => e.slug === slug));
