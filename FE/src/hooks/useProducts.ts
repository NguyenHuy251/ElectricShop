import { useRecoilState, useRecoilValue } from 'recoil';
import { productsAtom, searchQueryAtom, selectedCategoryAtom } from '../recoil/atoms/productAtom';
import { filteredProductsSelector } from '../recoil/selectors/productSelectors';
import { Product } from '../types';
import {
  createProductApi,
  deleteProductApi,
  mapBackendProductToProduct,
  updateProductApi,
} from '../services/productApi';

export const useProducts = () => {
  const [products, setProducts] = useRecoilState(productsAtom);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryAtom);
  const filteredProducts = useRecoilValue(filteredProductsSelector);

  const getProductById = (id: number): Product | undefined =>
    products.find((p) => p.id === id);

  const addProduct = async (product: Product) => {
    const response = await createProductApi(product);
    const createdProduct = mapBackendProductToProduct(response.data);
    setProducts((prev) => [...prev, createdProduct]);
  };

  const updateProduct = async (updated: Product) => {
    const response = await updateProductApi(updated.id, updated);
    const updatedProduct = mapBackendProductToProduct(response.data);
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const deleteProduct = async (id: number) => {
    await deleteProductApi(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

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
