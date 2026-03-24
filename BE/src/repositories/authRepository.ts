import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';

export interface TaiKhoanRow {
  id: number;
  tenDangNhap: string;
  matKhau?: string;
  tenHienThi: string | null;
  email: string | null;
  sdt: string | null;
  diaChi: string | null;
  vaiTro: string | null;
  trangThai: boolean;
}

export const getLoginByUsername = async (tenDangNhap: string): Promise<TaiKhoanRow | null> => {
  const pool = await connectToDatabase();

  const result = await pool
    .request()
    .input('tenDangNhap', sql.NVarChar(50), tenDangNhap)
    .execute('sp_DangNhap');

  return (result.recordset[0] as TaiKhoanRow | undefined) ?? null;
};

export const getAccountById = async (id: number): Promise<TaiKhoanRow | null> => {
  const pool = await connectToDatabase();

  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .execute('sp_TaiKhoan_LayTheoId');

  return (result.recordset[0] as TaiKhoanRow | undefined) ?? null;
};

export const createAccount = async (params: {
  tenDangNhap: string;
  matKhau: string;
  tenHienThi?: string;
  email?: string;
  sdt?: string;
  diaChi?: string;
}): Promise<TaiKhoanRow | null> => {
  const pool = await connectToDatabase();

  const result = await pool
    .request()
    .input('tenDangNhap', sql.NVarChar(50), params.tenDangNhap)
    .input('matKhau', sql.NVarChar(255), params.matKhau)
    .input('tenHienThi', sql.NVarChar(100), params.tenHienThi ?? null)
    .input('email', sql.NVarChar(100), params.email ?? null)
    .input('sdt', sql.NVarChar(15), params.sdt ?? null)
    .input('diaChi', sql.NVarChar(255), params.diaChi ?? null)
    .execute('sp_TaiKhoan_Them');

  return (result.recordset[0] as TaiKhoanRow | undefined) ?? null;
};

export const updatePasswordById = async (id: number, matKhauMoi: string): Promise<void> => {
  const pool = await connectToDatabase();

  await pool
    .request()
    .input('id', sql.Int, id)
    .input('matKhauMoi', sql.NVarChar(255), matKhauMoi)
    .execute('sp_TaiKhoan_DoiMatKhau');
};

export const softDeleteAccountById = async (id: number): Promise<number> => {
  const pool = await connectToDatabase();

  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .execute('sp_TaiKhoan_XoaMem');

  return result.rowsAffected[0] ?? 0;
};

export const getAllAccounts = async (): Promise<TaiKhoanRow[]> => {
  const pool = await connectToDatabase();

  const result = await pool.request().execute('sp_TaiKhoan_LayDanhSach');

  return result.recordset as TaiKhoanRow[];
};
