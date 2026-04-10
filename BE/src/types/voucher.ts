export interface VoucherRow {
  id: number;
  maVoucher: string;
  loaiGiam: string;
  giaTri: number;
  ngayBatDau: Date | null;
  ngayKetThuc: Date | null;
  soLuong: number;
}

export interface VoucherPublic {
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

export interface CreateVoucherRequestBody {
  maVoucher: string;
  loaiGiam: string;
  giaTri: number;
  ngayBatDau?: string;
  ngayKetThuc: string;
  soLuong: number;
}

export interface UpdateVoucherRequestBody {
  maVoucher?: string;
  loaiGiam?: string;
  giaTri?: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  soLuong?: number;
}
