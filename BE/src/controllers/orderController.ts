import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import {
  createOrderService,
  getOrdersService,
  OrderError,
  updateOrderStatusService,
} from '../services/orderService.js';
import type { CreateOrderRequestBody, UpdateOrderStatusRequestBody } from '../types/order.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof OrderError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

const getAuthUser = (req: Request<any, any, any, any>): AuthenticatedRequest['user'] => {
  return (req as AuthenticatedRequest).user;
};

export const getOrdersController = async (req: Request, res: Response): Promise<void> => {
  const authUser = getAuthUser(req);
  if (!authUser) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  const role = authUser.vaiTro?.toLowerCase() ?? '';
  const canViewAll = role === 'admin' || role === 'employee';

  try {
    const orders = await getOrdersService(canViewAll ? undefined : authUser.userId);
    res.status(200).json({ message: 'Lay danh sach don hang thanh cong', data: orders });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getMyOrdersController = async (req: Request, res: Response): Promise<void> => {
  const authUser = getAuthUser(req);
  if (!authUser) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  try {
    const orders = await getOrdersService(authUser.userId);
    res.status(200).json({ message: 'Lay don hang cua toi thanh cong', data: orders });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createOrderController = async (
  req: Request<unknown, unknown, CreateOrderRequestBody>,
  res: Response,
): Promise<void> => {
  const authUser = getAuthUser(req);
  if (!authUser) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  if (!req.body.address?.trim() || !Array.isArray(req.body.items) || req.body.items.length === 0) {
    res.status(400).json({ message: 'Du lieu don hang khong hop le' });
    return;
  }

  try {
    const created = await createOrderService(authUser.userId, req.body);
    res.status(201).json({ message: 'Tao don hang thanh cong', data: created });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateOrderStatusController = async (
  req: Request<{ id: string }, unknown, UpdateOrderStatusRequestBody>,
  res: Response,
): Promise<void> => {
  const authUser = getAuthUser(req);
  if (!authUser) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  if (!req.body.status) {
    res.status(400).json({ message: 'Vui long nhap trang thai' });
    return;
  }

  try {
    await updateOrderStatusService(id, req.body.status, authUser.userId);
    res.status(200).json({ message: 'Cap nhat trang thai don hang thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
