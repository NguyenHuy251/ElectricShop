import type { Request, Response } from 'express';
import {
  CategoryError,
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} from '../services/categoryService.js';
import type { CreateCategoryRequestBody, UpdateCategoryRequestBody } from '../types/category.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof CategoryError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

export const getCategoriesController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getCategoriesService();
    res.status(200).json({ message: 'Lay danh sach danh muc thanh cong', data: categories });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getCategoryByIdController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const category = await getCategoryByIdService(id);
    res.status(200).json({ message: 'Lay danh muc thanh cong', data: category });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createCategoryController = async (
  req: Request<unknown, unknown, CreateCategoryRequestBody>,
  res: Response,
): Promise<void> => {
  if (!req.body.tenDanhMuc?.trim()) {
    res.status(400).json({ message: 'Vui long nhap ten danh muc' });
    return;
  }

  try {
    const created = await createCategoryService(req.body);
    res.status(201).json({ message: 'Tao danh muc thanh cong', data: created });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateCategoryController = async (
  req: Request<{ id: string }, unknown, UpdateCategoryRequestBody>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const updated = await updateCategoryService(id, req.body);
    res.status(200).json({ message: 'Cap nhat danh muc thanh cong', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteCategoryController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    await deleteCategoryService(id);
    res.status(200).json({ message: 'Xoa danh muc thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
