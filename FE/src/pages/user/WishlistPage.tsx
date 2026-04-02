import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { DeleteOutlined, EyeOutlined, HeartFilled, HeartOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { wishlistAtom } from '../../recoil/atoms/wishlistAtom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency, calcDiscountPercent } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import '../../assets/styles/pages/user-pages.css';

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useRecoilState(wishlistAtom);
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  const removeFromWishlist = (id: number) => setWishlist((prev) => prev.filter((p) => p.id !== id));
  const clearWishlist = () => setWishlist([]);

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="wishlist-empty__icon"><HeartOutlined /></div>
        <h2 className="wishlist-empty__title">Danh sách yêu thích trống</h2>
        <p className="wishlist-empty__desc">
          Hãy thêm những sản phẩm bạn yêu thích để dễ dàng tìm lại sau này.
        </p>
        <Button size="lg" onClick={() => navigate('/products')}>
          <ShoppingOutlined /> Khám phá sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-head">
        <h1 className="wishlist-title">
          <HeartFilled />Yêu thích ({wishlist.length} sản phẩm)
        </h1>
        <Button variant="ghost" size="sm" onClick={clearWishlist}>
          <DeleteOutlined /> Xóa tất cả
        </Button>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product) => {
          const discount = product.originalPrice
            ? calcDiscountPercent(product.originalPrice, product.price)
            : 0;

          return (
            <div key={product.id} className="wishlist-card">
              <div className="wishlist-card__image-wrap" onClick={() => navigate(`/products/${product.id}`)}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="wishlist-card__image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/240x200/e5e7eb/9ca3af?text=SP';
                  }}
                />
                {discount > 0 && <span className="wishlist-card__discount">-{discount}%</span>}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="wishlist-card__remove"
                  title="Xóa khỏi yêu thích"
                >
                  <HeartFilled />
                </button>
              </div>

              <div className="wishlist-card__body">
                <p className="wishlist-card__name">{product.name}</p>
                <div>
                  <span className="wishlist-card__price">{formatCurrency(product.price)}</span>
                  {product.originalPrice && (
                    <span className="wishlist-card__old-price">{formatCurrency(product.originalPrice)}</span>
                  )}
                </div>
              </div>

              <div className="wishlist-card__actions">
                <Button
                  fullWidth
                  size="sm"
                  variant={isInCart(product.id) ? 'secondary' : 'primary'}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Hết hàng' : isInCart(product.id) ? '✓ Đã thêm' : <><ShoppingCartOutlined /> Thêm giỏ</>}
                </Button>
                <button
                  type="button"
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="wishlist-card__detail"
                >
                  <EyeOutlined /> Chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="wishlist-footer">
        <span className="wishlist-footer__text">Thêm tất cả sản phẩm có hàng vào giỏ?</span>
        <Button
          onClick={() => {
            wishlist.filter((p) => p.stock > 0).forEach((p) => addToCart(p));
            navigate('/cart');
          }}
        >
          <ShoppingCartOutlined /> Thêm tất cả vào giỏ →
        </Button>
      </div>
    </div>
  );
};

export default WishlistPage;