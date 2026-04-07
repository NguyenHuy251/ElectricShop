import {
  getRevenueByDate,
  getReportSummary,
  getTopProducts,
} from '../repositories/reportRepository.js';
import type {
  ReportRevenueByDatePublic,
  ReportSummaryPublic,
  ReportTopProductPublic,
} from '../types/report.js';

export class ReportError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ReportError';
    this.statusCode = statusCode;
  }
}

export const getReportSummaryService = async (
  fromDate?: string,
  toDate?: string,
): Promise<ReportSummaryPublic> => {
  const summary = await getReportSummary(fromDate, toDate);
  return {
    tongDonHang: Number(summary.tongDonHang ?? 0),
    tongDoanhThu: Number(summary.tongDoanhThu ?? 0),
    tongKhachHang: Number(summary.tongKhachHang ?? 0),
    tongSanPhamBan: Number(summary.tongSanPhamBan ?? 0),
  };
};

export const getRevenueByDateService = async (
  fromDate?: string,
  toDate?: string,
): Promise<ReportRevenueByDatePublic[]> => {
  const rows = await getRevenueByDate(fromDate, toDate);
  return rows.map((row) => ({
    ngay: row.ngay,
    doanhThu: Number(row.doanhThu ?? 0),
    soDonHang: Number(row.soDonHang ?? 0),
  }));
};

export const getTopProductsService = async (
  topN?: number,
  fromDate?: string,
  toDate?: string,
): Promise<ReportTopProductPublic[]> => {
  const rows = await getTopProducts(topN, fromDate, toDate);
  return rows.map((row) => ({
    idSanPham: row.idSanPham,
    tenSanPham: row.tenSanPham,
    soLuongBan: Number(row.soLuongBan ?? 0),
    doanhThu: Number(row.doanhThu ?? 0),
  }));
};
