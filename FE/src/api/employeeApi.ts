import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';
import type { Employee } from '../types';

export interface EmployeePayload {
  idTaiKhoan?: number;
  maNhanVien: string;
  hoTen: string;
  sdt?: string;
  email?: string;
  diaChi?: string;
  chucVu?: string;
  boPhan?: string;
  ngayVaoLam?: string;
  luongCoBan?: number;
  trangThai?: boolean;
}

export const getEmployeesApi = async (): Promise<ApiResponse<Employee[]>> => {
  const response = await httpClient.get<ApiResponse<Employee[]>>('/api/employees');
  return response.data;
};

export const createEmployeeApi = async (payload: EmployeePayload): Promise<ApiResponse<Employee>> => {
  const response = await httpClient.post<ApiResponse<Employee>>('/api/employees', payload);
  return response.data;
};

export const updateEmployeeApi = async (id: number, payload: Partial<EmployeePayload>): Promise<ApiResponse<Employee>> => {
  const response = await httpClient.put<ApiResponse<Employee>>(`/api/employees/${id}`, payload);
  return response.data;
};

export const deleteEmployeeApi = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/employees/${id}`);
  return response.data;
};
