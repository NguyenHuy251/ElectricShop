import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type {
  CreateImportReceiptRequestBody,
  ImportReceiptDetailRow,
  ImportReceiptRow,
  InventoryStockRow,
} from '../types/inventory.js';

export const getInventoryStock = async (): Promise<InventoryStockRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_TonKho_LayDanhSach');
  return result.recordset as InventoryStockRow[];
};

export const getImportReceipts = async (): Promise<ImportReceiptRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_PhieuNhap_LayDanhSach');
  return result.recordset as ImportReceiptRow[];
};

export const getImportReceiptById = async (
  id: number,
): Promise<{ receipt: ImportReceiptRow | null; items: ImportReceiptDetailRow[] }> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_PhieuNhap_LayTheoId');

  const recordsets = result.recordsets as unknown as Array<unknown[]>;
  const receipt = ((recordsets[0] ?? [])[0] as ImportReceiptRow | undefined) ?? null;
  const items = (recordsets[1] as ImportReceiptDetailRow[] | undefined) ?? [];

  return { receipt, items };
};

export const createImportReceipt = async (
  payload: CreateImportReceiptRequestBody,
): Promise<{ receipt: ImportReceiptRow | null; items: ImportReceiptDetailRow[] }> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('idNhaCungCap', sql.Int, payload.idNhaCungCap)
    .input('idNhanVienLap', sql.Int, payload.idNhanVienLap ?? null)
    .input('itemsJson', sql.NVarChar(sql.MAX), JSON.stringify(payload.items))
    .execute('sp_PhieuNhap_Them');

  const recordsets = result.recordsets as unknown as Array<unknown[]>;
  const receipt = ((recordsets[0] ?? [])[0] as ImportReceiptRow | undefined) ?? null;
  const items = (recordsets[1] as ImportReceiptDetailRow[] | undefined) ?? [];

  return { receipt, items };
};

export const deleteImportReceipt = async (id: number): Promise<void> => {
  const pool = await connectToDatabase();
  await pool.request().input('id', sql.Int, id).execute('sp_PhieuNhap_Xoa');
};
