import {
  createAccount,
  getAccountById,
  getAllAccounts,
  getLoginByUsername,
  softDeleteAccountById,
  updatePasswordById,
  updateAccount,
} from '../repositories/authRepository.js';
import type { TaiKhoanRow } from '../repositories/authRepository.js';
import type {
  ChangePasswordRequestBody,
  LoginRequestBody,
  RegisterRequestBody,
  UpdateAccountRequestBody,
  TaiKhoanPublic,
} from '../types/auth.js';

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

const mapTaiKhoan = (row: TaiKhoanRow): TaiKhoanPublic => {
  return {
    id: row.id,
    tenDangNhap: row.tenDangNhap,
    tenHienThi: row.tenHienThi,
    email: row.email,
    sdt: row.sdt,
    diaChi: row.diaChi,
    vaiTro: row.vaiTro,
    trangThai: row.trangThai,
  };
};

export const login = async (payload: LoginRequestBody): Promise<TaiKhoanPublic> => {
  const user = await getLoginByUsername(payload.tenDangNhap);

  if (!user) {
    throw new AuthError('Tên đăng nhập không tồn tại', 404);
  }

  if (!user.trangThai) {
    throw new AuthError('Tài khoản đã bị khóa hoặc xóa', 403);
  }

  if (user.matKhau !== payload.matKhau) {
    throw new AuthError('Mật khẩu không đúng', 401);
  }

  const profile = await getAccountById(user.id);
  if (!profile) {
    throw new AuthError('Không thể tải thông tin tài khoản', 500);
  }

  return mapTaiKhoan(profile);
};

export const register = async (payload: RegisterRequestBody): Promise<TaiKhoanPublic> => {
  try {
    const inserted = await createAccount(payload);
    if (!inserted) {
      throw new AuthError('Không thể tạo tài khoản', 500);
    }

    return mapTaiKhoan(inserted);
  } catch (error: unknown) {
    const sqlError = error as { number?: number };
    if (sqlError.number === 2627 || sqlError.number === 2601) {
      throw new AuthError('Tên đăng nhập đã tồn tại', 409);
    }

    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError('Đăng ký thất bại', 500);
  }
};

export const changePassword = async (payload: ChangePasswordRequestBody): Promise<void> => {
  const user = await getAccountById(payload.id);

  if (!user) {
    throw new AuthError('Không tìm thấy tài khoản', 404);
  }

  if (!user.trangThai) {
    throw new AuthError('Tài khoản đã bị khóa hoặc xóa', 403);
  }

  if (user.matKhau !== payload.matKhauCu) {
    throw new AuthError('Mật khẩu cũ không đúng', 401);
  }

  await updatePasswordById(payload.id, payload.matKhauMoi);
};

export const deleteAccount = async (id: number): Promise<void> => {
  const affectedRows = await softDeleteAccountById(id);

  if (affectedRows === 0) {
    throw new AuthError('Không tìm thấy tài khoản hoạt động để xóa', 404);
  }
};

export const getAccounts = async (): Promise<TaiKhoanPublic[]> => {
  const accounts = await getAllAccounts();
  return accounts.map(mapTaiKhoan);
};

export const updateAccountInfo = async (payload: UpdateAccountRequestBody): Promise<TaiKhoanPublic> => {
  const user = await getAccountById(payload.id);

  if (!user) {
    throw new AuthError('Không tìm thấy tài khoản', 404);
  }

  if (!user.trangThai) {
    throw new AuthError('Tài khoản đã bị khóa hoặc xóa', 403);
  }

  const updates: {
    id: number;
    tenHienThi?: string;
    email?: string;
    sdt?: string;
    diaChi?: string;
    vaiTro?: string;
  } = { id: payload.id };

  if (payload.tenHienThi !== undefined) {
    updates.tenHienThi = payload.tenHienThi;
  }
  if (payload.email !== undefined) {
    updates.email = payload.email;
  }
  if (payload.sdt !== undefined) {
    updates.sdt = payload.sdt;
  }
  if (payload.diaChi !== undefined) {
    updates.diaChi = payload.diaChi;
  }
  if (payload.vaiTro !== undefined) {
    updates.vaiTro = payload.vaiTro;
  }

  const updated = await updateAccount(updates);

  if (!updated) {
    throw new AuthError('Không thể cập nhật tài khoản', 500);
  }

  return mapTaiKhoan(updated);
};
