import { getReplyByReviewIdApi, upsertReplyApi } from '../api/reviewReplyApi';
import type { SellerReply } from '../types/reviewReply';

export const getReplyByReviewId = (reviewId: number): SellerReply | undefined => {
  return getReplyByReviewIdApi(reviewId);
};

export const upsertReply = (payload: SellerReply): SellerReply => {
  return upsertReplyApi(payload);
};
