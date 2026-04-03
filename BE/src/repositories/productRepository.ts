import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type {
  CreateProductRequestBody,
  ProductImageRow,
  ProductRow,
  UpdateProductRequestBody,
} from '../types/product.js';

export const getProducts = async (): Promise<ProductRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().execute('sp_SanPham_LayDanhSach');
  return result.recordset as ProductRow[];
};

export const getProductById = async (id: number): Promise<ProductRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_SanPham_LayTheoId');
  return (result.recordset[0] as ProductRow | undefined) ?? null;
};

export const getProductBySlug = async (slug: string): Promise<ProductRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('slug', sql.NVarChar(200), slug).execute('sp_SanPham_LayTheoSlug');
  return (result.recordset[0] as ProductRow | undefined) ?? null;
};

export const createProduct = async (payload: CreateProductRequestBody): Promise<ProductRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('maSanPham', sql.NVarChar(50), payload.maSanPham ?? null)
    .input('tenSanPham', sql.NVarChar(200), payload.tenSanPham)
    .input('slug', sql.NVarChar(200), payload.slug)
    .input('idDanhMuc', sql.Int, payload.idDanhMuc ?? null)
    .input('idThuongHieu', sql.Int, payload.idThuongHieu ?? null)
    .input('moTa', sql.NVarChar(sql.MAX), payload.moTa ?? null)
    .input('giaBan', sql.Float, payload.giaBan)
    .input('giaGoc', sql.Float, payload.giaGoc ?? null)
    .input('baoHanhThang', sql.Int, payload.baoHanhThang ?? null)
    .input('hinhAnh', sql.NVarChar(sql.MAX), payload.hinhAnh ?? null)
    .input('soLuongBan', sql.Int, payload.soLuongBan ?? 0)
    .input('danhGia', sql.Float, payload.danhGia ?? 0)
    .input('trangThai', sql.Bit, payload.trangThai ?? true)
    .execute('sp_SanPham_Them');

  return (result.recordset[0] as ProductRow | undefined) ?? null;
};

export const updateProduct = async (id: number, payload: UpdateProductRequestBody): Promise<ProductRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('maSanPham', sql.NVarChar(50), payload.maSanPham ?? null)
    .input('tenSanPham', sql.NVarChar(200), payload.tenSanPham ?? null)
    .input('slug', sql.NVarChar(200), payload.slug ?? null)
    .input('idDanhMuc', sql.Int, payload.idDanhMuc ?? null)
    .input('idThuongHieu', sql.Int, payload.idThuongHieu ?? null)
    .input('moTa', sql.NVarChar(sql.MAX), payload.moTa ?? null)
    .input('giaBan', sql.Float, payload.giaBan ?? null)
    .input('giaGoc', sql.Float, payload.giaGoc ?? null)
    .input('baoHanhThang', sql.Int, payload.baoHanhThang ?? null)
    .input('hinhAnh', sql.NVarChar(sql.MAX), payload.hinhAnh ?? null)
    .input('soLuongBan', sql.Int, payload.soLuongBan ?? null)
    .input('danhGia', sql.Float, payload.danhGia ?? null)
    .execute('sp_SanPham_Sua');

  return (result.recordset[0] as ProductRow | undefined) ?? null;
};

export const softDeleteProduct = async (id: number): Promise<number> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('id', sql.Int, id).execute('sp_SanPham_XoaMem');
  return result.rowsAffected[0] ?? 0;
};

export const updateProductStatus = async (id: number, trangThai: boolean): Promise<ProductRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('trangThai', sql.Bit, trangThai)
    .execute('sp_SanPham_CapNhatTrangThai');

  return (result.recordset[0] as ProductRow | undefined) ?? null;
};

export const getProductImages = async (idSanPham: number): Promise<ProductImageRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('idSanPham', sql.Int, idSanPham)
    .query(`
      SELECT id, idSanPham, hinhAnh
      FROM dbo.AnhSanPham
      WHERE idSanPham = @idSanPham
        AND hinhAnh IS NOT NULL
        AND LTRIM(RTRIM(hinhAnh)) <> ''
      ORDER BY id DESC
    `);

  return result.recordset as ProductImageRow[];
};

export const addProductImageIfNotExists = async (idSanPham: number, hinhAnh: string): Promise<void> => {
  const image = hinhAnh.trim();
  if (!image) {
    return;
  }

  const pool = await connectToDatabase();
  await pool
    .request()
    .input('idSanPham', sql.Int, idSanPham)
    .input('hinhAnh', sql.NVarChar(sql.MAX), image)
    .query(`
      IF NOT EXISTS (
        SELECT 1
        FROM dbo.AnhSanPham
        WHERE idSanPham = @idSanPham
          AND hinhAnh = @hinhAnh
      )
      BEGIN
        INSERT INTO dbo.AnhSanPham (idSanPham, hinhAnh)
        VALUES (@idSanPham, @hinhAnh)
      END
    `);
};

export const deleteProductImage = async (idSanPham: number, imageId: number): Promise<number> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('idSanPham', sql.Int, idSanPham)
    .input('imageId', sql.Int, imageId)
    .query(`
      DELETE FROM dbo.AnhSanPham
      WHERE id = @imageId
        AND idSanPham = @idSanPham
    `);

  return result.rowsAffected[0] ?? 0;
};
