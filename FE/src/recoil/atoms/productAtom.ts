import { atom } from 'recoil';
import { Product } from '../../types';
import { products as mockProducts } from '../../data/mockData';

export const productsAtom = atom<Product[]>({
  key: 'productsAtom',
  default: mockProducts,
});

export const searchQueryAtom = atom<string>({
  key: 'searchQueryAtom',
  default: '',
});

export const selectedCategoryAtom = atom<number | null>({
  key: 'selectedCategoryAtom',
  default: null,
});
