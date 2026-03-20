import { selector } from 'recoil';
import { productsAtom, searchQueryAtom, selectedCategoryAtom } from '../atoms/productAtom';
import { Product } from '../../types';

export const filteredProductsSelector = selector<Product[]>({
  key: 'filteredProductsSelector',
  get: ({ get }) => {
    const products = get(productsAtom);
    const query = get(searchQueryAtom).toLowerCase().trim();
    const categoryId = get(selectedCategoryAtom);

    return products.filter((p) => {
      const matchesSearch = query === '' || p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query);
      const matchesCategory = categoryId === null || p.categoryId === categoryId;
      return matchesSearch && matchesCategory;
    });
  },
});

export const featuredProductsSelector = selector<Product[]>({
  key: 'featuredProductsSelector',
  get: ({ get }) => {
    const products = get(productsAtom);
    return products.filter((p) => p.isFeatured);
  },
});

export const newProductsSelector = selector<Product[]>({
  key: 'newProductsSelector',
  get: ({ get }) => {
    const products = get(productsAtom);
    return products.filter((p) => p.isNew);
  },
});
