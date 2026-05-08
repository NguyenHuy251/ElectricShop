import {
  createAccount,
  getAccountById,
  getCurrentAccountById,
  getAllAccounts,
  getLoginByUsername,
  softDeleteAccountById,
  updatePasswordById,
  updateAccount,
} from '../repositories/authRepository.js';
import type { TaiKhoanRow } from '../repositories/authRepository.js';
import type {
  ChangePasswordRequestBody,
  ForgotPasswordRequestBody,
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

const normalizeRole = (value: string | null | undefined): string => (value || '').trim().toLowerCase();

const isAdminRole = (value: string | null | undefined): boolean => {
  const role = normalizeRole(value);
  return role === 'admin' || role === 'administrator';
};

const mapTaiKhoan = (row: TaiKhoanRow): TaiKhoanPublic => {
  const isAdmin = isAdminRole(row.vaiTro);
  const isEmployeeByRole = normalizeRole(row.vaiTro) === 'employee';
  const isEmployee = !isAdmin && (row.isEmployee ?? isEmployeeByRole);
  const employeeRole = isEmployee ? 'staff' : undefined;

  const toDateStr = (value: Date | string | null | undefined): string | null => {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  };

  return {
    id: row.id,
    tenDangNhap: row.tenDangNhap,
    tenHienThi: row.tenHienThi,
    email: row.email,
    sdt: row.sdt,
    diaChi: row.diaChi,
    vaiTro: row.vaiTro,
    trangThai: row.trangThai,
    isEmployee,
    employeeRole: employeeRole as 'staff' | 'supervisor' | 'manager' | undefined,
    ngaySinh: toDateStr(row.ngaySinh),
    gioiTinh: row.gioiTinh ?? null,
    ngayVaoLam: toDateStr(row.ngayVaoLam),
    boPhan: row.boPhan ?? null,
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

export const forgotPassword = async (payload: ForgotPasswordRequestBody): Promise<void> => {
  const tenDangNhap = (payload.tenDangNhap ?? '').trim();
  const email = (payload.email ?? '').trim().toLowerCase();
  const matKhauMoi = payload.matKhauMoi ?? '';

  if (!tenDangNhap || !email || !matKhauMoi) {
    throw new AuthError('Vui lòng nhập đầy đủ thông tin', 400);
  }

  if (matKhauMoi.length < 6) {
    throw new AuthError('Mật khẩu mới phải có ít nhất 6 ký tự', 400);
  }

  const user = await getLoginByUsername(tenDangNhap);

  if (!user) {
    throw new AuthError('Tên đăng nhập không tồn tại', 404);
  }

  if (!user.trangThai) {
    throw new AuthError('Tài khoản đã bị khóa hoặc xóa', 403);
  }

  const userEmail = (user.email ?? '').trim().toLowerCase();
  if (!userEmail || userEmail !== email) {
    throw new AuthError('Email không khớp với tài khoản', 400);
  }

  await updatePasswordById(user.id, matKhauMoi);
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
    ngaySinh?: string | null;
    gioiTinh?: string;
    ngayVaoLam?: string | null;
    boPhan?: string;
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
  if (payload.ngaySinh !== undefined) {
    updates.ngaySinh = payload.ngaySinh;
  }
  if (payload.gioiTinh !== undefined) {
    updates.gioiTinh = payload.gioiTinh;
  }
  if (payload.ngayVaoLam !== undefined) {
    updates.ngayVaoLam = payload.ngayVaoLam;
  }
  if (payload.boPhan !== undefined) {
    updates.boPhan = payload.boPhan;
  }

  const updated = await updateAccount(updates);

  if (!updated) {
    throw new AuthError('Không thể cập nhật tài khoản', 500);
  }

  return mapTaiKhoan(updated);
};

export const getAccountByIdService = async (id: number): Promise<TaiKhoanPublic> => {
  const user = await getCurrentAccountById(id);

  if (!user) {
    throw new AuthError('Không tìm thấy tài khoản', 404);
  }

  if (!user.trangThai) {
    throw new AuthError('Tài khoản đã bị khóa hoặc xóa', 403);
  }

  return mapTaiKhoan(user);
};
