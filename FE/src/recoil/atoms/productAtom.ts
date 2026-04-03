import { atom } from 'recoil';
import { Product } from '../../types';

export const productsAtom = atom<Product[]>({
  key: 'productsAtom',
  default: [],
});

export const searchQueryAtom = atom<string>({
  key: 'searchQueryAtom',
  default: '',
});

export const selectedCategoryAtom = atom<number | null>({
  key: 'selectedCategoryAtom',
  default: null,
});
