import { Cart, CartItem } from '../models';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart): number {
  if (!cart) return 0;

  return cart.items.reduce(
    (total: number, { price, count }: CartItem): number => {
      return total + price * count;
    },
    0,
  );
}
