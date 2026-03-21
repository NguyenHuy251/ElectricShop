import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { cartTotalSelector } from '../../recoil/selectors/cartSelectors';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../components/ui/Button';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const total = useRecoilValue(cartTotalSelector);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}><ShoppingCartOutlined /></div>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Giỏ hàng trống</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Bạn chưa thêm sản phẩm nào vào giỏ hàng
        </p>
        <Button onClick={() => navigate('/products')} size="lg">
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
        <ShoppingCartOutlined style={{ marginRight: 8 }} />Giỏ hàng ({cart.length} sản phẩm)
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            {cart.map((item, index) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  borderBottom: index < cart.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to={`/products/${item.productId}`}
                    style={{ fontSize: '14px', fontWeight: 600, color: '#111827', textDecoration: 'none', display: 'block', marginBottom: '4px' }}
                  >
                    {item.product.name}
                  </Link>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                    {item.product.brand}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb' }}>
                    {formatCurrency(item.product.price)}
                  </div>
                </div>

                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={{ padding: '6px 12px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '6px 12px', minWidth: '32px', textAlign: 'center', fontSize: '14px', fontWeight: 600 }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    style={{ padding: '6px 12px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div style={{ minWidth: '100px', textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#ef4444', fontSize: '12px', marginTop: '4px',
                    }}
                  >
                    <DeleteOutlined /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            style={{
              background: 'none', border: '1.5px solid #e5e7eb',
              borderRadius: '8px', padding: '10px', cursor: 'pointer',
              color: '#6b7280', fontSize: '13px',
            }}
          >
            <DeleteOutlined /> Xóa toàn bộ giỏ hàng
          </button>
        </div>

        {/* Summary */}
        <div
          style={{
            background: '#fff', borderRadius: '12px', padding: '20px',
            position: 'sticky', top: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Tóm tắt đơn hàng</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#6b7280' }}>Tạm tính</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#6b7280' }}>Phí vận chuyển</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Miễn phí</span>
            </div>
            <div
              style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              <span>Tổng cộng</span>
              <span style={{ color: '#2563eb' }}>{formatCurrency(total)}</span>
            </div>
          </div>

          <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
            Tiến hành đặt hàng →
          </Button>
          <button
            onClick={() => navigate('/products')}
            style={{
              width: '100%', marginTop: '10px', background: 'none',
              border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '13px',
              padding: '8px',
            }}
          >
            ← Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
