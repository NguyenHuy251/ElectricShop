import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';

export interface BackendBrand {
  id: number;
  tenThuongHieu: string;
  slug: string;
  logo: string;
  quocGia: string;
  trangThai: boolean;
}

export interface BrandPayload {
  tenThuongHieu: string;
  slug?: string;
  logo?: string;
  quocGia?: string;
  trangThai?: boolean;
}

export const getBrandsApi = async (): Promise<ApiResponse<BackendBrand[]>> => {
  const response = await httpClient.get<ApiResponse<BackendBrand[]>>('/api/brands');
  return response.data;
};

export const getBrandByIdApi = async (id: number): Promise<ApiResponse<BackendBrand>> => {
  const response = await httpClient.get<ApiResponse<BackendBrand>>(`/api/brands/${id}`);
  return response.data;
};

export const createBrandApi = async (payload: BrandPayload): Promise<ApiResponse<BackendBrand>> => {
  const response = await httpClient.post<ApiResponse<BackendBrand>>('/api/brands', payload);
  return response.data;
};

export const updateBrandApi = async (id: number, payload: BrandPayload): Promise<ApiResponse<BackendBrand>> => {
  const response = await httpClient.put<ApiResponse<BackendBrand>>(`/api/brands/${id}`, payload);
  return response.data;
};

export const deleteBrandApi = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/brands/${id}`);
  return response.data;
};
