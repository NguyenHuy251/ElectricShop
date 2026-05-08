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

export const createBaoCaoDoanhThu = async (payload: {
  tuNgay: string;
  denNgay: string;
  tongSoHoaDonBan: number;
  tongSoHoaDonNhap: number;
  tongDoanhThuBan: number;
  tongChiPhiNhap: number;
  tongDoanhThu: number;
  idNhanVien?: number | null;
}): Promise<number> => {
  const pool = await connectToDatabase();
  const request = pool.request();
  request.input('tuNgay', sql.Date, new Date(payload.tuNgay));
  request.input('denNgay', sql.Date, new Date(payload.denNgay));
  request.input('tongSoHoaDonBan', sql.Int, payload.tongSoHoaDonBan);
  request.input('tongSoHoaDonNhap', sql.Int, payload.tongSoHoaDonNhap);
  request.input('tongDoanhThuBan', sql.Decimal(18, 2), payload.tongDoanhThuBan);
  request.input('tongChiPhiNhap', sql.Decimal(18, 2), payload.tongChiPhiNhap);
  request.input('tongDoanhThu', sql.Decimal(18, 2), payload.tongDoanhThu);
  request.input('idNhanVien', sql.Int, payload.idNhanVien ?? null);

  const insertQuery = `
    INSERT INTO dbo.BaoCaoDoanhThu (tuNgay, denNgay, tongSoHoaDonBan, tongSoHoaDonNhap, tongDoanhThuBan, tongChiPhiNhap, tongDoanhThu, idNhanVien)
    VALUES (@tuNgay, @denNgay, @tongSoHoaDonBan, @tongSoHoaDonNhap, @tongDoanhThuBan, @tongChiPhiNhap, @tongDoanhThu, @idNhanVien);
    SELECT SCOPE_IDENTITY() AS id;`;

  const result = await request.query(insertQuery);
  const insertedId = result.recordset?.[0]?.id;
  return Number(insertedId ?? 0);
};

export const getBaoCaoDoanhThuList = async (topN = 50): Promise<any[]> => {
  const pool = await connectToDatabase();
  const request = pool.request();
  request.input('topN', sql.Int, topN);
  const result = await request.query(`
    SELECT TOP (@topN)
      bcdt.id,
      bcdt.tuNgay,
      bcdt.denNgay,
      bcdt.tongSoHoaDonBan,
      bcdt.tongSoHoaDonNhap,
      bcdt.tongDoanhThuBan,
      bcdt.tongChiPhiNhap,
      bcdt.tongDoanhThu,
      bcdt.idNhanVien,
      nv.hoTen AS tenNhanVien,
      bcdt.ngayTao
    FROM dbo.BaoCaoDoanhThu bcdt
    LEFT JOIN dbo.NhanVien nv ON nv.id = bcdt.idNhanVien
    ORDER BY bcdt.ngayTao DESC;
  `);
  return result.recordset as any[];
};
