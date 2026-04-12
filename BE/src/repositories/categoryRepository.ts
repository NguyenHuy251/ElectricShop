import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type {
  CategoryRow,
  CreateCategoryRequestBody,
  UpdateCategoryRequestBody,
} from '../types/category.js';

export const getCategories = async (): Promise<CategoryRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_DanhMuc_LayDanhSach');
  return result.recordset as CategoryRow[];
};

export const getCategoryById = async (id: number): Promise<CategoryRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_DanhMuc_LayTheoId');
  return (result.recordset[0] as CategoryRow | undefined) ?? null;
};

export const createCategory = async (payload: CreateCategoryRequestBody): Promise<CategoryRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('tenDanhMuc', sql.NVarChar(200), payload.tenDanhMuc)
    .input('slug', sql.NVarChar(255), payload.slug ?? null)
    .input('moTa', sql.NVarChar(sql.MAX), payload.moTa ?? null)
    .input('trangThai', sql.Bit, payload.trangThai ?? true)
    .execute('sp_DanhMuc_Them');

  return (result.recordset[0] as CategoryRow | undefined) ?? null;
};

export const updateCategory = async (id: number, payload: UpdateCategoryRequestBody): Promise<CategoryRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('tenDanhMuc', sql.NVarChar(200), payload.tenDanhMuc ?? null)
    .input('slug', sql.NVarChar(255), payload.slug ?? null)
    .input('moTa', sql.NVarChar(sql.MAX), payload.moTa ?? null)
    .input('trangThai', sql.Bit, payload.trangThai ?? null)
    .execute('sp_DanhMuc_Sua');

  return (result.recordset[0] as CategoryRow | undefined) ?? null;
};

export const deleteCategory = async (id: number): Promise<number> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_DanhMuc_Xoa');
  return result.rowsAffected[0] ?? 0;
};
