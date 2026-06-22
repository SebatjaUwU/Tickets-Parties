import { createReducer, on } from '@ngrx/store';
import { CartItem } from '../../shared/models';
import { CartActions } from './cart.actions';

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
}

const initialState: CartState = {
  items: [],
  couponCode: null,
  discountAmount: 0,
};

export const cartReducer = createReducer(
  initialState,

  on(CartActions.addItem, (state, { item }) => {
    const existing = state.items.find(i => i.tierId === item.tierId);
    if (existing) {
      return {
        ...state,
        items: state.items.map(i =>
          i.tierId === item.tierId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      };
    }
    return { ...state, items: [...state.items, item] };
  }),

  on(CartActions.removeItem, (state, { tierId }) => ({
    ...state,
    items: state.items.filter(i => i.tierId !== tierId),
  })),

  on(CartActions.updateQuantity, (state, { tierId, quantity }) => ({
    ...state,
    items: state.items.map(i =>
      i.tierId === tierId ? { ...i, quantity } : i
    ),
  })),

  on(CartActions.clearCart, () => initialState),

  on(CartActions.applyCouponSuccess, (state, { code, discountAmount }) => ({
    ...state,
    couponCode: code,
    discountAmount,
  })),

  on(CartActions.removeCoupon, state => ({
    ...state,
    couponCode: null,
    discountAmount: 0,
  })),
);
