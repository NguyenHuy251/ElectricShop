import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { CheckCircleOutlined, CreditCardOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { cartTotalSelector } from '../../recoil/selectors/cartSelectors';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const total = useRecoilValue(cartTotalSelector);
  const { currentUser } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    note: '',
    payment: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const order = addOrder({
        userId: currentUser!.id,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
        })),
        total,
        status: 'pending',
        address: form.address,
        phone: form.phone,
        note: form.note,
      });
      setOrderId(order.id);
      clearCart();
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}><CheckCircleOutlined style={{ color: '#10b981' }} /></div>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
          Đặt hàng thành công!
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '8px' }}>
          Mã đơn hàng của bạn: <strong>#{orderId}</strong>
        </p>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button onClick={() => navigate('/orders')} variant="outline">
            Xem đơn hàng
          </Button>
          <Button onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Delivery */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>
                <HomeOutlined style={{ marginRight: 8 }} />Thông tin giao hàng
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                    Địa chỉ giao hàng
                  </label>
                  <input
                    value={form.address}
                    onChange={handleChange('address')}
                    required
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    style={{
                      padding: '10px 12px', border: '1.5px solid #d1d5db',
                      borderRadius: '8px', fontSize: '14px', outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={form.note}
                    onChange={handleChange('note')}
                    rows={2}
                    placeholder="Ghi chú về đơn hàng, thời gian giao hàng..."
                    style={{
                      padding: '10px 12px', border: '1.5px solid #d1d5db',
                      borderRadius: '8px', fontSize: '14px', outline: 'none',
                      resize: 'vertical', fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>
                <CreditCardOutlined style={{ marginRight: 8 }} />Phương thức thanh toán
              </h3>
              {[
                { value: 'cod', label: 'Thanh toán khi nhận hàng', desc: 'COD - Trả tiền mặt khi nhận hàng' },
                { value: 'bank', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản trước khi giao hàng' },
                { value: 'vnpay', label: 'VNPay', desc: 'Thanh toán qua ví điện tử VNPay' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '8px',
                    border: `2px solid ${form.payment === opt.value ? '#2563eb' : '#e5e7eb'}`,
                    background: form.payment === opt.value ? '#eff6ff' : '#fff',
                    cursor: 'pointer', marginBottom: '8px',
                  }}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    checked={form.payment === opt.value}
                    onChange={handleChange('payment')}
                    style={{ accentColor: '#2563eb' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', position: 'sticky', top: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>
              <FileTextOutlined style={{ marginRight: 8 }} />Đơn hàng ({cart.length} sản phẩm)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {cart.map((item) => (
                <div
                  key={item.productId}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <span
                      style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        background: '#6b7280', color: '#fff',
                        borderRadius: '999px', fontSize: '10px',
                        padding: '1px 5px', fontWeight: 700,
                      }}
                    >
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product.name}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span style={{ color: '#6b7280' }}>Tạm tính</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span style={{ color: '#6b7280' }}>Phí vận chuyển</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Miễn phí</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                <span>Tổng cộng</span>
                <span style={{ color: '#2563eb' }}>{formatCurrency(total)}</span>
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
