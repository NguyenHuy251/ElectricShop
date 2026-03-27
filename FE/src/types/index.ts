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
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  address: string;
  phone: string;
  note: string;
  createdAt: string;
  updatedAt: string;
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
  title: string;
  slug: string;
  content: string;
  image: string;
  publishedAt: string;
  idNhanVienDang?: number;
  tenNhanVienDang?: string;
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
