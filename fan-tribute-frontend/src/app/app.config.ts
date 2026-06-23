import { ApplicationConfig, provideZoneChangeDetection, isDevMode, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';
import { catchError, of } from 'rxjs';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { apiUnwrapInterceptor } from './core/interceptors/api-unwrap.interceptor';

import { authReducer } from './store/auth/auth.reducer';
import { eventsReducer } from './store/events/events.reducer';
import { cartReducer } from './store/cart/cart.reducer';
import { artistsReducer } from './store/artists/artists.reducer';
import { blogReducer } from './store/blog/blog.reducer';

import { AuthEffects } from './store/auth/auth.effects';
import { EventsEffects } from './store/events/events.effects';
import { ArtistsEffects } from './store/artists/artists.effects';
import { BlogEffects } from './store/blog/blog.effects';
import { CartEffects } from './store/cart/cart.effects';

// Initialize Firebase once at app startup
initializeApp(environment.firebaseConfig);

function restoreSessionFactory(authService: AuthService, tokenService: TokenService) {
  return () => {
    if (tokenService.isAccessTokenValid()) {
      return authService.loadCurrentUser().pipe(catchError(() => of(null)));
    }
    return of(null);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),

    provideHttpClient(
      withInterceptors([
        apiUnwrapInterceptor,
        authInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ])
    ),

    provideAnimationsAsync(),

    // Restore session on app start
    {
      provide: APP_INITIALIZER,
      useFactory: restoreSessionFactory,
      deps: [AuthService, TokenService],
      multi: true,
    },

    // NgRx Store
    provideStore({
      auth:    authReducer,
      events:  eventsReducer,
      cart:    cartReducer,
      artists: artistsReducer,
      blog:    blogReducer,
    }),

    provideEffects([
      AuthEffects,
      EventsEffects,
      ArtistsEffects,
      BlogEffects,
      CartEffects,
    ]),

    provideRouterStore(),

    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),

    // PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
