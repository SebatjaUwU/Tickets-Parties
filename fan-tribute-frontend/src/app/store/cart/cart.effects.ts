import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CartActions } from './cart.actions';
import { environment } from '../../../environments/environment';
import { createSelector } from '@ngrx/store';

const selectCartState = (state: any) => state.cart;
const selectCartItems = createSelector(selectCartState, (s: any) => s.items);

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.createOrder),
      withLatestFrom(this.store.select(selectCartItems)),
      switchMap(([_, items]) =>
        this.http.post<{ orderId: string }>(`${environment.apiUrl}/tickets/orders`, { items }).pipe(
          map(res => CartActions.createOrderSuccess({ orderId: res.orderId })),
          catchError(error => of(CartActions.createOrderFailure({ error: error.message })))
        )
      )
    )
  );

  createOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.createOrderSuccess),
      tap(({ orderId }) => {
        // Navigate to payment with the orderId — cart is cleared after payment succeeds
        this.router.navigate(['/checkout/pago'], { queryParams: { orderId } });
      })
    ),
    { dispatch: false }
  );
}
