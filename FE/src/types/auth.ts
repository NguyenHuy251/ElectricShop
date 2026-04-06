import type { ApiResponse } from './api';

export interface BackendAuthUser {
  id: number;
  tenDangNhap: string;
  tenHienThi: string | null;
  email: string | null;
  sdt: string | null;
  diaChi: string | null;
  vaiTro: string | null;
  trangThai: boolean;
  isEmployee?: boolean;
  employeeRole?: 'staff' | 'supervisor' | 'manager';
}

export interface LoginResponse extends ApiResponse<BackendAuthUser> {
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

export interface RegisterPayload {
  tenDangNhap: string;
  matKhau: string;
  tenHienThi: string;
  email: string;
  sdt: string;
}