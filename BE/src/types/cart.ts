import type { ProductPublic } from './product.js';

export interface CartItemRow {
  idTaiKhoan: number;
  idSanPham: number;
  soLuong: number;
  id?: number;
  productId?: number;
}

export interface CartItemPublic {
  idSanPham: number;
  soLuong: number;
  product: ProductPublic;
}

export interface CartItemRequestBody {
  idSanPham: number;
  soLuong: number;
}
