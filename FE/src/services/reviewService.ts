import {
  createReviewApi,
  deleteReviewApi,
  getReviewsApi,
  getReviewsByProductApi,
  updateReviewApi,
} from '../api/reviewApi';

export const getReviews = () => getReviewsApi();
export const getReviewsByProduct = (productId: number) => getReviewsByProductApi(productId);
export const createReview = (payload: { idSanPham: number; soSao: number; noiDung?: string }) => createReviewApi(payload);
export const updateReview = (reviewId: number, payload: { soSao?: number; noiDung?: string }) => updateReviewApi(reviewId, payload);
export const deleteReview = (reviewId: number) => deleteReviewApi(reviewId);
