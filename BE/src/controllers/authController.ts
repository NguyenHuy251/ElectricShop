import type { Request, Response } from 'express';
import {
  AuthError,
  changePassword,
  deleteAccount,
  getAccounts,
  login,
  register,
  updateAccountInfo,
  getAccountByIdService,
} from '../services/authService.js';
import type {
  ChangePasswordRequestBody,
  LoginRequestBody,
  RegisterRequestBody,
  UpdateAccountRequestBody,
} from '../types/auth.js';
import { generateAccessToken } from '../config/jwt.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Lỗi hệ thống' });
};

export const loginController = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response,
): Promise<void> => {
  const { tenDangNhap, matKhau } = req.body;

  if (!tenDangNhap || !matKhau) {
    res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    return;
  }

  try {
    const user = await login({ tenDangNhap, matKhau });
    const token = generateAccessToken({
      userId: user.id,
      tenDangNhap: user.tenDangNhap,
      vaiTro: user.vaiTro,
    });

    res.status(200).json({ message: 'Đăng nhập thành công', data: user, token });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const registerController = async (
  req: Request<unknown, unknown, RegisterRequestBody>,
  res: Response,
): Promise<void> => {
  const { tenDangNhap, matKhau, tenHienThi, email, sdt, diaChi } = req.body;

  if (!tenDangNhap || !matKhau) {
    res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    return;
  }

  try {
    const payload: RegisterRequestBody = { tenDangNhap, matKhau };

    if (tenHienThi !== undefined) {
      payload.tenHienThi = tenHienThi;
    }
    if (email !== undefined) {
      payload.email = email;
    }
    if (sdt !== undefined) {
      payload.sdt = sdt;
    }
    if (diaChi !== undefined) {
      payload.diaChi = diaChi;
    }

    const user = await register(payload);
    res.status(201).json({ message: 'Đăng ký thành công', data: user });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const changePasswordController = async (
  req: Request<unknown, unknown, ChangePasswordRequestBody>,
  res: Response,
): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  const { id, matKhauCu, matKhauMoi } = req.body;

  if (!id || !matKhauCu || !matKhauMoi) {
    res.status(400).json({ message: 'Vui lòng nhập id, mật khẩu cũ và mật khẩu mới' });
    return;
  }

  if (!authReq.user) {
    res.status(401).json({ message: 'Chưa xác thực người dùng' });
    return;
  }

  const isAdmin = authReq.user.vaiTro?.toLowerCase() === 'admin';
  if (!isAdmin && authReq.user.userId !== id) {
    res.status(403).json({ message: 'Bạn chỉ có thể đổi mật khẩu của chính mình' });
    return;
  }

  try {
    await changePassword({ id, matKhauCu, matKhauMoi });
    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteAccountController = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id không hợp lệ' });
    return;
  }

  try {
    await deleteAccount(id);
    res.status(200).json({ message: 'Xóa tài khoản thành công (đã chuyển trạng thái inactive)' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAccountsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const accounts = await getAccounts();
    res.status(200).json({ message: 'Lấy danh sách tài khoản thành công', data: accounts });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateAccountController = async (
  req: Request<{ id: string }, unknown, UpdateAccountRequestBody>,
  res: Response,
): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id không hợp lệ' });
    return;
  }

  if (!authReq.user) {
    res.status(401).json({ message: 'Chưa xác thực người dùng' });
    return;
  }

  const isAdmin = authReq.user.vaiTro?.toLowerCase() === 'admin';
  if (!isAdmin && authReq.user.userId !== id) {
    res.status(403).json({ message: 'Bạn chỉ có thể cập nhật thông tin của chính mình' });
    return;
  }

  try {
    const updates: UpdateAccountRequestBody = { id };

    if (req.body.tenHienThi !== undefined) {
      updates.tenHienThi = req.body.tenHienThi;
    }
    if (req.body.email !== undefined) {
      updates.email = req.body.email;
    }
    if (req.body.sdt !== undefined) {
      updates.sdt = req.body.sdt;
    }
    if (req.body.diaChi !== undefined) {
      updates.diaChi = req.body.diaChi;
    }
    if (isAdmin && req.body.vaiTro !== undefined) {
      updates.vaiTro = req.body.vaiTro;
    }

    const updated = await updateAccountInfo(updates);

    res.status(200).json({ message: 'Cập nhật tài khoản thành công', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getCurrentUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    res.status(401).json({ message: 'Chưa xác thực người dùng' });
    return;
  }

  try {
    const user = await getAccountByIdService(authReq.user.userId);
    res.status(200).json({ message: 'Lấy thông tin tài khoản thành công', data: user });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
