export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderRow {
  id: number;
  maDonHang: string;
  idTaiKhoan: number;
  idNhanVienXuly: number | null;
  tongTien: number;
  trangThai: string;
  diaChi: string | null;
  phuongThucThanhToan: string | null;
  ngayDatHang: Date;
  soDienThoai: string | null;
  tenNguoiXacNhan: string | null;
  idSanPham: number | null;
  tenSanPham: string | null;
  hinhAnh: string | null;
  gia: number | null;
  soLuong: number | null;
}

export interface OrderItemPublic {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderPublic {
  id: number;
  userId: number;
  items: OrderItemPublic[];
  total: number;
  status: OrderStatus;
  address: string;
  phone: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  confirmedBy: string;
}

export interface CreateOrderRequestBody {
  items: Array<{
    productId: number;
    quantity: number;
    price?: number;
  }>;
  address: string;
  phone?: string;
  note?: string;
  paymentMethod?: string;
}

export interface UpdateOrderStatusRequestBody {
  status: OrderStatus;
}
