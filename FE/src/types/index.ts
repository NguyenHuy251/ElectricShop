export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  specs: Record<string, string>;
  isFeatured: boolean;
  isNew: boolean;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
  avatar: string;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderItem {
  idSanPham: number;
  tenSanPham: string;
  gia: number;
  soLuong: number;
  hinhAnh: string;
}

export interface Order {
  id: number;
  idTaiKhoan: number;
  chiTiet: OrderItem[];
  tongTien: number;
  trangThai: OrderStatus;
  diaChi: string;
  soDienThoai: string;
  ghiChu: string;
  ngayDatHang: string;
  ngayCapNhat: string;
  tenNguoiXacNhan?: string;
}

export interface Invoice {
  idDonHang: number;
  maDonHang: string;
  maHoaDon: string;
  idTaiKhoan: number;
  tongTien: number;
  trangThai: string;
  diaChi: string;
  phuongThucThanhToan: string;
  ngayDatHang: string;
  soDienThoai: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  phone: string;
  address: string;
  username?: string;
  isActive?: boolean;
  isEmployee?: boolean;
  employeeRole?: 'staff' | 'supervisor' | 'manager';
  vaiTro?: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
}

export interface Voucher {
  id: number;
  code: string;
  title: string;
  description: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number;
  expiredAt: string;
  isActive: boolean;
}

export interface Employee {
  id: number;
  idTaiKhoan: number;
  maNhanVien: string;
  hoTen: string;
  sdt: string;
  email: string;
  diaChi: string;
  chucVu: string;
  boPhan: string;
  ngayVaoLam: string;
  luongCoBan: number;
  trangThai: boolean;
  ngayTao: string;
  role?: 'staff' | 'supervisor' | 'manager';
}

export interface NewsArticle {
  id: number;
  tieuDe: string;
  slug: string;
  noiDung: string;
  hinhAnh: string;
  ngayDang: string;
  idNhanVienDang?: number;
  tenNhanVienDang?: string;
}

export interface Customer {
  id: number;
  idTaiKhoan: number;
  maKhachHang: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  ghiChu: string;
  trangThai: boolean;
  tenDangNhap: string;
  email: string;
  sdt: string;
  diaChi: string;
}

export interface ContactMessage {
  id: number;
  idTaiKhoan?: number;
  hoTen: string;
  email: string;
  sdt?: string;
  tieuDe: string;
  noiDung: string;
  trangThai: 'new' | 'contacted' | 'closed';
  ngayTao: string;
  phanHoi?: string;
  nguoiPhanHoi?: string;
  ngayPhanHoi?: string;
}

export type { ApiResponse } from './api';
export type {
  BackendAuthUser,
  ChangePasswordPayload,
  LoginResponse,
  RegisterPayload,
  UpdateAccountPayload,
} from './auth';
export type { BackendProduct, BackendProductImage } from './product';
export type {
  ContactStatus,
  CreateContactMessagePayload,
  GetContactsByAccountPayload,
  UpdateContactReplyPayload,
} from './contact';
export type { SellerReply } from './reviewReply';
