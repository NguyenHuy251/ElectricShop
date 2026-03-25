import { httpClient } from './httpClient';

export interface BackendAuthUser {
  id: number;
  tenDangNhap: string;
  tenHienThi: string | null;
  email: string | null;
  sdt: string | null;
  diaChi: string | null;
  vaiTro: string | null;
  trangThai: boolean;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface LoginResponse extends ApiResponse<BackendAuthUser> {
  token: string;
}

export interface ChangePasswordPayload {
  id: number;
  matKhauCu: string;
  matKhauMoi: string;
}

export interface UpdateAccountPayload {
  id: number;
  tenHienThi?: string;
  email?: string;
  sdt?: string;
  diaChi?: string;
  vaiTro?: string;
}

export const loginApi = async (tenDangNhap: string, matKhau: string): Promise<LoginResponse> => {
  const response = await httpClient.post<LoginResponse>('/api/auth/login', {
    tenDangNhap,
    matKhau,
  });
  return response.data;
};

export const registerApi = async (payload: {
  tenDangNhap: string;
  matKhau: string;
  tenHienThi: string;
  email: string;
  sdt: string;
}): Promise<ApiResponse<BackendAuthUser>> => {
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
