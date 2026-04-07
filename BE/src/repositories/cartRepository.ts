import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type { CartItemRow } from '../types/cart.js';
import type { ProductRow } from '../types/product.js';

export interface CartItemWithProductRow extends ProductRow {
  idTaiKhoan: number;
  soLuong: number;
}

const getCartQuery = `
  SELECT
    gh.idTaiKhoan,
    gh.idSanPham,
    gh.soLuong,
    sp.id,
    sp.maSanPham,
    sp.tenSanPham,
    sp.slug,
    sp.idDanhMuc,
    sp.idThuongHieu,
    sp.moTa,
    sp.giaBan,
    sp.giaGoc,
    sp.baoHanhThang,
    sp.hinhAnh,
    sp.soLuongBan,
    sp.danhGia,
    sp.trangThai,
    sp.ngayTao,
    dm.tenDanhMuc,
    th.tenThuongHieu
  FROM dbo.GioHang gh
  INNER JOIN dbo.SanPham sp ON sp.id = gh.idSanPham
  LEFT JOIN dbo.DanhMuc dm ON dm.id = sp.idDanhMuc
  LEFT JOIN dbo.ThuongHieu th ON th.id = sp.idThuongHieu
  WHERE gh.idTaiKhoan = @idTaiKhoan
  ORDER BY gh.id DESC;
`;

export const getCartByUserId = async (idTaiKhoan: number): Promise<CartItemWithProductRow[]> => {
  const pool = await connectToDatabase();
  const result = await pool.request().input('idTaiKhoan', sql.Int, idTaiKhoan).query(getCartQuery);
  return result.recordset as CartItemWithProductRow[];
};

export const getCartItemByUserAndProduct = async (
  idTaiKhoan: number,
  idSanPham: number,
): Promise<CartItemRow | null> => {
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('idTaiKhoan', sql.Int, idTaiKhoan)
    .input('idSanPham', sql.Int, idSanPham)
    .query(`
      SELECT TOP 1 idTaiKhoan, idSanPham, soLuong
      FROM dbo.GioHang
      WHERE idTaiKhoan = @idTaiKhoan AND idSanPham = @idSanPham
    `);

  return (result.recordset[0] as CartItemRow | undefined) ?? null;
};

export const upsertCartItem = async (
  idTaiKhoan: number,
  idSanPham: number,
  soLuong: number,
): Promise<void> => {
  const pool = await connectToDatabase();
  const existing = await getCartItemByUserAndProduct(idTaiKhoan, idSanPham);

  if (existing) {
    await pool
      .request()
      .input('idTaiKhoan', sql.Int, idTaiKhoan)
      .input('idSanPham', sql.Int, idSanPham)
      .input('soLuong', sql.Int, soLuong)
      .query(`
        UPDATE dbo.GioHang
        SET soLuong = soLuong + @soLuong
        WHERE idTaiKhoan = @idTaiKhoan AND idSanPham = @idSanPham;
      `);
    return;
  }

  await pool
    .request()
    .input('idTaiKhoan', sql.Int, idTaiKhoan)
    .input('idSanPham', sql.Int, idSanPham)
    .input('soLuong', sql.Int, soLuong)
    .query(`
      INSERT INTO dbo.GioHang (idTaiKhoan, idSanPham, soLuong)
      VALUES (@idTaiKhoan, @idSanPham, @soLuong);
    `);
};

export const setCartItemQuantity = async (
  idTaiKhoan: number,
  idSanPham: number,
  soLuong: number,
): Promise<void> => {
  const pool = await connectToDatabase();

  if (soLuong <= 0) {
    await pool
      .request()
      .input('idTaiKhoan', sql.Int, idTaiKhoan)
      .input('idSanPham', sql.Int, idSanPham)
      .query(`
        DELETE FROM dbo.GioHang
        WHERE idTaiKhoan = @idTaiKhoan AND idSanPham = @idSanPham;
      `);
    return;
  }

  await pool
    .request()
    .input('idTaiKhoan', sql.Int, idTaiKhoan)
    .input('idSanPham', sql.Int, idSanPham)
    .input('soLuong', sql.Int, soLuong)
    .query(`
      UPDATE dbo.GioHang
      SET soLuong = @soLuong
      WHERE idTaiKhoan = @idTaiKhoan AND idSanPham = @idSanPham;
    `);
};

export const removeCartItem = async (idTaiKhoan: number, idSanPham: number): Promise<void> => {
  const pool = await connectToDatabase();
  await pool
    .request()
    .input('idTaiKhoan', sql.Int, idTaiKhoan)
    .input('idSanPham', sql.Int, idSanPham)
    .query(`
      DELETE FROM dbo.GioHang
      WHERE idTaiKhoan = @idTaiKhoan AND idSanPham = @idSanPham;
    `);
};

export const clearCart = async (idTaiKhoan: number): Promise<void> => {
  const pool = await connectToDatabase();
  await pool.request().input('idTaiKhoan', sql.Int, idTaiKhoan).query(`
    DELETE FROM dbo.GioHang
    WHERE idTaiKhoan = @idTaiKhoan;
  `);
};
