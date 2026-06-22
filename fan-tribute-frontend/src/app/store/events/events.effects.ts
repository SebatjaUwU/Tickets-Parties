import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { EventsActions } from './events.actions';
import { EventsService } from '../../core/services/events.service';
import { selectEventsFilters } from './events.selectors';

@Injectable()
export class EventsEffects {
  private readonly actions$ = inject(Actions);
  private readonly eventsService = inject(EventsService);
  private readonly store = inject(Store);

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.loadEvents, EventsActions.updateFilters, EventsActions.setPage),
      withLatestFrom(this.store.select(selectEventsFilters)),
      switchMap(([_, filters]) =>
        this.eventsService.getEvents(filters).pipe(
          map(response => EventsActions.loadEventsSuccess({ response })),
          catchError(error => of(EventsActions.loadEventsFailure({ error: error.message })))
        )
      )
    )
  );

  loadFeaturedEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.loadFeaturedEvents),
      switchMap(() =>
        this.eventsService.getFeaturedEvents().pipe(
          map(events => EventsActions.loadFeaturedEventsSuccess({ events })),
          catchError(error => of(EventsActions.loadFeaturedEventsFailure({ error: error.message })))
        )
      )
    )
  );

  loadEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.loadEvent),
      switchMap(({ slug }) =>
        this.eventsService.getEventBySlug(slug).pipe(
          map(event => EventsActions.loadEventSuccess({ event })),
          catchError(error => of(EventsActions.loadEventFailure({ error: error.message })))
        )
      )
    )
  );

  createEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.createEvent),
      switchMap(({ data }) =>
        this.eventsService.createEvent(data).pipe(
          map(event => EventsActions.createEventSuccess({ event })),
          catchError(error => of(EventsActions.createEventFailure({ error: error.message })))
        )
      )
    )
  );

  updateEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.updateEvent),
      switchMap(({ id, data }) =>
        this.eventsService.updateEvent(id, data).pipe(
          map(event => EventsActions.updateEventSuccess({ event })),
          catchError(error => of(EventsActions.updateEventFailure({ error: error.message })))
        )
      )
    )
  );

  deleteEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.deleteEvent),
      switchMap(({ id }) =>
        this.eventsService.deleteEvent(id).pipe(
          map(() => EventsActions.deleteEventSuccess({ id })),
          catchError(error => of(EventsActions.deleteEventFailure({ error: error.message })))
        )
      )
    )
  );

  toggleFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.toggleFavorite),
      switchMap(({ eventId }) =>
        this.eventsService.toggleFavorite(eventId, true).pipe(
          map(() => EventsActions.toggleFavoriteSuccess({ eventId, isFavorite: true })),
          catchError(error => of(EventsActions.toggleFavoriteFailure({ error: error.message })))
        )
      )
    )
  );
}
