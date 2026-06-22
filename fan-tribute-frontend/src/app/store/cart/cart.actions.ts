import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CartItem } from '../../shared/models';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Add Item': props<{ item: CartItem }>(),
    'Remove Item': props<{ tierId: string }>(),
    'Update Quantity': props<{ tierId: string; quantity: number }>(),
    'Clear Cart': emptyProps(),

    'Apply Coupon': props<{ code: string }>(),
    'Apply Coupon Success': props<{ code: string; discountAmount: number }>(),
    'Apply Coupon Failure': props<{ error: string }>(),
    'Remove Coupon': emptyProps(),

    'Create Order': emptyProps(),
    'Create Order Success': props<{ orderId: string }>(),
    'Create Order Failure': props<{ error: string }>(),
  },
});
