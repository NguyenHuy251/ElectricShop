import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type {
  ReportRevenueByDateRow,
  ReportSummaryRow,
  ReportTopProductRow,
} from '../types/report.js';

const applyDateFilters = (
  request: sql.Request,
  fromDate?: string,
  toDate?: string,
): sql.Request => {
  if (fromDate) {
    request.input('fromDate', sql.DateTime, new Date(fromDate));
  }

  if (toDate) {
    request.input('toDate', sql.DateTime, new Date(toDate));
  }

  return request;
};

export const getReportSummary = async (fromDate?: string, toDate?: string): Promise<ReportSummaryRow> => {
  const pool = await connectToDatabase();
  const request = applyDateFilters(pool.request(), fromDate, toDate);
  const result = await request.execute('sp_BaoCao_TongQuan');
  return (result.recordset[0] as ReportSummaryRow | undefined) ?? {
    tongDonHang: 0,
    tongDoanhThu: 0,
    tongKhachHang: 0,
    tongSanPhamBan: 0,
  };
};

export const getRevenueByDate = async (fromDate?: string, toDate?: string): Promise<ReportRevenueByDateRow[]> => {
  const pool = await connectToDatabase();
  const request = applyDateFilters(pool.request(), fromDate, toDate);
  const result = await request.execute('sp_BaoCao_DoanhThuTheoNgay');
  return result.recordset as ReportRevenueByDateRow[];
};

export const getTopProducts = async (
  topN?: number,
  fromDate?: string,
  toDate?: string,
): Promise<ReportTopProductRow[]> => {
  const pool = await connectToDatabase();
  const request = applyDateFilters(pool.request(), fromDate, toDate);

  if (typeof topN === 'number' && Number.isFinite(topN)) {
    request.input('topN', sql.Int, topN);
  }

  const result = await request.execute('sp_BaoCao_SanPhamBanChay');
  return result.recordset as ReportTopProductRow[];
};
