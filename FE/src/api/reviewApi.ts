import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';

export interface BackendReview {
  id: number;
  idSanPham: number;
  idTaiKhoan: number;
  soSao: number;
  noiDung: string;
  ngayDanhGia: string;
  tenSanPham: string;
  tenKhachHang: string;
}

export interface CreateReviewPayload {
  idSanPham: number;
  soSao: number;
  noiDung?: string;
}

export interface UpdateReviewPayload {
  soSao?: number;
  noiDung?: string;
}

export const getReviewsApi = async (): Promise<ApiResponse<BackendReview[]>> => {
  const response = await httpClient.get<ApiResponse<BackendReview[]>>('/api/reviews');
  return response.data;
};

export const getReviewsByProductApi = async (productId: number): Promise<ApiResponse<BackendReview[]>> => {
  const response = await httpClient.get<ApiResponse<BackendReview[]>>(`/api/reviews/product/${productId}`);
  return response.data;
};

export const createReviewApi = async (payload: CreateReviewPayload): Promise<ApiResponse<BackendReview>> => {
  const response = await httpClient.post<ApiResponse<BackendReview>>('/api/reviews', payload);
  return response.data;
};

export const updateReviewApi = async (
  reviewId: number,
  payload: UpdateReviewPayload,
): Promise<ApiResponse<BackendReview>> => {
  const response = await httpClient.patch<ApiResponse<BackendReview>>(`/api/reviews/${reviewId}`, payload);
  return response.data;
};

export const deleteReviewApi = async (reviewId: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/reviews/${reviewId}`);
  return response.data;
};
