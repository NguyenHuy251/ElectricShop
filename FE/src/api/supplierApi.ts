import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';

export interface BackendSupplier {
  id: number;
  tenNhaCungCap: string;
  sdt: string;
  email: string;
  diaChi: string;
}

export interface SupplierPayload {
  tenNhaCungCap: string;
  sdt?: string;
  email?: string;
  diaChi?: string;
}

export const getSuppliersApi = async (): Promise<ApiResponse<BackendSupplier[]>> => {
  const response = await httpClient.get<ApiResponse<BackendSupplier[]>>('/api/suppliers');
  return response.data;
};

export const getSupplierByIdApi = async (id: number): Promise<ApiResponse<BackendSupplier>> => {
  const response = await httpClient.get<ApiResponse<BackendSupplier>>(`/api/suppliers/${id}`);
  return response.data;
};

export const createSupplierApi = async (payload: SupplierPayload): Promise<ApiResponse<BackendSupplier>> => {
  const response = await httpClient.post<ApiResponse<BackendSupplier>>('/api/suppliers', payload);
  return response.data;
};

export const updateSupplierApi = async (id: number, payload: SupplierPayload): Promise<ApiResponse<BackendSupplier>> => {
  const response = await httpClient.put<ApiResponse<BackendSupplier>>(`/api/suppliers/${id}`, payload);
  return response.data;
};

export const deleteSupplierApi = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/suppliers/${id}`);
  return response.data;
};
