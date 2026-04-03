import {
  addProductImageIfNotExists,
  createProduct,
  deleteProductImage,
  getProductById,
  getProductImages,
  getProductBySlug,
  getProducts,
  softDeleteProduct,
  updateProduct,
  updateProductStatus,
} from '../repositories/productRepository.js';
import type {
  CreateProductRequestBody,
  ProductImagePublic,
  ProductImageRow,
  ProductPublic,
  ProductRow,
  UpdateProductRequestBody,
} from '../types/product.js';

export class ProductError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ProductError';
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

const mapProductImage = (row: ProductImageRow): ProductImagePublic => {
  return {
    id: row.id,
    productId: row.idSanPham,
    imageUrl: row.hinhAnh,
  };
};

export const getProductsService = async (): Promise<ProductPublic[]> => {
  const rows = await getProducts();
  return rows.map(mapProduct);
};

export const getProductByIdService = async (id: number): Promise<ProductPublic> => {
  const row = await getProductById(id);
  if (!row) throw new ProductError('Không tìm thấy sản phẩm', 404);
  return mapProduct(row);
};

export const getProductBySlugService = async (slug: string): Promise<ProductPublic> => {
  const row = await getProductBySlug(slug);
  if (!row) throw new ProductError('Không tìm thấy sản phẩm', 404);
  return mapProduct(row);
};

export const createProductService = async (payload: CreateProductRequestBody): Promise<ProductPublic> => {
  const created = await createProduct(payload);
  if (!created) throw new ProductError('Không thể tạo sản phẩm', 500);

  if (payload.hinhAnh && payload.hinhAnh.trim()) {
    await addProductImageIfNotExists(created.id, payload.hinhAnh);
  }

  return mapProduct(created);
};

export const updateProductService = async (id: number, payload: UpdateProductRequestBody): Promise<ProductPublic> => {
  const existing = await getProductById(id);
  if (!existing) throw new ProductError('Không tìm thấy sản phẩm', 404);

  const updated = await updateProduct(id, payload);
  if (!updated) throw new ProductError('Không thể cập nhật sản phẩm', 500);

  if (payload.hinhAnh && payload.hinhAnh.trim()) {
    await addProductImageIfNotExists(id, payload.hinhAnh);
  }

  return mapProduct(updated);
};

export const softDeleteProductService = async (id: number): Promise<void> => {
  const affectedRows = await softDeleteProduct(id);
  if (affectedRows === 0) {
    throw new ProductError('Không tìm thấy sản phẩm hoạt động để xóa', 404);
  }
};

export const updateProductStatusService = async (id: number, trangThai: boolean): Promise<ProductPublic> => {
  const updated = await updateProductStatus(id, trangThai);
  if (!updated) throw new ProductError('Không thể cập nhật trạng thái sản phẩm', 404);
  return mapProduct(updated);
};

export const getProductImagesService = async (idSanPham: number): Promise<ProductImagePublic[]> => {
  const product = await getProductById(idSanPham);
  if (!product) throw new ProductError('Không tìm thấy sản phẩm', 404);

  const imageRows = await getProductImages(idSanPham);
  return imageRows.map(mapProductImage);
};

export const deleteProductImageService = async (idSanPham: number, imageId: number): Promise<void> => {
  const product = await getProductById(idSanPham);
  if (!product) throw new ProductError('Không tìm thấy sản phẩm', 404);

  const affectedRows = await deleteProductImage(idSanPham, imageId);
  if (affectedRows === 0) throw new ProductError('Không tìm thấy ảnh cần xóa', 404);
};
