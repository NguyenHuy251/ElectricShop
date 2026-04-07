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
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
          </span>
          <span className="product-card__rating-count">({product.reviewCount})</span>
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
