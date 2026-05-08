import type { Request, Response } from 'express';
import {
  BrandError,
  createBrandService,
  deleteBrandService,
  getBrandByIdService,
  getBrandsService,
  updateBrandService,
} from '../services/brandService.js';
import type { CreateBrandRequestBody, UpdateBrandRequestBody } from '../types/brand.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof BrandError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

export const getBrandsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const brands = await getBrandsService();
    res.status(200).json({ message: 'Lay danh sach thuong hieu thanh cong', data: brands });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getBrandByIdController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const brand = await getBrandByIdService(id);
    res.status(200).json({ message: 'Lay thuong hieu thanh cong', data: brand });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createBrandController = async (
  req: Request<unknown, unknown, CreateBrandRequestBody>,
  res: Response,
): Promise<void> => {
  if (!req.body.tenThuongHieu?.trim()) {
    res.status(400).json({ message: 'Vui long nhap ten thuong hieu' });
    return;
  }

  try {
    const created = await createBrandService(req.body);
    res.status(201).json({ message: 'Tao thuong hieu thanh cong', data: created });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateBrandController = async (
  req: Request<{ id: string }, unknown, UpdateBrandRequestBody>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const updated = await updateBrandService(id, req.body);
    res.status(200).json({ message: 'Cap nhat thuong hieu thanh cong', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteBrandController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    await deleteBrandService(id);
    res.status(200).json({ message: 'Xoa thuong hieu thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
