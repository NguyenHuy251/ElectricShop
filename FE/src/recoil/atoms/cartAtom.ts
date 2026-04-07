import { atom } from 'recoil';
import { CartItem } from '../../types';

export const cartAtom = atom<CartItem[]>({
  key: 'cartAtom',
  default: [],
});
