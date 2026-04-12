import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';

export interface BackendCustomer {
  id: number;
  idTaiKhoan: number;
  maKhachHang: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  ghiChu: string;
  trangThai: boolean;
  tenDangNhap: string;
  email: string;
  sdt: string;
  diaChi: string;
}

export interface UpdateCustomerPayload {
  hoTen?: string;
  ngaySinh?: string;
  gioiTinh?: string;
  ghiChu?: string;
  email?: string;
  sdt?: string;
  diaChi?: string;
  trangThai?: boolean;
}

export const getCustomersApi = async (): Promise<ApiResponse<BackendCustomer[]>> => {
  const response = await httpClient.get<ApiResponse<BackendCustomer[]>>('/api/customers');
  return response.data;
};

export const updateCustomerApi = async (id: number, payload: UpdateCustomerPayload): Promise<ApiResponse<BackendCustomer>> => {
  const response = await httpClient.put<ApiResponse<BackendCustomer>>(`/api/customers/${id}`, payload);
  return response.data;
};

export const deleteCustomerApi = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/customers/${id}`);
  return response.data;
};
