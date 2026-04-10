import {
  createVoucherApi,
  deleteVoucherApi,
  getVouchersApi,
  updateVoucherApi,
  type VoucherPayload,
} from '../api/voucherApi';

export const getVouchers = () => getVouchersApi();
export const createVoucher = (payload: VoucherPayload) => createVoucherApi(payload);
export const updateVoucher = (id: number, payload: Partial<VoucherPayload>) => updateVoucherApi(id, payload);
export const deleteVoucher = (id: number) => deleteVoucherApi(id);
