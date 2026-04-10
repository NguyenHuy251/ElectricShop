import { getProductById } from '../repositories/productRepository.js';
import { createOrder, getOrders, updateOrderStatus } from '../repositories/orderRepository.js';
import { getEmployeeByAccountId } from '../repositories/employeeRepository.js';
import type {
  CreateOrderRequestBody,
  OrderPublic,
  OrderRow,
  OrderStatus,
} from '../types/order.js';

export class OrderError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'OrderError';
    this.statusCode = statusCode;
  }
}

const mapStatus = (status: string): OrderStatus => {
  const normalized = status.toLowerCase();
  if (normalized.includes('dangxuly') || normalized.includes('choxacnhan') || normalized === 'pending') {
    return 'pending';
  }
  if (normalized.includes('xacnhan') || normalized === 'confirmed') {
    return 'confirmed';
  }
  if (normalized.includes('danggiao') || normalized === 'shipping') {
    return 'shipping';
  }
  if (normalized.includes('hoanthanh') || normalized === 'delivered') {
    return 'delivered';
  }
  if (normalized.includes('huy') || normalized === 'cancelled' || normalized === 'canceled') {
    return 'cancelled';
  }
  return 'pending';
};

const mapStatusToDb = (status: OrderStatus): OrderStatus => {
  if (status === 'confirmed') return 'confirmed';
  if (status === 'shipping') return 'shipping';
  if (status === 'delivered') return 'delivered';
  if (status === 'cancelled') return 'cancelled';
  return 'pending';
};

const groupOrderRows = (rows: OrderRow[]): OrderPublic[] => {
  const grouped = new Map<number, OrderPublic>();

  for (const row of rows) {
    const existing = grouped.get(row.id);
    if (!existing) {
      grouped.set(row.id, {
        id: row.id,
        userId: row.idTaiKhoan,
        items: [],
        total: Number(row.tongTien ?? 0),
        status: mapStatus(row.trangThai),
        address: row.diaChi ?? '',
        phone: row.soDienThoai ?? '',
        note: '',
        createdAt: row.ngayDatHang.toISOString().slice(0, 10),
        updatedAt: row.ngayDatHang.toISOString().slice(0, 10),
        confirmedBy: row.tenNguoiXacNhan ?? '',
      });
    }

    const order = grouped.get(row.id);
    if (!order) {
      continue;
    }

    if (row.idSanPham && row.tenSanPham && row.gia !== null && row.soLuong !== null) {
      order.items.push({
        productId: row.idSanPham,
        productName: row.tenSanPham,
        price: Number(row.gia),
        quantity: Number(row.soLuong),
        image: row.hinhAnh ?? '',
      });
    }
  }

  return Array.from(grouped.values()).sort((a, b) => (a.id < b.id ? 1 : -1));
};

export const getOrdersService = async (idTaiKhoan?: number): Promise<OrderPublic[]> => {
  const rows = await getOrders(idTaiKhoan);
  return groupOrderRows(rows);
};

export const createOrderService = async (
  idTaiKhoan: number,
  payload: CreateOrderRequestBody,
): Promise<OrderPublic> => {
  if (!payload.items.length) {
    throw new OrderError('Don hang phai co it nhat 1 san pham', 400);
  }

  const itemsWithPrice: Array<{ productId: number; quantity: number; price: number }> = [];

  for (const item of payload.items) {
    if (!Number.isInteger(item.productId) || item.productId <= 0 || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new OrderError('Du lieu san pham khong hop le', 400);
    }

    const product = await getProductById(item.productId);
    if (!product) {
      throw new OrderError(`Khong tim thay san pham id ${item.productId}`, 404);
    }

    itemsWithPrice.push({
      productId: item.productId,
      quantity: item.quantity,
      price: Number(product.giaBan),
    });
  }

  const createdId = await createOrder(idTaiKhoan, {
    ...payload,
    items: itemsWithPrice,
  });

  const createdRows = await getOrders();
  const created = groupOrderRows(createdRows).find((order) => order.id === createdId);

  if (!created) {
    throw new OrderError('Khong the tai don hang vua tao', 500);
  }

  return created;
};

export const updateOrderStatusService = async (
  id: number,
  status: OrderStatus,
  idTaiKhoanThucHien?: number,
): Promise<void> => {
  let idNhanVienXuly: number | undefined;

  if (idTaiKhoanThucHien !== undefined) {
    const employee = await getEmployeeByAccountId(idTaiKhoanThucHien);
    if (!employee) {
      throw new OrderError('Tai khoan dang nhap chua duoc gan ho so nhan vien', 403);
    }

    idNhanVienXuly = employee.id;
  }

  await updateOrderStatus(id, mapStatusToDb(status), idNhanVienXuly);
};
