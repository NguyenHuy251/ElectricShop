import {
  createImportReceiptApi,
  deleteImportReceiptApi,
  getImportReceiptByIdApi,
  getImportReceiptsApi,
  getInventoryStockApi,
} from '../api/inventoryApi';

export const getInventoryStock = () => getInventoryStockApi();
export const getImportReceipts = () => getImportReceiptsApi();
export const getImportReceiptById = (id: number) => getImportReceiptByIdApi(id);
export const createImportReceipt = (payload: {
  idNhaCungCap: number;
  idNhanVienLap?: number | null;
  items: Array<{ idSanPham: number; soLuong: number; giaNhap: number }>;
}) => createImportReceiptApi(payload);
export const deleteImportReceipt = (id: number) => deleteImportReceiptApi(id);
