import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { categories } from '../../data/mockData';
import { formatCurrency, calcDiscountPercent } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import ProductCard from '../../components/ui/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products } = useProducts();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  const product = getProductById(Number(id));
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>😕</div>
        <h2>Không tìm thấy sản phẩm</h2>
        <Button onClick={() => navigate('/products')}>← Quay lại</Button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const discount = product.originalPrice
    ? calcDiscountPercent(product.originalPrice, product.price)
    : 0;
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Trang chủ</span>
        {' › '}
        <span onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>Sản phẩm</span>
        {' › '}
        <span>{category?.name}</span>
        {' › '}
        <span style={{ color: '#111827' }}>{product.name}</span>
      </nav>

      {/* Main */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '1/1' }}
          />
          {discount > 0 && (
            <span
              style={{
                position: 'absolute', top: '12px', left: '12px',
                background: '#ef4444', color: '#fff',
                padding: '4px 12px', borderRadius: '6px',
                fontSize: '14px', fontWeight: 700,
              }}
            >
              -{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
            {category?.icon} {category?.name} • {product.brand}
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 12px', lineHeight: 1.3 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: '#f59e0b', fontSize: '16px' }}>
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span style={{ color: '#6b7280', fontSize: '13px' }}>
              {product.rating} ({product.reviewCount} đánh giá)
            </span>
          </div>

          {/* Price */}
          <div
            style={{
              background: '#eff6ff', borderRadius: '12px',
              padding: '16px', marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#2563eb' }}>
              {formatCurrency(product.price)}
            </div>
            {product.originalPrice && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '16px' }}>
                  {formatCurrency(product.originalPrice)}
                </span>
                <span
                  style={{
                    background: '#ef4444', color: '#fff',
                    padding: '2px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 700,
                  }}
                >
                  Tiết kiệm {formatCurrency(product.originalPrice - product.price)}
                </span>
              </div>
            )}
          </div>

          {/* Stock */}
          <div
            style={{
              fontSize: '13px', marginBottom: '20px',
              color: product.stock > 5 ? '#10b981' : product.stock > 0 ? '#f59e0b' : '#ef4444',
            }}
          >
            {product.stock > 5
              ? `✅ Còn hàng (${product.stock} sản phẩm)`
              : product.stock > 0
              ? `⚠️ Chỉ còn ${product.stock} sản phẩm`
              : '❌ Hết hàng'}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '14px', color: '#374151', fontWeight: 600 }}>Số lượng:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '8px 14px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                >
                  -
                </button>
                <span style={{ padding: '8px 16px', fontSize: '15px', fontWeight: 600 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  style={{ padding: '8px 14px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant={isInCart(product.id) ? 'secondary' : 'primary'}
              size="lg"
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock === 0}
              style={{ flex: 1 }}
            >
              {isInCart(product.id) ? '✓ Đã thêm vào giỏ' : '🛒 Thêm vào giỏ hàng'}
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={() => { addToCart(product, quantity); navigate('/cart'); }}
              disabled={product.stock === 0}
            >
              Mua ngay
            </Button>
          </div>

          {/* Features */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['🚚 Miễn phí vận chuyển toàn quốc', '🔧 Bảo hành chính hãng 12 tháng', '↩️ Đổi trả trong 30 ngày', '💳 Thanh toán khi nhận hàng'].map((benefit) => (
              <div key={benefit} style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '20px' }}>
          {(['desc', 'specs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: 600,
                background: 'none',
                color: activeTab === tab ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                marginBottom: '-2px',
              }}
            >
              {tab === 'desc' ? 'Mô tả sản phẩm' : 'Thông số kỹ thuật'}
            </button>
          ))}
        </div>

        {activeTab === 'desc' ? (
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#374151', margin: 0 }}>
            {product.description}
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {Object.entries(product.specs).map(([key, value]) => (
                <tr key={key} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 600, color: '#374151', width: '200px', background: '#f9fafb' }}>{key}</td>
                  <td style={{ padding: '10px 16px', fontSize: '14px', color: '#6b7280' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Sản phẩm liên quan</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
