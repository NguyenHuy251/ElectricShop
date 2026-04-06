import type { Request, Response } from 'express';
import {
  InventoryError,
  createImportReceiptService,
  deleteImportReceiptService,
  getImportReceiptByIdService,
  getImportReceiptsService,
  getInventoryStockService,
} from '../services/inventoryService.js';
import type { CreateImportReceiptRequestBody } from '../types/inventory.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof InventoryError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

export const getInventoryStockController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stockItems = await getInventoryStockService();
    res.status(200).json({ message: 'Lay danh sach ton kho thanh cong', data: stockItems });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getImportReceiptsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const receipts = await getImportReceiptsService();
    res.status(200).json({ message: 'Lay danh sach phieu nhap thanh cong', data: receipts });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getImportReceiptByIdController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const receipt = await getImportReceiptByIdService(id);
    res.status(200).json({ message: 'Lay chi tiet phieu nhap thanh cong', data: receipt });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createImportReceiptController = async (
  req: Request<unknown, unknown, CreateImportReceiptRequestBody>,
  res: Response,
): Promise<void> => {
  const payload = req.body;

  if (!payload?.idNhaCungCap || !Array.isArray(payload.items) || payload.items.length === 0) {
    res.status(400).json({ message: 'Vui long nhap idNhaCungCap va danh sach items hop le' });
    return;
  }

  try {
    const created = await createImportReceiptService(payload);
    res.status(201).json({ message: 'Tao phieu nhap thanh cong', data: created });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteImportReceiptController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    await deleteImportReceiptService(id);
    res.status(200).json({ message: 'Xoa phieu nhap thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
