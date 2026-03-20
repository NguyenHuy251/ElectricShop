import { atom } from 'recoil';
import { Product } from '../../types';

const getInitialWishlist = (): Product[] => {
  try {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

export const wishlistAtom = atom<Product[]>({
  key: 'wishlistAtom',
  default: getInitialWishlist(),
  effects: [
    ({ onSet }) => {
      onSet((list) => localStorage.setItem('wishlist', JSON.stringify(list)));
    },
  ],
});
