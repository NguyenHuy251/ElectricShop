import { atom } from 'recoil';
import { CartItem } from '../../types';

const getInitialCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const cartAtom = atom<CartItem[]>({
  key: 'cartAtom',
  default: getInitialCart(),
  effects: [
    ({ onSet }) => {
      onSet((newCart) => {
        localStorage.setItem('cart', JSON.stringify(newCart));
      });
    },
  ],
});
