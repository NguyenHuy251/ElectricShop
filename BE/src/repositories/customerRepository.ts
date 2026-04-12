import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type { CustomerRow, UpdateCustomerRequestBody } from '../types/customer.js';

export const getCustomers = async (): Promise<CustomerRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_KhachHang_LayDanhSach');
  return result.recordset as CustomerRow[];
};

export const getCustomerById = async (id: number): Promise<CustomerRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_KhachHang_LayTheoId');
  return (result.recordset[0] as CustomerRow | undefined) ?? null;
};

export const updateCustomer = async (id: number, payload: UpdateCustomerRequestBody): Promise<CustomerRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('hoTen', sql.NVarChar(100), payload.hoTen ?? null)
    .input('ngaySinh', sql.Date, payload.ngaySinh ? new Date(payload.ngaySinh) : null)
    .input('gioiTinh', sql.NVarChar(10), payload.gioiTinh ?? null)
    .input('ghiChu', sql.NVarChar(255), payload.ghiChu ?? null)
    .input('email', sql.NVarChar(100), payload.email ?? null)
    .input('sdt', sql.NVarChar(15), payload.sdt ?? null)
    .input('diaChi', sql.NVarChar(255), payload.diaChi ?? null)
    .input('trangThai', sql.Bit, payload.trangThai ?? null)
    .execute('sp_KhachHang_Sua');

  return (result.recordset[0] as CustomerRow | undefined) ?? null;
};

export const deleteCustomer = async (id: number): Promise<number> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_KhachHang_XoaMem');
  return result.rowsAffected[0] ?? 0;
};
