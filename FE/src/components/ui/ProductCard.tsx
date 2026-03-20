import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency, calcDiscountPercent } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';
import Button from './Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const discount = product.originalPrice
    ? calcDiscountPercent(product.originalPrice, product.price)
    : 0;

  return (
    <div
      className="product-card"
      style={{
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
      }}
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} style={{ position: 'relative', display: 'block' }}>
        <img
          src={product.images[0]}
          alt={product.name}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
        {discount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            -{discount}%
          </span>
        )}
        {product.isNew && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#10b981',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            Mới
          </span>
        )}
      </Link>

      {/* Content */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
          {product.brand}
        </span>
        <Link
          to={`/products/${product.id}`}
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#111827',
            textDecoration: 'none',
            lineHeight: '1.4',
            marginBottom: 'auto',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '8px 0' }}>
          <span style={{ color: '#f59e0b', fontSize: '13px' }}>
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
          </span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>
            {formatCurrency(product.price)}
          </div>
          {product.originalPrice && (
            <div style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through' }}>
              {formatCurrency(product.originalPrice)}
            </div>
          )}
        </div>

        <Button
          variant={isInCart(product.id) ? 'secondary' : 'primary'}
          size="sm"
          fullWidth
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          {product.stock === 0
            ? 'Hết hàng'
            : isInCart(product.id)
            ? '✓ Đã thêm'
            : '🛒 Thêm vào giỏ'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
