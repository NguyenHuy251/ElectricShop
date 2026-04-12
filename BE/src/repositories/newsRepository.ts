import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type { CreateNewsRequestBody, NewsRow, UpdateNewsRequestBody } from '../types/news.js';

export const getNews = async (): Promise<NewsRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_TinTuc_LayDanhSach');
  return result.recordset as NewsRow[];
};

export const getNewsBySlug = async (slug: string): Promise<NewsRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('slug', sql.NVarChar(300), slug).execute('sp_TinTuc_LayTheoSlug');
  return (result.recordset[0] as NewsRow | undefined) ?? null;
};

export const createNews = async (payload: CreateNewsRequestBody): Promise<NewsRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('idNhanVienDang', sql.Int, payload.idNhanVienDang ?? null)
    .input('tieuDe', sql.NVarChar(300), payload.title)
    .input('slug', sql.NVarChar(300), payload.slug)
    .input('noiDung', sql.NVarChar(sql.MAX), payload.content)
    .input('hinhAnh', sql.NVarChar(255), payload.image ?? null)
    .input('ngayDang', sql.DateTime, payload.publishedAt ? new Date(payload.publishedAt) : null)
    .execute('sp_TinTuc_Them');

  return (result.recordset[0] as NewsRow | undefined) ?? null;
};

export const updateNews = async (id: number, payload: UpdateNewsRequestBody): Promise<NewsRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('idNhanVienDang', sql.Int, payload.idNhanVienDang ?? null)
    .input('tieuDe', sql.NVarChar(300), payload.title ?? null)
    .input('slug', sql.NVarChar(300), payload.slug ?? null)
    .input('noiDung', sql.NVarChar(sql.MAX), payload.content ?? null)
    .input('hinhAnh', sql.NVarChar(255), payload.image ?? null)
    .input('ngayDang', sql.DateTime, payload.publishedAt ? new Date(payload.publishedAt) : null)
    .execute('sp_TinTuc_Sua');

  return (result.recordset[0] as NewsRow | undefined) ?? null;
};

export const deleteNews = async (id: number): Promise<number> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_TinTuc_Xoa');
  return result.rowsAffected[0] ?? 0;
};
