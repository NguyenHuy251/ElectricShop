import {
  createImportReceipt,
  deleteImportReceipt,
  getImportReceiptById,
  getImportReceipts,
  getInventoryStock,
} from '../repositories/inventoryRepository.js';
import type {
  CreateImportReceiptRequestBody,
  ImportReceiptDetailPublic,
  ImportReceiptDetailRow,
  ImportReceiptPublic,
  ImportReceiptRow,
  InventoryStockPublic,
  InventoryStockRow,
} from '../types/inventory.js';

export class InventoryError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'InventoryError';
    this.statusCode = statusCode;
  }
}

const mapStock = (row: InventoryStockRow): InventoryStockPublic => ({
  idSanPham: row.idSanPham,
  tenSanPham: row.tenSanPham,
  slug: row.slug,
  soLuongTon: row.soLuongTon,
});

const mapReceipt = (row: ImportReceiptRow): ImportReceiptPublic => ({
  id: row.id,
  idNhaCungCap: row.idNhaCungCap,
  idNhanVienLap: row.idNhanVienLap,
  tongTien: row.tongTien,
  ngayNhap: row.ngayNhap,
  tenNhaCungCap: row.tenNhaCungCap,
  tenNhanVienLap: row.tenNhanVienLap,
});

const mapReceiptItem = (row: ImportReceiptDetailRow): ImportReceiptDetailPublic => ({
  id: row.id,
  idPhieuNhap: row.idPhieuNhap,
  idSanPham: row.idSanPham,
  soLuong: row.soLuong,
  giaNhap: row.giaNhap,
  tenSanPham: row.tenSanPham,
});

export const getInventoryStockService = async (): Promise<InventoryStockPublic[]> => {
  const rows = await getInventoryStock();
  return rows.map(mapStock);
};

export const getImportReceiptsService = async (): Promise<ImportReceiptPublic[]> => {
  const rows = await getImportReceipts();
  return rows.map(mapReceipt);
};

export const getImportReceiptByIdService = async (
  id: number,
): Promise<{ receipt: ImportReceiptPublic; items: ImportReceiptDetailPublic[] }> => {
  const result = await getImportReceiptById(id);
  if (!result.receipt) throw new InventoryError('Khong tim thay phieu nhap', 404);

  return {
    receipt: mapReceipt(result.receipt),
    items: result.items.map(mapReceiptItem),
  };
};

export const createImportReceiptService = async (
  payload: CreateImportReceiptRequestBody,
): Promise<{ receipt: ImportReceiptPublic; items: ImportReceiptDetailPublic[] }> => {
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new InventoryError('Phieu nhap phai co it nhat mot san pham', 400);
  }

  const created = await createImportReceipt(payload);
  if (!created.receipt) throw new InventoryError('Khong the tao phieu nhap', 500);

  return {
    receipt: mapReceipt(created.receipt),
    items: created.items.map(mapReceiptItem),
  };
};

export const deleteImportReceiptService = async (id: number): Promise<void> => {
  await deleteImportReceipt(id);
};
