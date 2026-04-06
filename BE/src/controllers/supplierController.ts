import type { Request, Response } from 'express';
import {
  SupplierError,
  createSupplierService,
  deleteSupplierService,
  getSupplierByIdService,
  getSuppliersService,
  updateSupplierService,
} from '../services/supplierService.js';
import type { CreateSupplierRequestBody, UpdateSupplierRequestBody } from '../types/supplier.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof SupplierError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

export const getSuppliersController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const suppliers = await getSuppliersService();
    res.status(200).json({ message: 'Lay danh sach nha cung cap thanh cong', data: suppliers });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getSupplierByIdController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const supplier = await getSupplierByIdService(id);
    res.status(200).json({ message: 'Lay nha cung cap thanh cong', data: supplier });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createSupplierController = async (
  req: Request<unknown, unknown, CreateSupplierRequestBody>,
  res: Response,
): Promise<void> => {
  if (!req.body.tenNhaCungCap?.trim()) {
    res.status(400).json({ message: 'Vui long nhap ten nha cung cap' });
    return;
  }

  try {
    const created = await createSupplierService(req.body);
    res.status(201).json({ message: 'Tao nha cung cap thanh cong', data: created });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateSupplierController = async (
  req: Request<{ id: string }, unknown, UpdateSupplierRequestBody>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const updated = await updateSupplierService(id, req.body);
    res.status(200).json({ message: 'Cap nhat nha cung cap thanh cong', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteSupplierController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    await deleteSupplierService(id);
    res.status(200).json({ message: 'Xoa nha cung cap thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
