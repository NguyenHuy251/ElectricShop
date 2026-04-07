import {
  createReview,
  deleteReview,
  getReviews,
  getReviewsByProduct,
  updateReview,
} from '../repositories/reviewRepository.js';
import type {
  CreateReviewRequestBody,
  ReviewPublic,
  ReviewRow,
  UpdateReviewRequestBody,
} from '../types/review.js';

export class ReviewError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ReviewError';
    this.statusCode = statusCode;
  }
}

const mapReview = (row: ReviewRow): ReviewPublic => ({
  id: row.id,
  idSanPham: row.idSanPham,
  idTaiKhoan: row.idTaiKhoan,
  soSao: row.soSao,
  noiDung: row.noiDung ?? '',
  ngayDanhGia: row.ngayDanhGia,
  tenSanPham: row.tenSanPham,
  tenKhachHang: row.tenHienThi || row.tenDangNhap,
});

export const getReviewsService = async (): Promise<ReviewPublic[]> => {
  const rows = await getReviews();
  return rows.map(mapReview);
};

export const getReviewsByProductService = async (idSanPham: number): Promise<ReviewPublic[]> => {
  const rows = await getReviewsByProduct(idSanPham);
  return rows.map(mapReview);
};

export const createReviewService = async (
  idTaiKhoan: number,
  payload: CreateReviewRequestBody,
): Promise<ReviewPublic> => {
  if (!payload.idSanPham || !payload.soSao) {
    throw new ReviewError('Vui long nhap idSanPham va soSao', 400);
  }

  if (payload.soSao < 1 || payload.soSao > 5) {
    throw new ReviewError('soSao phai trong khoang 1-5', 400);
  }

  const created = await createReview(idTaiKhoan, payload);
  if (!created) {
    throw new ReviewError('Khong the tao danh gia', 500);
  }

  return mapReview(created);
};

export const updateReviewService = async (
  id: number,
  idTaiKhoan: number,
  isAdmin: boolean,
  payload: UpdateReviewRequestBody,
): Promise<ReviewPublic> => {
  if (payload.soSao !== undefined && (payload.soSao < 1 || payload.soSao > 5)) {
    throw new ReviewError('soSao phai trong khoang 1-5', 400);
  }

  const updated = await updateReview(id, idTaiKhoan, isAdmin, payload);
  if (!updated) {
    throw new ReviewError('Khong the cap nhat danh gia', 404);
  }

  return mapReview(updated);
};

export const deleteReviewService = async (id: number, idTaiKhoan: number, isAdmin: boolean): Promise<void> => {
  await deleteReview(id, idTaiKhoan, isAdmin);
};
