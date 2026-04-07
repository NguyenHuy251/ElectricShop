import React, { useEffect, useState } from 'react';
import { MessageOutlined, StarOutlined } from '@ant-design/icons';
import { formatDate } from '../../utils/helpers';
import { getReplyByReviewId, upsertReply } from '../../services/reviewReplyService';
import { getReviews } from '../../services';
import '../../assets/styles/pages/admin-pages.css';

export interface Review {
  id: number;
  idSanPham: number;
  idTaiKhoan: number;
  soSao: number;
  noiDung: string;
  ngayDanhGia: string;
  tenSanPham: string;
  tenKhachHang: string;
}

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      setLoading(true);
      try {
        const response = await getReviews();
        if (isMounted) {
          setReviews(response.data.map((review) => ({
            id: review.id,
            idSanPham: review.idSanPham,
            idTaiKhoan: review.idTaiKhoan,
            soSao: review.soSao,
            noiDung: review.noiDung,
            ngayDanhGia: review.ngayDanhGia,
            tenSanPham: review.tenSanPham,
            tenKhachHang: review.tenKhachHang,
          })));
        }
      } catch (error) {
        console.error('Không thể tải danh sách đánh giá:', error);
        if (isMounted) {
          setReviews([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const getStarRating = (soSao: number) => (
    <div className="admin-reviews-star-row">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarOutlined
          key={i}
          className={i < soSao ? 'admin-review-star-active' : 'admin-review-star-inactive'}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div className="dashboard-title-wrap">
        <h1 className="admin-page-title">Quản lý Đánh giá sản phẩm</h1>
        <p className="dashboard-subtitle">Danh sách đánh giá lấy từ API backend</p>
      </div>

      <div className="admin-reviews-grid">
        {loading ? (
          <div className="admin-reviews-empty">
            <p>Đang tải đánh giá...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => {
            const reply = getReplyByReviewId(review.id);

            return (
              <div key={review.id} className="admin-reviews-card">
                <div className="admin-reviews-card-head">
                  <div>
                    <h3 className="admin-reviews-title">{review.tenSanPham}</h3>
                    <p className="admin-reviews-author">
                      bởi <strong>{review.tenKhachHang}</strong>
                    </p>
                  </div>
                  <span className="admin-review-badge-approved">Đánh giá thật</span>
                </div>

                <div className="admin-table-cell">{getStarRating(review.soSao)}</div>

                <p className="admin-reviews-content">{review.noiDung}</p>

                <p className="admin-reviews-date">Ngày: {formatDate(review.ngayDanhGia)}</p>

                <div className="admin-reviews-action-row">
                  <button
                    onClick={() => {
                      setReplyTargetId(review.id);
                      setReplyText(reply?.content || '');
                    }}
                    className="admin-reviews-reply-btn"
                  >
                    <MessageOutlined /> Phản hồi
                  </button>
                </div>

                {reply && (
                  <div className="admin-reviews-reply-box">
                    <p className="admin-reviews-reply-title">Phản hồi người bán</p>
                    <p className="admin-reviews-reply-content">{reply.content}</p>
                    <p className="admin-reviews-reply-meta">
                      {reply.repliedBy} • {formatDate(reply.repliedAt || '')}
                    </p>
                  </div>
                )}

                {replyTargetId === review.id && (
                  <div className="admin-reviews-reply-editor">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      placeholder="Nhập phản hồi cho đánh giá này"
                      className="admin-reviews-textarea"
                    />
                    <div className="admin-reviews-reply-actions">
                      <button
                        onClick={() => {
                          if (!replyText.trim()) return;
                          upsertReply({
                            reviewId: review.id,
                            content: replyText.trim(),
                            repliedBy: 'Admin',
                            repliedAt: new Date().toISOString(),
                          });
                          setReplyTargetId(null);
                          setReplyText('');
                          setReviews((prev) => [...prev]);
                        }}
                        className="admin-reviews-send-btn"
                      >
                        Gửi phản hồi
                      </button>
                      <button
                        onClick={() => {
                          setReplyTargetId(null);
                          setReplyText('');
                        }}
                        className="admin-reviews-cancel-btn"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="admin-reviews-empty">
            <p>Không có đánh giá nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
