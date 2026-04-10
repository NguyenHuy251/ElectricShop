import type { Request, Response } from 'express';
import {
  createVoucherService,
  deleteVoucherService,
  getVoucherByIdService,
  getVouchersService,
  updateVoucherService,
  VoucherError,
} from '../services/voucherService.js';
import type { CreateVoucherRequestBody, UpdateVoucherRequestBody } from '../types/voucher.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof VoucherError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

export const getVouchersController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const vouchers = await getVouchersService();
    res.status(200).json({ message: 'Lay danh sach voucher thanh cong', data: vouchers });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getVoucherByIdController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const voucher = await getVoucherByIdService(id);
    res.status(200).json({ message: 'Lay voucher thanh cong', data: voucher });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createVoucherController = async (
  req: Request<unknown, unknown, CreateVoucherRequestBody>,
  res: Response,
): Promise<void> => {
  if (!req.body.maVoucher?.trim() || !req.body.ngayKetThuc || !Number.isFinite(req.body.giaTri) || !Number.isFinite(req.body.soLuong)) {
    res.status(400).json({ message: 'Du lieu voucher khong hop le' });
    return;
  }

  try {
    const created = await createVoucherService(req.body);
    res.status(201).json({ message: 'Tao voucher thanh cong', data: created });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateVoucherController = async (
  req: Request<{ id: string }, unknown, UpdateVoucherRequestBody>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const updated = await updateVoucherService(id, req.body);
    res.status(200).json({ message: 'Cap nhat voucher thanh cong', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteVoucherController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    await deleteVoucherService(id);
    res.status(200).json({ message: 'Xoa voucher thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
