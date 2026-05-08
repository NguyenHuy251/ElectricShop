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
  ngayTao?: Date;
  isEmployee?: boolean;
  ngaySinh?: Date | null;
  gioiTinh?: string | null;
  ngayVaoLam?: Date | null;
  boPhan?: string | null;
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

export const getCurrentAccountById = async (idTaiKhoan: number): Promise<TaiKhoanRow | null> => {
  const pool = await connectToDatabase();

  const result = await pool
    .request()
    .input('idTaiKhoan', sql.Int, idTaiKhoan)
    .execute('sp_Auth_Me');

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

  // sp_TaiKhoan_XoaMem uses SET NOCOUNT ON, so rowsAffected is unreliable.
  const existing = await pool
    .request()
    .input('id', sql.Int, id)
    .query('SELECT TOP 1 id FROM dbo.TaiKhoan WHERE id = @id AND trangThai = 1');

  if (!existing.recordset[0]) {
    return 0;
  }

  await pool.request().input('id', sql.Int, id).execute('sp_TaiKhoan_XoaMem');
  return 1;
};

export const updateAccount = async (params: {
  id: number;
  tenHienThi?: string;
  email?: string;
  sdt?: string;
  diaChi?: string;
  vaiTro?: string;
  ngaySinh?: string | null;
  gioiTinh?: string;
  ngayVaoLam?: string | null;
  boPhan?: string;
}): Promise<TaiKhoanRow | null> => {
  const pool = await connectToDatabase();

  const ngaySinhValue = params.ngaySinh ? new Date(params.ngaySinh) : null;
  const ngayVaoLamValue = params.ngayVaoLam ? new Date(params.ngayVaoLam) : null;

  const result = await pool
    .request()
    .input('id', sql.Int, params.id)
    .input('tenHienThi', sql.NVarChar(100), params.tenHienThi ?? null)
    .input('email', sql.NVarChar(100), params.email ?? null)
    .input('sdt', sql.NVarChar(15), params.sdt ?? null)
    .input('diaChi', sql.NVarChar(255), params.diaChi ?? null)
    .input('vaiTro', sql.NVarChar(20), params.vaiTro ?? null)
    .input('ngaySinh', sql.Date, ngaySinhValue)
    .input('gioiTinh', sql.NVarChar(10), params.gioiTinh ?? null)
    .input('ngayVaoLam', sql.Date, ngayVaoLamValue)
    .input('boPhan', sql.NVarChar(100), params.boPhan ?? null)
    .execute('sp_TaiKhoan_Sua');

  return (result.recordset[0] as TaiKhoanRow | undefined) ?? null;
};

export const getAllAccounts = async (): Promise<TaiKhoanRow[]> => {
  const pool = await connectToDatabase();

  const result = await pool.request().execute('sp_TaiKhoan_LayDanhSach');

  return result.recordset as TaiKhoanRow[];
};
