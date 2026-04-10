import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from '../repositories/employeeRepository.js';
import type {
  CreateEmployeeRequestBody,
  EmployeePublic,
  EmployeeRow,
  UpdateEmployeeRequestBody,
} from '../types/employee.js';

export class EmployeeError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'EmployeeError';
    this.statusCode = statusCode;
  }
}

const mapEmployee = (row: EmployeeRow): EmployeePublic => ({
  id: row.id,
  idTaiKhoan: row.idTaiKhoan,
  maNhanVien: row.maNhanVien,
  hoTen: row.hoTen,
  sdt: row.sdt ?? '',
  email: row.email ?? '',
  diaChi: row.diaChi ?? '',
  chucVu: row.chucVu ?? '',
  boPhan: row.boPhan ?? '',
  ngayVaoLam: row.ngayVaoLam ? row.ngayVaoLam.toISOString().slice(0, 10) : '',
  luongCoBan: Number(row.luongCoBan ?? 0),
  trangThai: row.trangThai,
});

export const getEmployeesService = async (): Promise<EmployeePublic[]> => {
  const rows = await getEmployees();
  return rows.map(mapEmployee);
};

export const getEmployeeByIdService = async (id: number): Promise<EmployeePublic> => {
  const row = await getEmployeeById(id);
  if (!row) {
    throw new EmployeeError('Khong tim thay nhan vien', 404);
  }

  return mapEmployee(row);
};

export const createEmployeeService = async (payload: CreateEmployeeRequestBody): Promise<EmployeePublic> => {
  const created = await createEmployee(payload);
  if (!created) {
    throw new EmployeeError('Khong the tao nhan vien', 500);
  }

  return mapEmployee(created);
};

export const updateEmployeeService = async (id: number, payload: UpdateEmployeeRequestBody): Promise<EmployeePublic> => {
  const existing = await getEmployeeById(id);
  if (!existing) {
    throw new EmployeeError('Khong tim thay nhan vien', 404);
  }

  const updated = await updateEmployee(id, payload);
  if (!updated) {
    throw new EmployeeError('Khong the cap nhat nhan vien', 500);
  }

  return mapEmployee(updated);
};

export const deleteEmployeeService = async (id: number): Promise<void> => {
  const affectedRows = await deleteEmployee(id);
  if (affectedRows === 0) {
    throw new EmployeeError('Khong tim thay nhan vien de xoa', 404);
  }
};
