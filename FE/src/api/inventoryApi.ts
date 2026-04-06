import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';

export interface BackendInventoryStockItem {
  idSanPham: number;
  tenSanPham: string;
  slug: string;
  soLuongTon: number;
}

export interface BackendImportReceipt {
  id: number;
  idNhaCungCap: number;
  idNhanVienLap: number | null;
  tongTien: number;
  ngayNhap: string;
  tenNhaCungCap: string;
  tenNhanVienLap: string | null;
}

export interface BackendImportReceiptItem {
  id: number;
  idPhieuNhap: number;
  idSanPham: number;
  soLuong: number;
  giaNhap: number;
  tenSanPham: string;
}

export interface CreateImportReceiptPayload {
  idNhaCungCap: number;
  idNhanVienLap?: number | null;
  items: Array<{
    idSanPham: number;
    soLuong: number;
    giaNhap: number;
  }>;
}

export const getInventoryStockApi = async (): Promise<ApiResponse<BackendInventoryStockItem[]>> => {
  const response = await httpClient.get<ApiResponse<BackendInventoryStockItem[]>>('/api/inventory/stock');
  return response.data;
};

export const getImportReceiptsApi = async (): Promise<ApiResponse<BackendImportReceipt[]>> => {
  const response = await httpClient.get<ApiResponse<BackendImportReceipt[]>>('/api/inventory/import-receipts');
  return response.data;
};

export const getImportReceiptByIdApi = async (
  id: number,
): Promise<ApiResponse<{ receipt: BackendImportReceipt; items: BackendImportReceiptItem[] }>> => {
  const response = await httpClient.get<ApiResponse<{ receipt: BackendImportReceipt; items: BackendImportReceiptItem[] }>>(
    `/api/inventory/import-receipts/${id}`,
  );
  return response.data;
};

export const createImportReceiptApi = async (
  payload: CreateImportReceiptPayload,
): Promise<ApiResponse<{ receipt: BackendImportReceipt; items: BackendImportReceiptItem[] }>> => {
  const response = await httpClient.post<ApiResponse<{ receipt: BackendImportReceipt; items: BackendImportReceiptItem[] }>>(
    '/api/inventory/import-receipts',
    payload,
  );
  return response.data;
};

export const deleteImportReceiptApi = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/inventory/import-receipts/${id}`);
  return response.data;
};
