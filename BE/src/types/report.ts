export interface ReportSummaryRow {
  tongDonHang: number;
  tongDoanhThu: number;
  tongKhachHang: number;
  tongSanPhamBan: number;
}

export interface ReportSummaryPublic {
  tongDonHang: number;
  tongDoanhThu: number;
  tongKhachHang: number;
  tongSanPhamBan: number;
}

export interface ReportRevenueByDateRow {
  ngay: Date;
  doanhThu: number;
  soDonHang: number;
}

export interface ReportRevenueByDatePublic {
  ngay: Date;
  doanhThu: number;
  soDonHang: number;
}

export interface ReportTopProductRow {
  idSanPham: number;
  tenSanPham: string;
  soLuongBan: number;
  doanhThu: number;
}

export interface ReportTopProductPublic {
  idSanPham: number;
  tenSanPham: string;
  soLuongBan: number;
  doanhThu: number;
}
