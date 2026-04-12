import { getInvoiceByOrderId, getInvoices } from '../repositories/invoiceRepository.js';
import type { InvoicePublic, InvoiceRow } from '../types/invoice.js';

export class InvoiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'InvoiceError';
    this.statusCode = statusCode;
  }
}

const mapInvoice = (row: InvoiceRow): InvoicePublic => ({
  orderId: row.idDonHang,
  orderCode: row.maDonHang,
  invoiceCode: row.maHoaDon,
  userId: row.idTaiKhoan,
  total: Number(row.tongTien ?? 0),
  status: row.trangThai,
  address: row.diaChi ?? '',
  paymentMethod: row.phuongThucThanhToan ?? '',
  createdAt: row.ngayDatHang.toISOString().slice(0, 10),
  phone: row.soDienThoai ?? '',
});

export const getInvoicesService = async (idTaiKhoan?: number): Promise<InvoicePublic[]> => {
  const rows = await getInvoices(idTaiKhoan);
  return rows.map(mapInvoice);
};

export const getInvoiceByOrderIdService = async (idDonHang: number): Promise<InvoicePublic> => {
  const row = await getInvoiceByOrderId(idDonHang);
  if (!row) throw new InvoiceError('Khong tim thay hoa don', 404);
  return mapInvoice(row);
};
