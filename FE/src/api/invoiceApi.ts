import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';
import type { Invoice } from '../types';

interface LegacyInvoice {
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

const mapInvoice = (invoice: LegacyInvoice): Invoice => ({
  idDonHang: invoice.orderId,
  maDonHang: invoice.orderCode,
  maHoaDon: invoice.invoiceCode,
  idTaiKhoan: invoice.userId,
  tongTien: invoice.total,
  trangThai: invoice.status,
  diaChi: invoice.address,
  phuongThucThanhToan: invoice.paymentMethod,
  ngayDatHang: invoice.createdAt,
  soDienThoai: invoice.phone,
});

export const getInvoicesApi = async (): Promise<ApiResponse<Invoice[]>> => {
  const response = await httpClient.get<ApiResponse<LegacyInvoice[]>>('/api/invoices');
  return {
    ...response.data,
    data: response.data.data.map(mapInvoice),
  };
};

export const getInvoiceByOrderApi = async (orderId: number): Promise<ApiResponse<Invoice>> => {
  const response = await httpClient.get<ApiResponse<LegacyInvoice>>(`/api/invoices/order/${orderId}`);
  return {
    ...response.data,
    data: mapInvoice(response.data.data),
  };
};
