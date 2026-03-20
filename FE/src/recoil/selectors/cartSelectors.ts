import { selector } from 'recoil';
import { cartAtom } from '../atoms/cartAtom';

export const cartTotalSelector = selector<number>({
  key: 'cartTotalSelector',
  get: ({ get }) => {
    const cart = get(cartAtom);
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
});

export const cartCountSelector = selector<number>({
  key: 'cartCountSelector',
  get: ({ get }) => {
    const cart = get(cartAtom);
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
});
