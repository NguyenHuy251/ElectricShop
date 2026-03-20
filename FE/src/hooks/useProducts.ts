import { useRecoilState, useRecoilValue } from 'recoil';
import { productsAtom, searchQueryAtom, selectedCategoryAtom } from '../recoil/atoms/productAtom';
import { filteredProductsSelector } from '../recoil/selectors/productSelectors';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useRecoilState(productsAtom);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryAtom);
  const filteredProducts = useRecoilValue(filteredProductsSelector);

  const getProductById = (id: number): Product | undefined =>
    products.find((p) => p.id === id);

  const addProduct = (product: Product) =>
    setProducts((prev) => [...prev, product]);

  const updateProduct = (updated: Product) =>
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  const deleteProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  return {
    products,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
