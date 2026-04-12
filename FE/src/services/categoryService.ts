import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  mapBackendCategoryToCategory,
  updateCategoryApi,
  type BackendCategory,
  type CategoryPayload,
} from '../api/categoryApi';
import type { Category } from '../types';

export const mapBackendCategoryListToCategories = (items: BackendCategory[]): Category[] =>
  items.map(mapBackendCategoryToCategory);

export { mapBackendCategoryToCategory };

export const getCategories = () => getCategoriesApi();
export const createCategory = (payload: CategoryPayload) => createCategoryApi(payload);
export const updateCategory = (id: number, payload: Partial<CategoryPayload>) => updateCategoryApi(id, payload);
export const deleteCategory = (id: number) => deleteCategoryApi(id);
