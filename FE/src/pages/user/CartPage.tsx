import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import '../../assets/styles/pages/cart.css';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedProductIds((prev) => {
      const cartIds = cart.map((item) => item.productId);
      if (prev.length === 0) {
        return cartIds;
      }

      const next = prev.filter((id) => cartIds.includes(id));
      return next;
    });
  }, [cart]);

  const selectedItems = useMemo(
    () => cart.filter((item) => selectedProductIds.includes(item.productId)),
    [cart, selectedProductIds],
  );

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [selectedItems],
  );

  const isAllSelected = cart.length > 0 && selectedProductIds.length === cart.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProductIds([]);
      return;
    }

    setSelectedProductIds(cart.map((item) => item.productId));
  };

  const toggleSelectItem = (productId: number) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }

      return [...prev, productId];
    });
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page-empty">
        <div className="cart-page-empty-icon"><ShoppingCartOutlined /></div>
        <h2 className="cart-page-empty-title">Giỏ hàng trống</h2>
        <p className="cart-page-empty-desc">
          Bạn chưa thêm sản phẩm nào vào giỏ hàng
        </p>
        <Button onClick={() => navigate('/products')} size="lg">
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">
        <ShoppingCartOutlined className="cart-page-title-icon" />Giỏ hàng ({cart.length} sản phẩm)
      </h1>

      <div className="cart-page-grid">
        {/* Items */}
        <div className="cart-page-items">
          <div className="cart-page-select-all">
            <label>
              <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} />
              {' '}Chọn tất cả ({cart.length} sản phẩm)
            </label>
          </div>

          <div className="cart-page-items-card">
            {cart.map((item, index) => (
              <div
                key={item.productId}
                className="cart-page-item-row"
              >
                <label>
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(item.productId)}
                    onChange={() => toggleSelectItem(item.productId)}
                  />
                </label>
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="cart-page-item-image"
                />
                <div className="cart-page-item-info">
                  <Link
                    to={`/products/${item.productId}`}
                    className="cart-page-item-name"
                  >
                    {item.product.name}
                  </Link>
                  <div className="cart-page-item-brand">
                    {item.product.brand}
                  </div>
                  <div className="cart-page-item-price">
                    {formatCurrency(item.product.price)}
                  </div>
                </div>

                {/* Quantity */}
                <div className="cart-page-qty">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="cart-page-qty-btn"
                  >
                    -
                  </button>
                  <span className="cart-page-qty-value">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="cart-page-qty-btn"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="cart-page-subtotal">
                  <div className="cart-page-subtotal-value">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="cart-page-remove-btn"
                  >
                    <DeleteOutlined /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="cart-page-clear-btn"
          >
            <DeleteOutlined /> Xóa toàn bộ giỏ hàng
          </button>
        </div>

        {/* Summary */}
        <div className="cart-page-summary">
          <h3 className="cart-page-summary-title">Tóm tắt đơn hàng</h3>

          <div className="cart-page-summary-list">
            <div className="cart-page-summary-row">
              <span className="cart-page-summary-muted">Đã chọn</span>
              <span>{selectedItems.length} sản phẩm</span>
            </div>
            <div className="cart-page-summary-row">
              <span className="cart-page-summary-muted">Tạm tính</span>
              <span>{formatCurrency(selectedTotal)}</span>
            </div>
            <div className="cart-page-summary-row">
              <span className="cart-page-summary-muted">Phí vận chuyển</span>
              <span className="cart-page-summary-free">Miễn phí</span>
            </div>
            <div className="cart-page-summary-total">
              <span>Tổng cộng</span>
              <span className="cart-page-summary-total-price">{formatCurrency(selectedTotal)}</span>
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={() => navigate('/checkout', { state: { selectedProductIds } })}
            disabled={selectedProductIds.length === 0}
          >
            Tiến hành đặt hàng →
          </Button>
          <button
            onClick={() => navigate('/products')}
            className="cart-page-back-btn"
          >
            ← Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
