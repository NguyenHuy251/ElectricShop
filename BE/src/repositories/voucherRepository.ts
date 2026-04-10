import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type { CreateVoucherRequestBody, UpdateVoucherRequestBody, VoucherRow } from '../types/voucher.js';

export const getVouchers = async (): Promise<VoucherRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_Voucher_LayDanhSach');
  return result.recordset as VoucherRow[];
};

export const getVoucherById = async (id: number): Promise<VoucherRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_Voucher_LayTheoId');
  return (result.recordset[0] as VoucherRow | undefined) ?? null;
};

export const createVoucher = async (payload: CreateVoucherRequestBody): Promise<VoucherRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('maVoucher', sql.NVarChar(50), payload.maVoucher)
    .input('loaiGiam', sql.NVarChar(50), payload.loaiGiam)
    .input('giaTri', sql.Float, payload.giaTri)
    .input('ngayBatDau', sql.DateTime, payload.ngayBatDau ? new Date(payload.ngayBatDau) : null)
    .input('ngayKetThuc', sql.DateTime, new Date(payload.ngayKetThuc))
    .input('soLuong', sql.Int, payload.soLuong)
    .execute('sp_Voucher_Them');

  return (result.recordset[0] as VoucherRow | undefined) ?? null;
};

export const updateVoucher = async (id: number, payload: UpdateVoucherRequestBody): Promise<VoucherRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('maVoucher', sql.NVarChar(50), payload.maVoucher ?? null)
    .input('loaiGiam', sql.NVarChar(50), payload.loaiGiam ?? null)
    .input('giaTri', sql.Float, payload.giaTri ?? null)
    .input('ngayBatDau', sql.DateTime, payload.ngayBatDau ? new Date(payload.ngayBatDau) : null)
    .input('ngayKetThuc', sql.DateTime, payload.ngayKetThuc ? new Date(payload.ngayKetThuc) : null)
    .input('soLuong', sql.Int, payload.soLuong ?? null)
    .execute('sp_Voucher_Sua');

  return (result.recordset[0] as VoucherRow | undefined) ?? null;
};

export const deleteVoucher = async (id: number): Promise<number> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_Voucher_Xoa');
  return result.rowsAffected[0] ?? 0;
};
