import {
  createVoucher,
  deleteVoucher,
  getVoucherById,
  getVouchers,
  updateVoucher,
} from '../repositories/voucherRepository.js';
import type {
  CreateVoucherRequestBody,
  UpdateVoucherRequestBody,
  VoucherPublic,
  VoucherRow,
} from '../types/voucher.js';

export class VoucherError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'VoucherError';
    this.statusCode = statusCode;
  }
}

const mapDiscountType = (loaiGiam: string): 'percent' | 'amount' => {
  const normalized = loaiGiam.toLowerCase();
  if (normalized.includes('phantram')) {
    return 'percent';
  }
  return 'amount';
};

const mapVoucher = (row: VoucherRow): VoucherPublic => {
  const discountType = mapDiscountType(row.loaiGiam);
  const expiredAt = row.ngayKetThuc ? row.ngayKetThuc.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

  return {
    id: row.id,
    code: row.maVoucher,
    title: `Voucher ${row.maVoucher}`,
    description: discountType === 'percent' ? `Giam ${row.giaTri}%` : `Giam ${row.giaTri.toLocaleString('vi-VN')} VND`,
    discountType,
    discountValue: Number(row.giaTri ?? 0),
    minOrderValue: 0,
    expiredAt,
    isActive: Number(row.soLuong ?? 0) > 0 && new Date(expiredAt) >= new Date(new Date().toISOString().slice(0, 10)),
  };
};

const mapDiscountToDb = (type: string): string => {
  if (type === 'percent') {
    return 'PhanTram';
  }

  if (type === 'amount') {
    return 'SoTien';
  }

  return type;
};

export const getVouchersService = async (): Promise<VoucherPublic[]> => {
  const rows = await getVouchers();
  return rows.map(mapVoucher);
};

export const getVoucherByIdService = async (id: number): Promise<VoucherPublic> => {
  const row = await getVoucherById(id);
  if (!row) {
    throw new VoucherError('Khong tim thay voucher', 404);
  }

  return mapVoucher(row);
};

export const createVoucherService = async (payload: CreateVoucherRequestBody): Promise<VoucherPublic> => {
  const created = await createVoucher({
    ...payload,
    loaiGiam: mapDiscountToDb(payload.loaiGiam),
  });

  if (!created) {
    throw new VoucherError('Khong the tao voucher', 500);
  }

  return mapVoucher(created);
};

export const updateVoucherService = async (id: number, payload: UpdateVoucherRequestBody): Promise<VoucherPublic> => {
  const existing = await getVoucherById(id);
  if (!existing) {
    throw new VoucherError('Khong tim thay voucher', 404);
  }

  const updatePayload: UpdateVoucherRequestBody = { ...payload };
  if (payload.loaiGiam !== undefined) {
    updatePayload.loaiGiam = mapDiscountToDb(payload.loaiGiam);
  }

  const updated = await updateVoucher(id, updatePayload);

  if (!updated) {
    throw new VoucherError('Khong the cap nhat voucher', 500);
  }

  return mapVoucher(updated);
};

export const deleteVoucherService = async (id: number): Promise<void> => {
  const affectedRows = await deleteVoucher(id);
  if (affectedRows === 0) {
    throw new VoucherError('Khong tim thay voucher de xoa', 404);
  }
};
