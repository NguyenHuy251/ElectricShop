import {
  changePasswordApi,
  deleteAccountApi,
  getAccountsApi,
  getCurrentUserApi,
  loginApi,
  registerApi,
  updateAccountApi,
} from '../api/authApi';
import type { ChangePasswordPayload, RegisterPayload, UpdateAccountPayload } from '../types/auth';

export const login = (tenDangNhap: string, matKhau: string) => {
  return loginApi(tenDangNhap, matKhau);
};

export const register = (payload: RegisterPayload) => {
  return registerApi(payload);
};

export const changePassword = (payload: ChangePasswordPayload) => {
  return changePasswordApi(payload);
};

export const getAccounts = () => {
  return getAccountsApi();
};

export const deleteAccount = (id: number) => {
  return deleteAccountApi(id);
};

export const updateAccount = (payload: UpdateAccountPayload) => {
  return updateAccountApi(payload);
};

export const getCurrentUser = () => {
  return getCurrentUserApi();
};