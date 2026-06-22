import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BlogActions } from './blog.actions';
import { BlogPost, PaginatedResponse } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class BlogEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/blog`;

  loadFeaturedPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.loadFeaturedPosts),
      switchMap(() =>
        this.http.get<BlogPost[]>(`${this.API}/posts/featured`).pipe(
          map(posts => BlogActions.loadFeaturedPostsSuccess({ posts })),
          catchError(error => of(BlogActions.loadFeaturedPostsFailure({ error: error.message })))
        )
      )
    )
  );

  loadPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.loadPost),
      switchMap(({ slug }) =>
        this.http.get<BlogPost>(`${this.API}/posts/${slug}`).pipe(
          map(post => BlogActions.loadPostSuccess({ post })),
          catchError(error => of(BlogActions.loadPostFailure({ error: error.message })))
        )
      )
    )
  );
}
