import type { Request, Response } from 'express';
import {
  getInvoiceByOrderIdService,
  getInvoicesService,
  InvoiceError,
} from '../services/invoiceService.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof InvoiceError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

export const getInvoicesController = async (req: Request, res: Response): Promise<void> => {
  const authUser = (req as AuthenticatedRequest).user;
  if (!authUser) {
    res.status(401).json({ message: 'Chua xac thuc nguoi dung' });
    return;
  }

  const role = authUser.vaiTro?.toLowerCase() ?? '';
  const canViewAll = role === 'admin' || role === 'employee';

  try {
    const invoices = await getInvoicesService(canViewAll ? undefined : authUser.userId);
    res.status(200).json({ message: 'Lay danh sach hoa don thanh cong', data: invoices });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getInvoiceByOrderIdController = async (req: Request<{ orderId: string }>, res: Response): Promise<void> => {
  const orderId = Number(req.params.orderId);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    res.status(400).json({ message: 'orderId khong hop le' });
    return;
  }

  try {
    const invoice = await getInvoiceByOrderIdService(orderId);
    res.status(200).json({ message: 'Lay hoa don thanh cong', data: invoice });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
