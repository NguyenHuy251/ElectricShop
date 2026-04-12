import {
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from '../repositories/customerRepository.js';
import type { CustomerPublic, CustomerRow, UpdateCustomerRequestBody } from '../types/customer.js';

export class CustomerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'CustomerError';
    this.statusCode = statusCode;
  }
}

const mapCustomer = (row: CustomerRow): CustomerPublic => ({
  id: row.id,
  idTaiKhoan: row.idTaiKhoan,
  maKhachHang: row.maKhachHang,
  hoTen: row.hoTen,
  ngaySinh: row.ngaySinh ? row.ngaySinh.toISOString().slice(0, 10) : '',
  gioiTinh: row.gioiTinh ?? '',
  ghiChu: row.ghiChu ?? '',
  trangThai: row.trangThai,
  tenDangNhap: row.tenDangNhap ?? '',
  email: row.email ?? '',
  sdt: row.sdt ?? '',
  diaChi: row.diaChi ?? '',
});

export const getCustomersService = async (): Promise<CustomerPublic[]> => {
  const rows = await getCustomers();
  return rows.map(mapCustomer);
};

export const getCustomerByIdService = async (id: number): Promise<CustomerPublic> => {
  const row = await getCustomerById(id);
  if (!row) throw new CustomerError('Khong tim thay khach hang', 404);
  return mapCustomer(row);
};

export const updateCustomerService = async (id: number, payload: UpdateCustomerRequestBody): Promise<CustomerPublic> => {
  const existing = await getCustomerById(id);
  if (!existing) throw new CustomerError('Khong tim thay khach hang', 404);

  const updated = await updateCustomer(id, payload);
  if (!updated) throw new CustomerError('Khong the cap nhat khach hang', 500);
  return mapCustomer(updated);
};

export const deleteCustomerService = async (id: number): Promise<void> => {
  const affectedRows = await deleteCustomer(id);
  if (affectedRows === 0) throw new CustomerError('Khong tim thay khach hang de xoa', 404);
};
