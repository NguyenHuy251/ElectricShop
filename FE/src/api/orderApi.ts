import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';
import type { Order, OrderStatus } from '../types';

export interface CreateOrderPayload {
  items: Array<{
    idSanPham: number;
    soLuong: number;
  }>;
  diaChi: string;
  soDienThoai?: string;
  ghiChu?: string;
  phuongThucThanhToan?: string;
}

interface LegacyOrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

interface LegacyOrder {
  id: number;
  userId: number;
  items: LegacyOrderItem[];
  total: number;
  status: OrderStatus;
  address: string;
  phone: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  confirmedBy?: string;
}

const mapOrder = (order: LegacyOrder): Order => ({
  id: order.id,
  idTaiKhoan: order.userId,
  chiTiet: order.items.map((item) => ({
    idSanPham: item.productId,
    tenSanPham: item.productName,
    gia: item.price,
    soLuong: item.quantity,
    hinhAnh: item.image,
  })),
  tongTien: order.total,
  trangThai: order.status,
  diaChi: order.address,
  soDienThoai: order.phone,
  ghiChu: order.note,
  ngayDatHang: order.createdAt,
  ngayCapNhat: order.updatedAt,
  tenNguoiXacNhan: order.confirmedBy,
});

export const getOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
  const response = await httpClient.get<ApiResponse<LegacyOrder[]>>('/api/orders');
  return {
    ...response.data,
    data: response.data.data.map(mapOrder),
  };
};

export const getMyOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
  const response = await httpClient.get<ApiResponse<LegacyOrder[]>>('/api/orders/my');
  return {
    ...response.data,
    data: response.data.data.map(mapOrder),
  };
};

export const createOrderApi = async (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
  const response = await httpClient.post<ApiResponse<LegacyOrder>>('/api/orders', {
    items: payload.items.map((item) => ({
      productId: item.idSanPham,
      quantity: item.soLuong,
    })),
    address: payload.diaChi,
    phone: payload.soDienThoai,
    note: payload.ghiChu,
    paymentMethod: payload.phuongThucThanhToan,
  });

  return {
    ...response.data,
    data: mapOrder(response.data.data),
  };
};

export const updateOrderStatusApi = async (id: number, trangThai: OrderStatus): Promise<{ message: string }> => {
  const response = await httpClient.patch<{ message: string }>(`/api/orders/${id}/status`, { status: trangThai });
  return response.data;
};
