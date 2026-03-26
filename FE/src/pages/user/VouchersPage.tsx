import React from 'react';
import { CopyOutlined, GiftOutlined, TagOutlined } from '@ant-design/icons';
import { vouchers } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/helpers';

const VouchersPage: React.FC = () => {
  const today = new Date();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px 36px' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #1d4ed8, #0f766e)',
          borderRadius: '16px',
          color: '#fff',
          padding: '24px',
          marginBottom: '22px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>
          <GiftOutlined style={{ marginRight: 10 }} />Kho Voucher
        </h1>
        <p style={{ margin: '10px 0 0', opacity: 0.9 }}>
          Chọn mã phù hợp để tiết kiệm nhiều hơn cho đơn hàng của bạn.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {vouchers.map((voucher) => {
          const expired = !voucher.isActive || new Date(voucher.expiredAt) < today;
          const discountLabel =
            voucher.discountType === 'percent'
              ? `Giảm ${voucher.discountValue}%`
              : `Giảm ${formatCurrency(voucher.discountValue)}`;

          return (
            <article
              key={voucher.id}
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: `1px solid ${expired ? '#fecaca' : '#bfdbfe'}`,
                display: 'flex',
                flexWrap: 'wrap',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: expired ? '#fef2f2' : 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                  color: expired ? '#b91c1c' : '#fff',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: '1 1 220px',
                }}
              >
                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                  <TagOutlined style={{ marginRight: 6 }} />{expired ? 'Không khả dụng' : 'Đang áp dụng'}
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, marginTop: 8 }}>{discountLabel}</div>
              </div>

              <div style={{ padding: '18px 20px', flex: '2 1 340px' }}>
                <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#0f172a' }}>{voucher.title}</h2>
                <p style={{ margin: '0 0 10px', color: '#475569' }}>{voucher.description}</p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#334155', fontSize: '14px' }}>
                  <span>Đơn tối thiểu: <strong>{formatCurrency(voucher.minOrderValue)}</strong></span>
                  {voucher.maxDiscountValue && (
                    <span>Giảm tối đa: <strong>{formatCurrency(voucher.maxDiscountValue)}</strong></span>
                  )}
                  <span>Hạn dùng: <strong>{formatDate(voucher.expiredAt)}</strong></span>
                </div>
              </div>

              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: '1 1 180px' }}>
                <div
                  style={{
                    border: '1px dashed #94a3b8',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontWeight: 700,
                    fontSize: '15px',
                    background: '#f8fafc',
                    color: '#0f172a',
                    marginBottom: '10px',
                    textAlign: 'center',
                  }}
                >
                  {voucher.code}
                </div>
                <button
                  type="button"
                  disabled={expired}
                  onClick={() => navigator.clipboard.writeText(voucher.code)}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontWeight: 700,
                    cursor: expired ? 'not-allowed' : 'pointer',
                    background: expired ? '#e2e8f0' : '#0f766e',
                    color: expired ? '#64748b' : '#fff',
                  }}
                >
                  <CopyOutlined style={{ marginRight: 6 }} />Sao chép mã
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
