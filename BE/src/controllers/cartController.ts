import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import {
  addCartItemService,
  CartError,
  clearCartService,
  getCartService,
  removeCartItemService,
  updateCartItemQuantityService,
} from '../services/cartService.js';
import type { CartItemRequestBody } from '../types/cart.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof CartError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

const getAuthUserId = (req: Request): number | null => {
  const authReq = req as AuthenticatedRequest;
  return authReq.user?.userId ?? null;
};

export const getCartController = async (req: Request, res: Response): Promise<void> => {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  try {
    const cart = await getCartService(userId);
    res.status(200).json({ message: 'Lay gio hang thanh cong', data: cart });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const addCartItemController = async (
  req: Request<unknown, unknown, CartItemRequestBody>,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  const { idSanPham, soLuong } = req.body;
  if (!idSanPham || !soLuong) {
    res.status(400).json({ message: 'Vui long nhap idSanPham va soLuong hop le' });
    return;
  }

  try {
    const cart = await addCartItemService(userId, idSanPham, soLuong);
    res.status(200).json({ message: 'Them san pham vao gio hang thanh cong', data: cart });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateCartItemController = async (
  req: Request<{ productId: string }, unknown, { soLuong: number }>,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId <= 0) {
    res.status(400).json({ message: 'productId khong hop le' });
    return;
  }

  const { soLuong } = req.body;
  if (!Number.isInteger(soLuong)) {
    res.status(400).json({ message: 'soLuong khong hop le' });
    return;
  }

  try {
    const cart = await updateCartItemQuantityService(userId, productId, soLuong);
    res.status(200).json({ message: 'Cap nhat so luong san pham thanh cong', data: cart });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const removeCartItemController = async (req: Request<{ productId: string }>, res: Response): Promise<void> => {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId <= 0) {
    res.status(400).json({ message: 'productId khong hop le' });
    return;
  }

  try {
    const cart = await removeCartItemService(userId, productId);
    res.status(200).json({ message: 'Xoa san pham khoi gio hang thanh cong', data: cart });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const clearCartController = async (req: Request, res: Response): Promise<void> => {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  try {
    await clearCartService(userId);
    res.status(200).json({ message: 'Xoa toan bo gio hang thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
