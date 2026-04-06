import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';
import type {
  BackendAuthUser,
  ChangePasswordPayload,
  LoginResponse,
  RegisterPayload,
  UpdateAccountPayload,
} from '../types/auth';

export const loginApi = async (tenDangNhap: string, matKhau: string): Promise<LoginResponse> => {
  const response = await httpClient.post<LoginResponse>('/api/auth/login', {
    tenDangNhap,
    matKhau,
  });
  return response.data;
};

export const registerApi = async (payload: RegisterPayload): Promise<ApiResponse<BackendAuthUser>> => {
  const response = await httpClient.post<ApiResponse<BackendAuthUser>>('/api/auth/register', payload);
  return response.data;
};

export const changePasswordApi = async (
  payload: ChangePasswordPayload,
): Promise<{ message: string }> => {
  const response = await httpClient.put<{ message: string }>('/api/auth/change-password', payload);
  return response.data;
};

export const getAccountsApi = async (): Promise<ApiResponse<BackendAuthUser[]>> => {
  const response = await httpClient.get<ApiResponse<BackendAuthUser[]>>('/api/auth/accounts');
  return response.data;
};

export const deleteAccountApi = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/auth/${id}`);
  return response.data;
};

export const updateAccountApi = async (
  payload: UpdateAccountPayload,
): Promise<ApiResponse<BackendAuthUser>> => {
  const response = await httpClient.patch<ApiResponse<BackendAuthUser>>(`/api/auth/${payload.id}`, {
    tenHienThi: payload.tenHienThi,
    email: payload.email,
    sdt: payload.sdt,
    diaChi: payload.diaChi,
    vaiTro: payload.vaiTro,
  });
  return response.data;
};

export const getCurrentUserApi = async (): Promise<ApiResponse<BackendAuthUser>> => {
  const response = await httpClient.get<ApiResponse<BackendAuthUser>>('/api/auth/me');
  return response.data;
};