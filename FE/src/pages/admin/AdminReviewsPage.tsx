import React, { useState } from 'react';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { formatDate } from '../../utils/helpers';
import { StarOutlined } from '@ant-design/icons';

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

  const filteredReviews =
    filterStatus === 'all'
      ? reviews
      : reviews.filter((review) => review.trangThai === filterStatus);

  const handleApprove = (id: number) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, trangThai: 'approved' } : review
      )
    );
  };

  const handleReject = (id: number) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, trangThai: 'rejected' } : review
      )
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      setReviews((prev) => prev.filter((review) => review.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span
            style={{
              padding: '6px 12px',
              background: '#d1fae5',
              color: '#065f46',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            ✓ Đã duyệt
          </span>
        );
      case 'pending':
        return (
          <span
            style={{
              padding: '6px 12px',
              background: '#fef3c7',
              color: '#92400e',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            ⏳ Chờ duyệt
          </span>
        );
      case 'rejected':
        return (
          <span
            style={{
              padding: '6px 12px',
              background: '#fee2e2',
              color: '#991b1b',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            ✕ Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getStarRating = (soSao: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarOutlined
            key={i}
            style={{
              color: i < soSao ? '#f59e0b' : '#d1d5db',
              fontSize: '16px',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 20px', fontSize: '28px', fontWeight: 700, color: '#111827' }}>
          Quản lý Đánh giá sản phẩm
        </h1>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
                style={{
                  padding: '10px 16px',
                  background: filterStatus === status ? '#2563eb' : '#f3f4f6',
                  color: filterStatus === status ? '#fff' : '#111827',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                {statusLabels[status]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        }}
      >
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            style={{
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                  {review.tenSanPham}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  bởi <strong>{review.tenKhachHang}</strong>
                </p>
              </div>
              {getStatusBadge(review.trangThai)}
            </div>

            <div style={{ marginBottom: '12px' }}>
              {getStarRating(review.soSao)}
            </div>

            <p
              style={{
                margin: '0 0 12px',
                fontSize: '14px',
                color: '#475569',
                lineHeight: '1.5',
                minHeight: '40px',
              }}
            >
              {review.noiDung}
            </p>

            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#94a3b8' }}>
              Ngày: {formatDate(review.ngayDanhGia)}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {review.trangThai === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(review.id)}
                    style={{
                      padding: '8px 14px',
                      background: '#d1fae5',
                      color: '#065f46',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <CheckOutlined /> Duyệt
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    style={{
                      padding: '8px 14px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    Từ chối
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(review.id)}
                style={{
                  padding: '8px 14px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginLeft: 'auto',
                }}
              >
                <DeleteOutlined /> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 24px', color: '#94a3b8' }}>
          <p style={{ fontSize: '16px' }}>Không có đánh giá nào</p>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
