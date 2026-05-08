import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type {
  BrandRow,
  CreateBrandRequestBody,
  UpdateBrandRequestBody,
} from '../types/brand.js';

export const getBrands = async (): Promise<BrandRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_ThuongHieu_LayDanhSach');
  return result.recordset as BrandRow[];
};

export const getBrandById = async (id: number): Promise<BrandRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_ThuongHieu_LayTheoId');
  return (result.recordset[0] as BrandRow | undefined) ?? null;
};

export const createBrand = async (payload: CreateBrandRequestBody): Promise<BrandRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('tenThuongHieu', sql.NVarChar(150), payload.tenThuongHieu)
    .input('slug', sql.NVarChar(150), payload.slug ?? null)
    .input('logo', sql.NVarChar(255), payload.logo ?? null)
    .input('quocGia', sql.NVarChar(100), payload.quocGia ?? null)
    .input('trangThai', sql.Bit, payload.trangThai ?? true)
    .execute('sp_ThuongHieu_Them');

  return (result.recordset[0] as BrandRow | undefined) ?? null;
};

export const updateBrand = async (id: number, payload: UpdateBrandRequestBody): Promise<BrandRow | null> => {
  const pool = await connectToDatabase();
  const request = pool
    .request()
    .input('id', sql.Int, id)
    .input('tenThuongHieu', sql.NVarChar(150), payload.tenThuongHieu ?? null)
    .input('slug', sql.NVarChar(150), payload.slug ?? null)
    .input('logo', sql.NVarChar(255), payload.logo ?? null)
    .input('quocGia', sql.NVarChar(100), payload.quocGia ?? null);

  if (payload.trangThai === undefined) {
    request.input('trangThai', sql.Bit, null);
  } else {
    request.input('trangThai', sql.Bit, payload.trangThai);
  }

  const result = await request.execute('sp_ThuongHieu_Sua');
  return (result.recordset[0] as BrandRow | undefined) ?? null;
};

export const deleteBrand = async (id: number): Promise<number> => {
  const pool = await connectToDatabase();

  const existing = await pool.request().input('id', sql.Int, id).execute('sp_ThuongHieu_LayTheoId');
  if (!existing.recordset[0]) {
    return 0;
  }

  await pool.request().input('id', sql.Int, id).execute('sp_ThuongHieu_Xoa');
  return 1;
};
