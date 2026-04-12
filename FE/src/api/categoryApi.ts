import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';
import type { Category } from '../types';

export interface BackendCategory {
  id: number;
  tenDanhMuc: string;
  slug: string;
  moTa: string;
  trangThai: boolean;
}

export interface CategoryPayload {
  tenDanhMuc: string;
  slug?: string;
  moTa?: string;
  trangThai?: boolean;
}

export const mapBackendCategoryToCategory = (item: BackendCategory): Category => ({
  id: item.id,
  name: item.tenDanhMuc,
  slug: item.slug,
  icon: '',
});

export const getCategoriesApi = async (): Promise<ApiResponse<BackendCategory[]>> => {
  const response = await httpClient.get<ApiResponse<BackendCategory[]>>('/api/categories');
  return response.data;
};

export const createCategoryApi = async (payload: CategoryPayload): Promise<ApiResponse<BackendCategory>> => {
  const response = await httpClient.post<ApiResponse<BackendCategory>>('/api/categories', payload);
  return response.data;
};

export const updateCategoryApi = async (id: number, payload: Partial<CategoryPayload>): Promise<ApiResponse<BackendCategory>> => {
  const response = await httpClient.put<ApiResponse<BackendCategory>>(`/api/categories/${id}`, payload);
  return response.data;
};

export const deleteCategoryApi = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/categories/${id}`);
  return response.data;
};
