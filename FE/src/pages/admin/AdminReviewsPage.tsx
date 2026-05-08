import React, { useEffect, useMemo, useState } from 'react';
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
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');
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

  const filteredReviews = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const ratingMatches = ratingFilter === 'all' || review.soSao === Number(ratingFilter);
      const searchMatches =
        !keyword ||
        [review.tenSanPham, review.tenKhachHang, review.noiDung]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword));

      return ratingMatches && searchMatches;
    });
  }, [ratingFilter, reviews, search]);

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

      <div className="admin-search-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
          placeholder="Tìm theo sản phẩm, khách hàng hoặc nội dung đánh giá..."
        />
        <div className="admin-filter-row" style={{ marginTop: 12 }}>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as typeof ratingFilter)}
            className="admin-filter-select"
          >
            <option value="all">Tất cả số sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
      </div>

      <div className="admin-reviews-grid">
        {loading ? (
          <div className="admin-reviews-empty">
            <p>Đang tải đánh giá...</p>
          </div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review) => {
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
            <p>Không có đánh giá nào phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
