import React, { useState } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import { formatDate } from '../../utils/helpers';
import { StarOutlined } from '@ant-design/icons';
import { getReplyByReviewId, upsertReply } from '../../services/reviewReplyService';
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
  trangThai: 'pending' | 'approved' | 'rejected';
}

// Mock data - thay thế bằng API call
const initialReviews: Review[] = [
  {
    id: 1,
    idSanPham: 1,
    idTaiKhoan: 2,
    soSao: 5,
    noiDung: 'Quạt tốt, gió mạnh, chạy êm',
    ngayDanhGia: '2026-03-20',
    tenSanPham: 'Quạt Panasonic 5 cánh',
    tenKhachHang: 'Nguyễn Văn A',
    trangThai: 'approved',
  },
  {
    id: 2,
    idSanPham: 2,
    idTaiKhoan: 3,
    soSao: 4,
    noiDung: 'Nồi cơm ok, nấu cơm nhanh, xơi nước tốt',
    ngayDanhGia: '2026-03-19',
    tenSanPham: 'Nồi cơm Panasonic 1.8L',
    tenKhachHang: 'Trần Thị B',
    trangThai: 'approved',
  },
  {
    id: 3,
    idSanPham: 3,
    idTaiKhoan: 4,
    soSao: 5,
    noiDung: 'Máy xay rất mạnh, xay sinh tố đều đặn. Rất tốt!',
    ngayDanhGia: '2026-03-18',
    tenSanPham: 'Máy xay Philips',
    tenKhachHang: 'Lê Văn C',
    trangThai: 'approved',
  },
  {
    id: 4,
    idSanPham: 4,
    idTaiKhoan: 5,
    soSao: 3,
    noiDung: 'Ấm bình thường, tuy nhiên hơi đắt',
    ngayDanhGia: '2026-03-17',
    tenSanPham: 'Ấm Sunhouse',
    tenKhachHang: 'Phạm Thị D',
    trangThai: 'pending',
  },
  {
    id: 5,
    idSanPham: 5,
    idTaiKhoan: 2,
    soSao: 5,
    noiDung: 'Máy hút bụi rất tốt, hút sạch, không ồn',
    ngayDanhGia: '2026-03-16',
    tenSanPham: 'Máy hút bụi Electrolux',
    tenKhachHang: 'Nguyễn Văn A',
    trangThai: 'approved',
  },
  {
    id: 6,
    idSanPham: 1,
    idTaiKhoan: 3,
    soSao: 2,
    noiDung: 'Quạt này hơi ồn, gió không mạnh lắm',
    ngayDanhGia: '2026-03-15',
    tenSanPham: 'Quạt Panasonic 5 cánh',
    tenKhachHang: 'Trần Thị B',
    trangThai: 'pending',
  },
];

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews =
    filterStatus === 'all'
      ? reviews
      : reviews.filter((review) => review.trangThai === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="admin-review-badge-approved">
            ✓ Đã duyệt
          </span>
        );
      case 'pending':
        return (
          <span className="admin-review-badge-pending">
            ⏳ Chờ duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="admin-review-badge-rejected">
            ✕ Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getStarRating = (soSao: number) => {
    return (
      <div className="admin-reviews-star-row">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarOutlined
            key={i}
            className={i < soSao ? 'admin-review-star-active' : 'admin-review-star-inactive'}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="dashboard-title-wrap">
        <h1 className="admin-page-title">
          Quản lý Đánh giá sản phẩm
        </h1>

        <div className="admin-reviews-filter-row">
          {['all', 'pending', 'approved', 'rejected'].map((status) => {
            const statusLabels: Record<string, string> = {
              all: 'Tất cả',
              pending: 'Chờ duyệt',
              approved: 'Đã duyệt',
              rejected: 'Từ chối',
            };
            const count = status === 'all' ? reviews.length : reviews.filter((r) => r.trangThai === status).length;

            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`admin-reviews-filter-btn${filterStatus === status ? ' active' : ''}`}
              >
                {statusLabels[status]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="admin-reviews-grid">
        {filteredReviews.map((review) => (
          <div key={review.id} className="admin-reviews-card">
            <div className="admin-reviews-card-head">
              <div>
                <h3 className="admin-reviews-title">
                  {review.tenSanPham}
                </h3>
                <p className="admin-reviews-author">
                  bởi <strong>{review.tenKhachHang}</strong>
                </p>
              </div>
              {getStatusBadge(review.trangThai)}
            </div>

            <div className="admin-table-cell">
              {getStarRating(review.soSao)}
            </div>

            <p className="admin-reviews-content">
              {review.noiDung}
            </p>

            <p className="admin-reviews-date">
              Ngày: {formatDate(review.ngayDanhGia)}
            </p>

            <div className="admin-reviews-action-row">
              <button
                onClick={() => {
                  setReplyTargetId(review.id);
                  setReplyText(getReplyByReviewId(review.id)?.content || '');
                }}
                className="admin-reviews-reply-btn"
              >
                <MessageOutlined /> Phản hồi
              </button>
            </div>

            {getReplyByReviewId(review.id) && (
              <div className="admin-reviews-reply-box">
                <p className="admin-reviews-reply-title">
                  Phản hồi người bán
                </p>
                <p className="admin-reviews-reply-content">
                  {getReplyByReviewId(review.id)?.content}
                </p>
                <p className="admin-reviews-reply-meta">
                  {getReplyByReviewId(review.id)?.repliedBy} • {formatDate(getReplyByReviewId(review.id)?.repliedAt || '')}
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
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="admin-reviews-empty">
          <p>Không có đánh giá nào</p>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
