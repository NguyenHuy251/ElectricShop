import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';

export interface BackendReportSummary {
  tongDonHang: number;
  tongDoanhThu: number;
  tongKhachHang: number;
  tongSanPhamBan: number;
}

export interface BackendRevenueByDate {
  ngay: string;
  doanhThu: number;
  soDonHang: number;
}

export interface BackendTopProduct {
  idSanPham: number;
  tenSanPham: string;
  soLuongBan: number;
  doanhThu: number;
}

export const getReportSummaryApi = async (params?: {
  fromDate?: string;
  toDate?: string;
}): Promise<ApiResponse<BackendReportSummary>> => {
  const response = await httpClient.get<ApiResponse<BackendReportSummary>>('/api/reports/summary', { params });
  return response.data;
};

export const getRevenueByDateApi = async (params?: {
  fromDate?: string;
  toDate?: string;
}): Promise<ApiResponse<BackendRevenueByDate[]>> => {
  const response = await httpClient.get<ApiResponse<BackendRevenueByDate[]>>('/api/reports/revenue-by-date', { params });
  return response.data;
};

export const getTopProductsApi = async (params?: {
  topN?: number;
  fromDate?: string;
  toDate?: string;
}): Promise<ApiResponse<BackendTopProduct[]>> => {
  const response = await httpClient.get<ApiResponse<BackendTopProduct[]>>('/api/reports/top-products', { params });
  return response.data;
};
