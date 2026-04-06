import {
  createSupplierApi,
  deleteSupplierApi,
  getSupplierByIdApi,
  getSuppliersApi,
  type SupplierPayload,
  updateSupplierApi,
} from '../api/supplierApi';

export const getSuppliers = () => getSuppliersApi();
export const getSupplierById = (id: number) => getSupplierByIdApi(id);
export const createSupplier = (payload: SupplierPayload) => createSupplierApi(payload);
export const updateSupplier = (id: number, payload: SupplierPayload) => updateSupplierApi(id, payload);
export const deleteSupplier = (id: number) => deleteSupplierApi(id);
