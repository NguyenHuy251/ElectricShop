import { atom } from 'recoil';
import type { Category } from '../../types';

export const categoriesAtom = atom<Category[]>({
  key: 'categoriesAtom',
  default: [],
});
