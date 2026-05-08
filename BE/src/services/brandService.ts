import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from '../repositories/brandRepository.js';
import type {
  BrandPublic,
  BrandRow,
  CreateBrandRequestBody,
  UpdateBrandRequestBody,
} from '../types/brand.js';

export class BrandError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'BrandError';
    this.statusCode = statusCode;
  }
}

const mapBrand = (row: BrandRow): BrandPublic => ({
  id: row.id,
  tenThuongHieu: row.tenThuongHieu,
  slug: row.slug ?? '',
  logo: row.logo ?? '',
  quocGia: row.quocGia ?? '',
  trangThai: Boolean(row.trangThai),
});

export const getBrandsService = async (): Promise<BrandPublic[]> => {
  const rows = await getBrands();
  return rows.map(mapBrand);
};

export const getBrandByIdService = async (id: number): Promise<BrandPublic> => {
  const row = await getBrandById(id);
  if (!row) throw new BrandError('Khong tim thay thuong hieu', 404);
  return mapBrand(row);
};

export const createBrandService = async (payload: CreateBrandRequestBody): Promise<BrandPublic> => {
  const created = await createBrand(payload);
  if (!created) throw new BrandError('Khong the tao thuong hieu', 500);
  return mapBrand(created);
};

export const updateBrandService = async (id: number, payload: UpdateBrandRequestBody): Promise<BrandPublic> => {
  const existing = await getBrandById(id);
  if (!existing) throw new BrandError('Khong tim thay thuong hieu', 404);

  const updated = await updateBrand(id, payload);
  if (!updated) throw new BrandError('Khong the cap nhat thuong hieu', 500);
  return mapBrand(updated);
};

export const deleteBrandService = async (id: number): Promise<void> => {
  const affectedRows = await deleteBrand(id);
  if (affectedRows === 0) throw new BrandError('Khong tim thay thuong hieu de xoa', 404);
};
