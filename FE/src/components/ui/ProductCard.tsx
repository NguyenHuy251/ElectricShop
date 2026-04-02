import React from 'react';
import { Link } from 'react-router-dom';
import { CheckOutlined, EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
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
    <div className="product-card">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="product-card__image-link">
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
      </Link>

      {/* Content */}
      <div className="product-card__content">
        <span className="product-card__brand">
          {product.brand}
        </span>
        <Link
          to={`/products/${product.id}`}
          className="product-card__name"
        >
          {product.name}
        </Link>

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

        <div className="product-card__actions">
          <Button
            variant={isInCart(product.id) ? 'secondary' : 'primary'}
            size="sm"
            fullWidth
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="product-card__action-btn"
          >
            {product.stock === 0
              ? 'Hết hàng'
              : isInCart(product.id)
              ? <><CheckOutlined /> Đã thêm</>
              : <><ShoppingCartOutlined /> Thêm vào giỏ</>}
          </Button>
          <Link
            to={`/products/${product.id}`}
            title="Xem chi tiết sản phẩm"
            className="product-card__quick-view"
          >
            <EyeOutlined />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
