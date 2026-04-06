import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type {
  CreateSupplierRequestBody,
  SupplierRow,
  UpdateSupplierRequestBody,
} from '../types/supplier.js';

export const getSuppliers = async (): Promise<SupplierRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_NhaCungCap_LayDanhSach');
  return result.recordset as SupplierRow[];
};

export const getSupplierById = async (id: number): Promise<SupplierRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_NhaCungCap_LayTheoId');
  return (result.recordset[0] as SupplierRow | undefined) ?? null;
};

export const createSupplier = async (payload: CreateSupplierRequestBody): Promise<SupplierRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('tenNhaCungCap', sql.NVarChar(200), payload.tenNhaCungCap)
    .input('sdt', sql.NVarChar(20), payload.sdt ?? null)
    .input('email', sql.NVarChar(100), payload.email ?? null)
    .input('diaChi', sql.NVarChar(sql.MAX), payload.diaChi ?? null)
    .execute('sp_NhaCungCap_Them');

  return (result.recordset[0] as SupplierRow | undefined) ?? null;
};

export const updateSupplier = async (id: number, payload: UpdateSupplierRequestBody): Promise<SupplierRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('tenNhaCungCap', sql.NVarChar(200), payload.tenNhaCungCap ?? null)
    .input('sdt', sql.NVarChar(20), payload.sdt ?? null)
    .input('email', sql.NVarChar(100), payload.email ?? null)
    .input('diaChi', sql.NVarChar(sql.MAX), payload.diaChi ?? null)
    .execute('sp_NhaCungCap_Sua');

  return (result.recordset[0] as SupplierRow | undefined) ?? null;
};

export const deleteSupplier = async (id: number): Promise<number> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_NhaCungCap_Xoa');
  return result.rowsAffected[0] ?? 0;
};
