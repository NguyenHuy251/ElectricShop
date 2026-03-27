export interface SellerReply {
  reviewId: number;
  content: string;
  repliedBy: string;
  repliedAt: string;
}

const REVIEW_REPLY_KEY = 'review_seller_replies';

const readReplies = (): SellerReply[] => {
  try {
    const raw = localStorage.getItem(REVIEW_REPLY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as SellerReply[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (_error: unknown) {
    return [];
  }
};

const writeReplies = (replies: SellerReply[]): void => {
  localStorage.setItem(REVIEW_REPLY_KEY, JSON.stringify(replies));
};

export const getReplyByReviewId = (reviewId: number): SellerReply | undefined => {
  return readReplies().find((item) => item.reviewId === reviewId);
};

export const upsertReply = (payload: SellerReply): SellerReply => {
  const replies = readReplies();
  const index = replies.findIndex((item) => item.reviewId === payload.reviewId);

  if (index >= 0) {
    replies[index] = payload;
  } else {
    replies.push(payload);
  }

  writeReplies(replies);
  return payload;
};
