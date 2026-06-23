import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthActions } from './auth.actions';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ dto }) =>
        this.authService.login(dto).pipe(
          map(tokens => AuthActions.loginSuccess({ tokens })),
          catchError(error => of(AuthActions.loginFailure({ error: error.error?.message ?? 'Error al iniciar sesión' })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        this.router.navigate(['/']).then(() => {
          setTimeout(() => this.notification.success('¡Bienvenido de vuelta! 🎵'), 600);
        });
      })
    ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ dto }) =>
        this.authService.register(dto).pipe(
          map(tokens => AuthActions.registerSuccess({ tokens })),
          catchError(error => of(AuthActions.registerFailure({ error: error.error?.message ?? 'Error al registrarse' })))
        )
      )
    )
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => {
        this.router.navigate(['/']).then(() => {
          setTimeout(() => this.notification.success('¡Cuenta creada! Verifica tu correo 📧'), 600);
        });
      })
    ),
    { dispatch: false }
  );

  googleLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.googleLogin),
      switchMap(({ idToken }) =>
        this.authService.googleLogin(idToken).pipe(
          map(tokens => AuthActions.googleLoginSuccess({ tokens })),
          catchError(error => of(AuthActions.googleLoginFailure({ error: error.message })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.logout();
        this.notification.info('Sesión cerrada');
      })
    ),
    { dispatch: false }
  );

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      switchMap(({ email }) =>
        this.authService.forgotPassword(email).pipe(
          map(() => AuthActions.forgotPasswordSuccess()),
          catchError(error => of(AuthActions.forgotPasswordFailure({ error: error.message })))
        )
      )
    )
  );
}
