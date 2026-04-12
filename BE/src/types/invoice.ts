export interface InvoiceRow {
  idDonHang: number;
  maDonHang: string;
  maHoaDon: string;
  idTaiKhoan: number;
  tongTien: number;
  trangThai: string;
  diaChi: string | null;
  phuongThucThanhToan: string | null;
  ngayDatHang: Date;
  soDienThoai: string | null;
}

export interface InvoicePublic {
  orderId: number;
  orderCode: string;
  invoiceCode: string;
  userId: number;
  total: number;
  status: string;
  address: string;
  paymentMethod: string;
  createdAt: string;
  phone: string;
}
