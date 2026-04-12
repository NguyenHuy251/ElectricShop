import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type { InvoiceRow } from '../types/invoice.js';

export const getInvoices = async (idTaiKhoan?: number): Promise<InvoiceRow[]> => {
  const pool = await connectToDatabase();
  const request = pool.request();

  if (idTaiKhoan !== undefined) {
    request.input('idTaiKhoan', sql.Int, idTaiKhoan);
  }

  const result = await request.execute('sp_HoaDon_LayDanhSach');
  return result.recordset as InvoiceRow[];
};

export const getInvoiceByOrderId = async (idDonHang: number): Promise<InvoiceRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('idDonHang', sql.Int, idDonHang).execute('sp_HoaDon_LayTheoDonHang');
  return (result.recordset[0] as InvoiceRow | undefined) ?? null;
};
