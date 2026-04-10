import sql from 'mssql';
import { connectToDatabase } from '../config/database.js';
import type { CreateOrderRequestBody, OrderRow, OrderStatus } from '../types/order.js';

export const getOrders = async (idTaiKhoan?: number): Promise<OrderRow[]> => {
  const pool = await connectToDatabase();
  const request = pool.request();

  if (idTaiKhoan !== undefined) {
    request.input('idTaiKhoan', sql.Int, idTaiKhoan);
  }

  const result = await request.execute('sp_DonHang_LayDanhSach');
  return result.recordset as OrderRow[];
};

export const createOrder = async (
  idTaiKhoan: number,
  payload: CreateOrderRequestBody,
): Promise<number> => {
  const pool = await connectToDatabase();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const tongTien = payload.items.reduce((sum, item) => sum + item.quantity * Number(item.price ?? 0), 0);

    const createResult = await new sql.Request(transaction)
      .input('idTaiKhoan', sql.Int, idTaiKhoan)
      .input('diaChi', sql.NVarChar(sql.MAX), payload.address)
      .input('phuongThucThanhToan', sql.NVarChar(50), payload.paymentMethod || 'COD')
      .input('tongTien', sql.Float, tongTien)
      .input('trangThai', sql.NVarChar(50), 'pending')
      .execute('sp_DonHang_Them');

    const orderId = Number((createResult.recordset[0] as { id: number } | undefined)?.id ?? 0);

    if (!orderId) {
      throw new Error('Khong tao duoc don hang');
    }

    for (const item of payload.items) {
      await new sql.Request(transaction)
        .input('idDonHang', sql.Int, orderId)
        .input('idSanPham', sql.Int, item.productId)
        .input('gia', sql.Float, item.price)
        .input('soLuong', sql.Int, item.quantity)
        .execute('sp_DonHang_ThemChiTiet');
    }

    await transaction.commit();
    return orderId;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateOrderStatus = async (
  id: number,
  status: OrderStatus,
  idNhanVienXuly?: number,
): Promise<void> => {
  const pool = await connectToDatabase();
  await pool
    .request()
    .input('id', sql.Int, id)
    .input('trangThai', sql.NVarChar(50), status)
    .input('idNhanVienXuly', sql.Int, idNhanVienXuly ?? null)
    .execute('sp_DonHang_CapNhatTrangThai');
};
