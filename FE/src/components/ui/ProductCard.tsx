import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency, calcDiscountPercent } from '../../utils/helpers';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = product.originalPrice
    ? calcDiscountPercent(product.originalPrice, product.price)
    : 0;

  const rating = Math.round(product.rating);
  const reviewCount = product.reviewCount || 0;
  const stock = product.stock || 0;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {/* Image */}
      <div className="product-card__image-link">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card__image"
        />
        {discount > 0 && (
          <span className="product-card__badge product-card__badge--sale">
            -{discount}%
          </span>
        )}
        {product.isNew && (
          <span className="product-card__badge product-card__badge--new">
            Mới
          </span>
        )}
      </div>

      {/* Content */}
      <div className="product-card__content">
        <span className="product-card__brand">
          {product.brand}
        </span>
        <div className="product-card__name">
          {product.name}
        </div>

        {/* Rating */}
        <div className="product-card__rating">
          <span className="product-card__rating-stars">
            {'★'.repeat(rating)}
            {'☆'.repeat(5 - rating)}
          </span>
          <span className="product-card__rating-count">({reviewCount})</span>
        </div>

        {/* Stock Info */}
        <div className="product-card__stock-info">
          <div className="product-card__stock-line">
            Đã bán: <span className="product-card__stock-value">{reviewCount}</span>
          </div>
          <div className={`product-card__stock-badge ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {stock > 0 ? `Còn hàng (${stock} sản phẩm)` : 'Hết hàng'}
          </div>
        </div>

        {/* Price */}
        <div className="product-card__price">
          <div className="product-card__price-main">
            {formatCurrency(product.price)}
          </div>
          {product.originalPrice && (
            <div className="product-card__price-old">
              {formatCurrency(product.originalPrice)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
