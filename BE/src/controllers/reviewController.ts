import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import {
  createReviewService,
  deleteReviewService,
  getReviewsByProductService,
  getReviewsService,
  ReviewError,
  updateReviewService,
} from '../services/reviewService.js';
import type { CreateReviewRequestBody, UpdateReviewRequestBody } from '../types/review.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof ReviewError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

const getCurrentUserId = (req: Request): number | null => {
  const authReq = req as AuthenticatedRequest;
  return authReq.user?.userId ?? null;
};

const isAdminUser = (req: Request): boolean => {
  const authReq = req as AuthenticatedRequest;
  return authReq.user?.vaiTro?.toLowerCase() === 'admin';
};

export const getReviewsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await getReviewsService();
    res.status(200).json({ message: 'Lay danh sach danh gia thanh cong', data: reviews });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getReviewsByProductController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'idSanPham khong hop le' });
    return;
  }

  try {
    const reviews = await getReviewsByProductService(id);
    res.status(200).json({ message: 'Lay danh gia san pham thanh cong', data: reviews });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createReviewController = async (
  req: Request<unknown, unknown, CreateReviewRequestBody>,
  res: Response,
): Promise<void> => {
  const userId = getCurrentUserId(req);
  if (!userId) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  try {
    const created = await createReviewService(userId, req.body);
    res.status(201).json({ message: 'Tao danh gia thanh cong', data: created });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateReviewController = async (
  req: Request<{ id: string }, unknown, UpdateReviewRequestBody>,
  res: Response,
): Promise<void> => {
  const reviewId = Number(req.params.id);
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  const userId = getCurrentUserId(req);
  if (!userId) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  try {
    const updated = await updateReviewService(reviewId, userId, isAdminUser(req), req.body);
    res.status(200).json({ message: 'Cap nhat danh gia thanh cong', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteReviewController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const reviewId = Number(req.params.id);
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  const userId = getCurrentUserId(req);
  if (!userId) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  try {
    await deleteReviewService(reviewId, userId, isAdminUser(req));
    res.status(200).json({ message: 'Xoa danh gia thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
