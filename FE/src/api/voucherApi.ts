import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';
import type { Voucher } from '../types';

export interface VoucherPayload {
  maVoucher: string;
  loaiGiam: string;
  giaTri: number;
  ngayBatDau?: string;
  ngayKetThuc: string;
  soLuong: number;
}

export const getVouchersApi = async (): Promise<ApiResponse<Voucher[]>> => {
  const response = await httpClient.get<ApiResponse<Voucher[]>>('/api/vouchers');
  return response.data;
};

export const createVoucherApi = async (payload: VoucherPayload): Promise<ApiResponse<Voucher>> => {
  const response = await httpClient.post<ApiResponse<Voucher>>('/api/vouchers', payload);
  return response.data;
};

export const updateVoucherApi = async (id: number, payload: Partial<VoucherPayload>): Promise<ApiResponse<Voucher>> => {
  const response = await httpClient.put<ApiResponse<Voucher>>(`/api/vouchers/${id}`, payload);
  return response.data;
};

export const deleteVoucherApi = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/vouchers/${id}`);
  return response.data;
};
