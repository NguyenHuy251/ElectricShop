import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type {
  CreateReviewRequestBody,
  ReviewRow,
  UpdateReviewRequestBody,
} from '../types/review.js';

export const getReviews = async (): Promise<ReviewRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_DanhGia_LayDanhSach');
  return result.recordset as ReviewRow[];
};

export const getReviewsByProduct = async (idSanPham: number): Promise<ReviewRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('idSanPham', sql.Int, idSanPham).execute('sp_DanhGia_LayTheoSanPham');
  return result.recordset as ReviewRow[];
};

export const createReview = async (
  idTaiKhoan: number,
  payload: CreateReviewRequestBody,
): Promise<ReviewRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('idSanPham', sql.Int, payload.idSanPham)
    .input('idTaiKhoan', sql.Int, idTaiKhoan)
    .input('soSao', sql.Int, payload.soSao)
    .input('noiDung', sql.NVarChar(sql.MAX), payload.noiDung ?? null)
    .execute('sp_DanhGia_Them');

  return (result.recordset[0] as ReviewRow | undefined) ?? null;
};

export const updateReview = async (
  id: number,
  idTaiKhoan: number,
  isAdmin: boolean,
  payload: UpdateReviewRequestBody,
): Promise<ReviewRow | null> => {
  const pool = await connectToDatabase();
  const request = pool
    .request()
    .input('id', sql.Int, id)
    .input('idTaiKhoan', sql.Int, idTaiKhoan)
    .input('isAdmin', sql.Bit, isAdmin);

  if (payload.soSao !== undefined) {
    request.input('soSao', sql.Int, payload.soSao);
  }

  if (payload.noiDung !== undefined) {
    request.input('noiDung', sql.NVarChar(sql.MAX), payload.noiDung);
  }

  const result = await request.execute('sp_DanhGia_Sua');
  return (result.recordset[0] as ReviewRow | undefined) ?? null;
};

export const deleteReview = async (
  id: number,
  idTaiKhoan: number,
  isAdmin: boolean,
): Promise<void> => {
  const pool = await connectToDatabase();
  await pool
    .request()
    .input('id', sql.Int, id)
    .input('idTaiKhoan', sql.Int, idTaiKhoan)
    .input('isAdmin', sql.Bit, isAdmin)
    .execute('sp_DanhGia_Xoa');
};
