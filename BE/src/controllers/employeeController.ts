import type { Request, Response } from 'express';
import {
  createEmployeeService,
  deleteEmployeeService,
  EmployeeError,
  getEmployeeByIdService,
  getEmployeesService,
  updateEmployeeService,
} from '../services/employeeService.js';
import type { CreateEmployeeRequestBody, UpdateEmployeeRequestBody } from '../types/employee.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof EmployeeError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

export const getEmployeesController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const employees = await getEmployeesService();
    res.status(200).json({ message: 'Lay danh sach nhan vien thanh cong', data: employees });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getEmployeeByIdController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const employee = await getEmployeeByIdService(id);
    res.status(200).json({ message: 'Lay nhan vien thanh cong', data: employee });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createEmployeeController = async (
  req: Request<unknown, unknown, CreateEmployeeRequestBody>,
  res: Response,
): Promise<void> => {
  if (!req.body.maNhanVien?.trim() || !req.body.hoTen?.trim()) {
    res.status(400).json({ message: 'Vui long nhap maNhanVien va hoTen' });
    return;
  }

  try {
    const created = await createEmployeeService(req.body);
    res.status(201).json({ message: 'Tao nhan vien thanh cong', data: created });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateEmployeeController = async (
  req: Request<{ id: string }, unknown, UpdateEmployeeRequestBody>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const updated = await updateEmployeeService(id, req.body);
    res.status(200).json({ message: 'Cap nhat nhan vien thanh cong', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteEmployeeController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    await deleteEmployeeService(id);
    res.status(200).json({ message: 'Xoa nhan vien thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
