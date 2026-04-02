import React from 'react';
import { Link } from 'react-router-dom';
import { CheckOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import StarRating from './StarRating';
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
    <Link to={`/san-pham/${product.slug}`} className="common-product-card">
      <div className="common-product-card__inner">
        {/* Image */}
        <div className="common-product-card__image-wrap">
          <img
            src={product.images[0]}
            alt={product.name}
            className="common-product-card__image-img"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/300x225/e3f2fd/1565c0?text=${encodeURIComponent(product.brand)}`; }}
          />
          {discount > 0 && (
            <span className="common-product-card__badge common-product-card__badge--sale">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="common-product-card__badge common-product-card__badge--new">
              MỚI
            </span>
          )}
        </div>

        {/* Info */}
        <div className="common-product-card__content">
          <span className="common-product-card__brand">{product.brand}</span>
          <p className="common-product-card__name">
            {product.name}
          </p>
          <StarRating rating={product.rating} size={13} showValue reviewCount={product.reviewCount} />
          <div>
            <span className="common-product-card__price-main">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="common-product-card__price-old">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to cart */}
        <div className="common-product-card__add-wrap">
          <button
            onClick={handleAddCart}
            disabled={product.stock === 0}
            className={`common-product-card__add-btn ${
              product.stock === 0 ? 'disabled' : isInCart(product.id) ? 'in-cart' : 'primary'
            }`}
          >
            {product.stock === 0 ? 'Hết hàng' : isInCart(product.id) ? <><CheckOutlined /> Đã thêm</> : <><ShoppingCartOutlined /> Thêm vào giỏ</>}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
