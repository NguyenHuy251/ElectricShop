import type { Request, Response } from 'express';
import {
  CustomerError,
  deleteCustomerService,
  getCustomerByIdService,
  getCustomersService,
  updateCustomerService,
} from '../services/customerService.js';
import type { UpdateCustomerRequestBody } from '../types/customer.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof CustomerError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

export const getCustomersController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const customers = await getCustomersService();
    res.status(200).json({ message: 'Lay danh sach khach hang thanh cong', data: customers });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getCustomerByIdController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const customer = await getCustomerByIdService(id);
    res.status(200).json({ message: 'Lay khach hang thanh cong', data: customer });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateCustomerController = async (
  req: Request<{ id: string }, unknown, UpdateCustomerRequestBody>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const updated = await updateCustomerService(id, req.body);
    res.status(200).json({ message: 'Cap nhat khach hang thanh cong', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteCustomerController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    await deleteCustomerService(id);
    res.status(200).json({ message: 'Xoa mem khach hang thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
