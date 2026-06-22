import { Injectable, inject, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartActions } from '../../store/cart/cart.actions';
import { CartItem } from '../../shared/models';
import { createSelector } from '@ngrx/store';

const selectCartState = (state: any) => state.cart;
const selectCartItems = createSelector(selectCartState, (s: any) => s.items as CartItem[]);
const selectDiscount = createSelector(selectCartState, (s: any) => s.discountAmount as number);

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly store = inject(Store);

  readonly items = this.store.selectSignal(selectCartItems);
  readonly discount = this.store.selectSignal(selectDiscount);

  readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  );

  readonly serviceFee = computed(() => this.subtotal() * 0.05);

  readonly total = computed(() =>
    this.subtotal() + this.serviceFee() - this.discount()
  );

  addItem(item: CartItem): void {
    this.store.dispatch(CartActions.addItem({ item }));
  }

  removeItem(tierId: string): void {
    this.store.dispatch(CartActions.removeItem({ tierId }));
  }

  updateQuantity(tierId: string, quantity: number): void {
    this.store.dispatch(CartActions.updateQuantity({ tierId, quantity }));
  }

  clear(): void {
    this.store.dispatch(CartActions.clearCart());
  }

  applyCoupon(code: string): void {
    this.store.dispatch(CartActions.applyCoupon({ code }));
  }

  removeCoupon(): void {
    this.store.dispatch(CartActions.removeCoupon());
  }
}
