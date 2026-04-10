import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type { CreateEmployeeRequestBody, EmployeeRow, UpdateEmployeeRequestBody } from '../types/employee.js';

export const getEmployees = async (): Promise<EmployeeRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_NhanVien_LayDanhSach');
  return result.recordset as EmployeeRow[];
};

export const getEmployeeById = async (id: number): Promise<EmployeeRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_NhanVien_LayTheoId');
  return (result.recordset[0] as EmployeeRow | undefined) ?? null;
};

export const getEmployeeByAccountId = async (idTaiKhoan: number): Promise<EmployeeRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('idTaiKhoan', sql.Int, idTaiKhoan)
    .query(`
      SELECT TOP 1
        id,
        idTaiKhoan,
        maNhanVien,
        hoTen,
        sdt,
        email,
        diaChi,
        chucVu,
        boPhan,
        ngayVaoLam,
        luongCoBan,
        trangThai
      FROM dbo.NhanVien
      WHERE idTaiKhoan = @idTaiKhoan
      ORDER BY id DESC
    `);

  return (result.recordset[0] as EmployeeRow | undefined) ?? null;
};

export const createEmployee = async (payload: CreateEmployeeRequestBody): Promise<EmployeeRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('idTaiKhoan', sql.Int, payload.idTaiKhoan ?? null)
    .input('maNhanVien', sql.NVarChar(50), payload.maNhanVien)
    .input('hoTen', sql.NVarChar(100), payload.hoTen)
    .input('sdt', sql.NVarChar(20), payload.sdt ?? null)
    .input('email', sql.NVarChar(100), payload.email ?? null)
    .input('diaChi', sql.NVarChar(255), payload.diaChi ?? null)
    .input('chucVu', sql.NVarChar(100), payload.chucVu ?? null)
    .input('boPhan', sql.NVarChar(100), payload.boPhan ?? null)
    .input('ngayVaoLam', sql.Date, payload.ngayVaoLam ? new Date(payload.ngayVaoLam) : null)
    .input('luongCoBan', sql.Float, payload.luongCoBan ?? null)
    .input('trangThai', sql.Bit, payload.trangThai ?? true)
    .execute('sp_NhanVien_Them');

  return (result.recordset[0] as EmployeeRow | undefined) ?? null;
};

export const updateEmployee = async (id: number, payload: UpdateEmployeeRequestBody): Promise<EmployeeRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('maNhanVien', sql.NVarChar(50), payload.maNhanVien ?? null)
    .input('hoTen', sql.NVarChar(100), payload.hoTen ?? null)
    .input('sdt', sql.NVarChar(20), payload.sdt ?? null)
    .input('email', sql.NVarChar(100), payload.email ?? null)
    .input('diaChi', sql.NVarChar(255), payload.diaChi ?? null)
    .input('chucVu', sql.NVarChar(100), payload.chucVu ?? null)
    .input('boPhan', sql.NVarChar(100), payload.boPhan ?? null)
    .input('ngayVaoLam', sql.Date, payload.ngayVaoLam ? new Date(payload.ngayVaoLam) : null)
    .input('luongCoBan', sql.Float, payload.luongCoBan ?? null)
    .input('trangThai', sql.Bit, payload.trangThai ?? null)
    .execute('sp_NhanVien_Sua');

  return (result.recordset[0] as EmployeeRow | undefined) ?? null;
};

export const deleteEmployee = async (id: number): Promise<number> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_NhanVien_Xoa');
  return result.rowsAffected[0] ?? 0;
};
