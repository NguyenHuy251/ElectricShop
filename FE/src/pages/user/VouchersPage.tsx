import React, { useEffect, useState } from 'react';
import { CopyOutlined, GiftOutlined, TagOutlined } from '@ant-design/icons';
import { getVouchers } from '../../services';
import { Voucher } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import '../../assets/styles/pages/content.css';

const VouchersPage: React.FC = () => {
  const today = new Date();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadVouchers = async () => {
      setLoading(true);
      try {
        const response = await getVouchers();
        if (isMounted) {
          setVouchers(response.data);
        }
      } catch (error) {
        console.error('Khong the tai voucher:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadVouchers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="vouchers-page">
      <div className="vouchers-hero">
        <h1 className="vouchers-hero-title">
          <GiftOutlined className="vouchers-hero-icon" />Kho Voucher
        </h1>
        <p className="vouchers-hero-desc">
          Chọn mã phù hợp để tiết kiệm nhiều hơn cho đơn hàng của bạn.
        </p>
      </div>

      <div className="vouchers-list">
        {loading && <p>Dang tai voucher...</p>}
        {vouchers.map((voucher) => {
          const expired = !voucher.isActive || new Date(voucher.expiredAt) < today;
          const discountLabel =
            voucher.discountType === 'percent'
              ? `Giảm ${voucher.discountValue}%`
              : `Giảm ${formatCurrency(voucher.discountValue)}`;

          return (
            <article
              key={voucher.id}
              className={`voucher-card ${expired ? 'expired' : 'active'}`}
            >
              <div className={`voucher-side ${expired ? 'expired' : 'active'}`}>
                <div className="voucher-state">
                  <TagOutlined className="voucher-state-icon" />{expired ? 'Không khả dụng' : 'Đang áp dụng'}
                </div>
                <div className="voucher-discount">{discountLabel}</div>
              </div>

              <div className="voucher-body">
                <h2 className="voucher-title">{voucher.title}</h2>
                <p className="voucher-desc">{voucher.description}</p>
                <div className="voucher-meta">
                  <span>Đơn tối thiểu: <strong>{formatCurrency(voucher.minOrderValue)}</strong></span>
                  {voucher.maxDiscountValue && (
                    <span>Giảm tối đa: <strong>{formatCurrency(voucher.maxDiscountValue)}</strong></span>
                  )}
                  <span>Hạn dùng: <strong>{formatDate(voucher.expiredAt)}</strong></span>
                </div>
              </div>

              <div className="voucher-action">
                <div className="voucher-code">{voucher.code}</div>
                <button
                  type="button"
                  disabled={expired}
                  onClick={() => navigator.clipboard.writeText(voucher.code)}
                  className={`voucher-copy-btn ${expired ? 'expired' : 'active'}`}
                >
                  <CopyOutlined className="voucher-copy-icon" />Sao chép mã
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default VouchersPage;
