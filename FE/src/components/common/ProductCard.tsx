import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import StarRating from './StarRating';
import { COLORS } from '../../constants';
import { formatCurrency, calcDiscount } from '../../utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const discount = product.originalPrice ? calcDiscount(product.originalPrice, product.price) : 0;

  return (
    <Link to={`/san-pham/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`,
        overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', height: '100%',
      }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(21,101,192,0.15)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = '';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', paddingTop: '75%', background: '#f8f9fa', overflow: 'hidden' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/300x225/e3f2fd/1565c0?text=${encodeURIComponent(product.brand)}`; }}
          />
          {discount > 0 && (
            <span style={{ position: 'absolute', top: 8, left: 8, background: COLORS.error,
              color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span style={{ position: 'absolute', top: 8, right: 36, background: COLORS.success,
              color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
              MỚI
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <span style={{ fontSize: 11, color: COLORS.textLight, textTransform: 'uppercase', fontWeight: 600 }}>{product.brand}</span>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, color: COLORS.text, lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </p>
          <StarRating rating={product.rating} size={13} showValue reviewCount={product.reviewCount} />
          <div style={{ marginTop: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.primary }}>{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span style={{ fontSize: 12, color: COLORS.textLight, textDecoration: 'line-through', marginLeft: 8 }}>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to cart */}
        <div style={{ padding: '0 12px 12px' }}>
          <button onClick={handleAddCart} disabled={product.stock === 0} style={{
            width: '100%', padding: '8px', borderRadius: 6, border: 'none',
            background: product.stock === 0 ? COLORS.border : isInCart(product.id) ? COLORS.successBg : COLORS.primary,
            color: product.stock === 0 ? COLORS.textLight : isInCart(product.id) ? COLORS.success : '#fff',
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13,
            transition: 'background 0.2s',
          }}>
            {product.stock === 0 ? 'Hết hàng' : isInCart(product.id) ? '✓ Đã thêm' : '🛒 Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
