import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CreditCardOutlined, FileTextOutlined, HomeOutlined, GiftOutlined } from '@ant-design/icons';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency } from '../../utils/helpers';
import { getApiErrorMessage } from '../../utils/apiError';
import { getVouchers } from '../../services';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import '../../assets/styles/pages/user-pages.css';

interface CheckoutLocationState {
  selectedProductIds?: number[];
}

const CheckoutPage: React.FC = () => {
  const { cart, clearCart, removeFromCart } = useCart();
  const { currentUser } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as CheckoutLocationState | null;
  const rawSelectedProductIds = locationState?.selectedProductIds;
  const selectedProductIds: number[] = Array.isArray(rawSelectedProductIds)
    ? rawSelectedProductIds
    : [];

  const checkoutItems = selectedProductIds.length > 0
    ? cart.filter((item) => selectedProductIds.includes(item.productId))
    : cart;

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    note: '',
    payment: 'cod',
  });
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const total = checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const discount = appliedVoucher ? (
    appliedVoucher.discountType === 'percent'
      ? (total * appliedVoucher.discountValue) / 100
      : appliedVoucher.discountValue
  ) : 0;

  const finalTotal = Math.max(0, total - discount);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      window.alert('Vui lòng nhập mã voucher');
      return;
    }
    try {
      const response = await getVouchers();
      const voucher = response.data.find((v: any) => v.code.toUpperCase() === voucherCode.toUpperCase() && v.isActive);
      if (voucher && total >= (voucher.minOrderValue || 0)) {
        setAppliedVoucher(voucher);
        window.alert('Áp dụng mã voucher thành công!');
      } else {
        window.alert('Mã voucher không hợp lệ hoặc đã hết hạn');
      }
    } catch (error) {
      window.alert('Không thể kiểm tra voucher');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await addOrder({
        items: checkoutItems.map((item) => ({
          idSanPham: item.productId,
          soLuong: item.quantity,
        })),
        diaChi: form.address,
        soDienThoai: form.phone,
        ghiChu: form.note,
        phuongThucThanhToan: form.payment,
      });
      setOrderId(order.id);

      if (selectedProductIds.length > 0) {
        selectedProductIds.forEach((id) => removeFromCart(id));
      } else {
        clearCart();
      }

      setSuccess(true);
    } catch (error) {
      window.alert(getApiErrorMessage(error, 'Không thể tạo đơn hàng'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-page__success">
        <div className="checkout-page__success-icon">
          <CheckCircleOutlined className="checkout-page__success-icon-mark" />
        </div>
        <h2 className="checkout-page__success-title">Đặt hàng thành công!</h2>
        <p className="checkout-page__success-text">
          Mã đơn hàng của bạn: <strong>#{orderId}</strong>
        </p>
        <p className="checkout-page__success-text">
          Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
        </p>
        <div className="checkout-page__success-actions">
          <Button onClick={() => navigate('/orders')} variant="outline">
            Xem đơn hàng
          </Button>
          <Button onClick={() => navigate('/')}>Về trang chủ</Button>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="checkout-layout">
          <div className="checkout-stack">
            <div className="checkout-panel">
              <h3 className="checkout-panel__title">
                <HomeOutlined className="checkout-panel__title-icon" />Thông tin giao hàng
              </h3>
              <div className="checkout-form">
                <Input
                  label="Họ và tên"
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                  placeholder="Nguyễn Văn A"
                />
                <Input
                  label="Số điện thoại"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  required
                  placeholder="0901234567"
                  type="tel"
                />
                <div className="checkout-field">
                  <label className="checkout-field__label">Địa chỉ giao hàng</label>
                  <input
                    value={form.address}
                    onChange={handleChange('address')}
                    required
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    className="checkout-field__control"
                  />
                </div>
                <div className="checkout-field">
                  <label className="checkout-field__label">Ghi chú (tùy chọn)</label>
                  <textarea
                    value={form.note}
                    onChange={handleChange('note')}
                    rows={2}
                    placeholder="Ghi chú về đơn hàng, thời gian giao hàng..."
                    className="checkout-field__control checkout-field__control--textarea"
                  />
                </div>
              </div>
            </div>

            <div className="checkout-panel">
              <h3 className="checkout-panel__title">
                <CreditCardOutlined className="checkout-panel__title-icon" />Phương thức thanh toán
              </h3>
              {[
                { value: 'cod', label: 'Thanh toán khi nhận hàng', desc: 'COD - Trả tiền mặt khi nhận hàng' },
                { value: 'bank', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản trước khi giao hàng' },
                { value: 'vnpay', label: 'VNPay', desc: 'Thanh toán qua ví điện tử VNPay' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={
                    form.payment === option.value
                      ? 'checkout-payment-option checkout-payment-option--selected'
                      : 'checkout-payment-option'
                  }
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={form.payment === option.value}
                    onChange={handleChange('payment')}
                  />
                  <div>
                    <div className="checkout-payment-option__title">{option.label}</div>
                    <div className="checkout-payment-option__desc">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="checkout-summary">
            <h3 className="checkout-summary__title">
              <FileTextOutlined className="checkout-panel__title-icon" />Đơn hàng ({checkoutItems.length} sản phẩm)
            </h3>

            <div className="checkout-summary__items">
              {checkoutItems.map((item) => (
                <div key={item.productId} className="checkout-summary__item">
                  <div className="checkout-summary__thumb-wrap">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="checkout-summary__thumb"
                    />
                    <span className="checkout-summary__qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-summary__item-body">
                    <div className="checkout-summary__item-name">{item.product.name}</div>
                  </div>
                  <div className="checkout-summary__item-price">{formatCurrency(item.product.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã voucher"
                  className="checkout-field__control"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleApplyVoucher}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  <GiftOutlined /> Áp dụng
                </button>
              </div>
              {appliedVoucher && (
                <div style={{ color: '#10b981', fontSize: '14px' }}>
                  ✓ Đã áp dụng: {appliedVoucher.code}
                </div>
              )}
            </div>

            <div className="checkout-summary__totals">
              <div className="checkout-summary__row">
                <span className="checkout-summary__muted">Tạm tính</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="checkout-summary__row">
                <span className="checkout-summary__muted">Phí vận chuyển</span>
                <span className="checkout-summary__free">Miễn phí</span>
              </div>
              {discount > 0 && (
                <div className="checkout-summary__row" style={{ color: '#10b981' }}>
                  <span className="checkout-summary__muted">Giảm giá</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="checkout-summary__row checkout-summary__row--total">
                <span>Tổng cộng</span>
                <span className="checkout-summary__total-value">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Xác nhận đặt hàng
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;