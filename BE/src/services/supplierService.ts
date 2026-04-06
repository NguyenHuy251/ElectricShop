import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
} from '../repositories/supplierRepository.js';
import type {
  CreateSupplierRequestBody,
  SupplierPublic,
  SupplierRow,
  UpdateSupplierRequestBody,
} from '../types/supplier.js';

export class SupplierError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'SupplierError';
    this.statusCode = statusCode;
  }
}

const mapSupplier = (row: SupplierRow): SupplierPublic => ({
  id: row.id,
  tenNhaCungCap: row.tenNhaCungCap,
  sdt: row.sdt ?? '',
  email: row.email ?? '',
  diaChi: row.diaChi ?? '',
});

export const getSuppliersService = async (): Promise<SupplierPublic[]> => {
  const rows = await getSuppliers();
  return rows.map(mapSupplier);
};

export const getSupplierByIdService = async (id: number): Promise<SupplierPublic> => {
  const row = await getSupplierById(id);
  if (!row) throw new SupplierError('Khong tim thay nha cung cap', 404);
  return mapSupplier(row);
};

export const createSupplierService = async (payload: CreateSupplierRequestBody): Promise<SupplierPublic> => {
  const created = await createSupplier(payload);
  if (!created) throw new SupplierError('Khong the tao nha cung cap', 500);
  return mapSupplier(created);
};

export const updateSupplierService = async (id: number, payload: UpdateSupplierRequestBody): Promise<SupplierPublic> => {
  const existing = await getSupplierById(id);
  if (!existing) throw new SupplierError('Khong tim thay nha cung cap', 404);

  const updated = await updateSupplier(id, payload);
  if (!updated) throw new SupplierError('Khong the cap nhat nha cung cap', 500);
  return mapSupplier(updated);
};

export const deleteSupplierService = async (id: number): Promise<void> => {
  const affectedRows = await deleteSupplier(id);
  if (affectedRows === 0) throw new SupplierError('Khong tim thay nha cung cap de xoa', 404);
};
