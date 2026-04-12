import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../repositories/categoryRepository.js';
import type {
  CategoryPublic,
  CategoryRow,
  CreateCategoryRequestBody,
  UpdateCategoryRequestBody,
} from '../types/category.js';

export class CategoryError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'CategoryError';
    this.statusCode = statusCode;
  }
}

const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const mapCategory = (row: CategoryRow): CategoryPublic => ({
  id: row.id,
  tenDanhMuc: row.tenDanhMuc,
  slug: row.slug ?? slugify(row.tenDanhMuc),
  moTa: row.moTa ?? '',
  trangThai: row.trangThai,
});

export const getCategoriesService = async (): Promise<CategoryPublic[]> => {
  const rows = await getCategories();
  return rows.map(mapCategory);
};

export const getCategoryByIdService = async (id: number): Promise<CategoryPublic> => {
  const row = await getCategoryById(id);
  if (!row) throw new CategoryError('Khong tim thay danh muc', 404);
  return mapCategory(row);
};

export const createCategoryService = async (payload: CreateCategoryRequestBody): Promise<CategoryPublic> => {
  const finalPayload = {
    ...payload,
    slug: payload.slug?.trim() || slugify(payload.tenDanhMuc),
  };

  const created = await createCategory(finalPayload);
  if (!created) throw new CategoryError('Khong the tao danh muc', 500);
  return mapCategory(created);
};

export const updateCategoryService = async (id: number, payload: UpdateCategoryRequestBody): Promise<CategoryPublic> => {
  const existing = await getCategoryById(id);
  if (!existing) throw new CategoryError('Khong tim thay danh muc', 404);

  const finalPayload = {
    ...payload,
    slug: payload.slug !== undefined ? payload.slug : payload.tenDanhMuc ? slugify(payload.tenDanhMuc) : undefined,
  };

  const updated = await updateCategory(id, finalPayload);
  if (!updated) throw new CategoryError('Khong the cap nhat danh muc', 500);
  return mapCategory(updated);
};

export const deleteCategoryService = async (id: number): Promise<void> => {
  const affectedRows = await deleteCategory(id);
  if (affectedRows === 0) throw new CategoryError('Khong tim thay danh muc de xoa', 404);
};
