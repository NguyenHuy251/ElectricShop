import { getProductById } from '../repositories/productRepository.js';
import {
  clearCart,
  getCartByUserId,
  removeCartItem,
  setCartItemQuantity,
  upsertCartItem,
} from '../repositories/cartRepository.js';
import type { CartItemPublic } from '../types/cart.js';
import type { ProductPublic, ProductRow } from '../types/product.js';

export class CartError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'CartError';
    this.statusCode = statusCode;
  }
}

const mapProduct = (row: ProductRow): ProductPublic => {
  const product: ProductPublic = {
    id: row.id,
    maSanPham: row.maSanPham,
    tenSanPham: row.tenSanPham,
    slug: row.slug,
    idDanhMuc: row.idDanhMuc,
    idThuongHieu: row.idThuongHieu,
    moTa: row.moTa,
    giaBan: row.giaBan,
    giaGoc: row.giaGoc,
    baoHanhThang: row.baoHanhThang,
    hinhAnh: row.hinhAnh,
    soLuongBan: row.soLuongBan,
    danhGia: row.danhGia,
    trangThai: row.trangThai,
    ngayTao: row.ngayTao,
  };

  if (row.tenDanhMuc !== undefined) {
    product.tenDanhMuc = row.tenDanhMuc;
  }

  if (row.tenThuongHieu !== undefined) {
    product.tenThuongHieu = row.tenThuongHieu;
  }

  return product;
};

const mapCartItem = (row: Awaited<ReturnType<typeof getCartByUserId>>[number]): CartItemPublic => ({
  idSanPham: row.idSanPham,
  soLuong: row.soLuong,
  product: mapProduct(row),
});

const validateQuantity = (soLuong: number): void => {
  if (!Number.isInteger(soLuong) || soLuong <= 0) {
    throw new CartError('soLuong phai lon hon 0', 400);
  }
};

const ensureProductExists = async (idSanPham: number): Promise<void> => {
  const product = await getProductById(idSanPham);
  if (!product) {
    throw new CartError('Khong tim thay san pham hoac san pham da ngung kinh doanh', 404);
  }
};

export const getCartService = async (idTaiKhoan: number): Promise<CartItemPublic[]> => {
  const rows = await getCartByUserId(idTaiKhoan);
  return rows.map(mapCartItem);
};

export const addCartItemService = async (
  idTaiKhoan: number,
  idSanPham: number,
  soLuong: number,
): Promise<CartItemPublic[]> => {
  validateQuantity(soLuong);
  await ensureProductExists(idSanPham);
  await upsertCartItem(idTaiKhoan, idSanPham, soLuong);
  return getCartService(idTaiKhoan);
};

export const updateCartItemQuantityService = async (
  idTaiKhoan: number,
  idSanPham: number,
  soLuong: number,
): Promise<CartItemPublic[]> => {
  if (!Number.isInteger(soLuong)) {
    throw new CartError('soLuong khong hop le', 400);
  }

  await ensureProductExists(idSanPham);
  await setCartItemQuantity(idTaiKhoan, idSanPham, soLuong);
  return getCartService(idTaiKhoan);
};

export const removeCartItemService = async (idTaiKhoan: number, idSanPham: number): Promise<CartItemPublic[]> => {
  await removeCartItem(idTaiKhoan, idSanPham);
  return getCartService(idTaiKhoan);
};

export const clearCartService = async (idTaiKhoan: number): Promise<void> => {
  await clearCart(idTaiKhoan);
};
