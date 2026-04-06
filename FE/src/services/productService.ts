import {
  createProductApi,
  deleteProductApi,
  deleteProductImageApi,
  getProductByIdApi,
  getProductBySlugApi,
  getProductImagesApi,
  getProductsApi,
  mapBackendProductListToProducts,
  mapBackendProductToProduct,
  normalizeImageInputUrl,
  updateProductApi,
} from '../api/productApi';
import type { Product } from '../types';

export const getProducts = () => {
  return getProductsApi();
};

export const getProductById = (id: number) => {
  return getProductByIdApi(id);
};

export const getProductBySlug = (slug: string) => {
  return getProductBySlugApi(slug);
};

export const getProductImages = (id: number) => {
  return getProductImagesApi(id);
};

export const deleteProductImage = (productId: number, imageId: number) => {
  return deleteProductImageApi(productId, imageId);
};

export const createProduct = (product: Omit<Product, 'id'>) => {
  return createProductApi(product);
};

export const updateProduct = (id: number, product: Omit<Product, 'id'>) => {
  return updateProductApi(id, product);
};

export const deleteProduct = (id: number) => {
  return deleteProductApi(id);
};

export {
  mapBackendProductListToProducts,
  mapBackendProductToProduct,
  normalizeImageInputUrl,
};