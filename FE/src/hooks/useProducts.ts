import { useRecoilState, useRecoilValue } from 'recoil';
import { productsAtom, searchQueryAtom, selectedCategoryAtom } from '../recoil/atoms/productAtom';
import { filteredProductsSelector } from '../recoil/selectors/productSelectors';
import { Product } from '../types';
import {
  createProduct as createProductService,
  deleteProduct as deleteProductService,
  mapBackendProductToProduct,
  updateProduct as updateProductService,
} from '../services';

export const useProducts = () => {
  const [products, setProducts] = useRecoilState(productsAtom);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryAtom);
  const filteredProducts = useRecoilValue(filteredProductsSelector);

  const getProductById = (id: number): Product | undefined =>
    products.find((p) => p.id === id);

  const addProduct = async (product: Product) => {
    const response = await createProductService(product);
    const createdProduct = mapBackendProductToProduct(response.data);
    setProducts((prev) => [...prev, createdProduct]);
  };

  const updateProduct = async (updated: Product) => {
    const response = await updateProductService(updated.id, updated);
    const updatedProduct = mapBackendProductToProduct(response.data);
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const deleteProduct = async (id: number) => {
    await deleteProductService(id);
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
