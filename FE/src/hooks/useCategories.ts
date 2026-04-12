import { useRecoilState } from 'recoil';
import { categoriesAtom } from '../recoil/atoms/categoryAtom';
import {
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
  getCategories as getCategoriesService,
  mapBackendCategoryToCategory,
  mapBackendCategoryListToCategories,
  updateCategory as updateCategoryService,
} from '../services';
import type { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useRecoilState(categoriesAtom);

  const reloadCategories = async (): Promise<void> => {
    const response = await getCategoriesService();
    setCategories(mapBackendCategoryListToCategories(response.data));
  };

  const addCategory = async (payload: { tenDanhMuc: string; slug?: string; moTa?: string; trangThai?: boolean }): Promise<void> => {
    const response = await createCategoryService(payload);
    const created = mapBackendCategoryToCategory(response.data);
    setCategories((prev) => [created, ...prev]);
  };

  const editCategory = async (id: number, payload: { tenDanhMuc?: string; slug?: string; moTa?: string; trangThai?: boolean }): Promise<void> => {
    const response = await updateCategoryService(id, payload);
    const updated = mapBackendCategoryToCategory(response.data);
    setCategories((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const removeCategory = async (id: number): Promise<void> => {
    await deleteCategoryService(id);
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  const getCategoryById = (id: number): Category | undefined => categories.find((item) => item.id === id);

  return {
    categories,
    getCategoryById,
    addCategory,
    editCategory,
    removeCategory,
    reloadCategories,
  };
};
