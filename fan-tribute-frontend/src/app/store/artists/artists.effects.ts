import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ArtistsActions } from './artists.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Artist } from '../../shared/models';

@Injectable()
export class ArtistsEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  private readonly API = `${environment.apiUrl}/artists`;

  loadTop20$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArtistsActions.loadTop20),
      switchMap(() =>
        this.http.get<Artist[]>(`${this.API}/top20`).pipe(
          map(artists => ArtistsActions.loadTop20Success({ artists })),
          catchError(error => of(ArtistsActions.loadTop20Failure({ error: error.message })))
        )
      )
    )
  );

  toggleFollow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArtistsActions.toggleFollow),
      switchMap(({ artistId }) =>
        this.http.post<void>(`${this.API}/${artistId}/follow`, {}).pipe(
          map(() => ArtistsActions.toggleFollowSuccess({ artistId, isFollowed: true })),
          catchError(error => of(ArtistsActions.toggleFollowFailure({ error: error.message })))
        )
      )
    )
  );
}
