import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { wishlistAtom } from '../../recoil/atoms/wishlistAtom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency, calcDiscountPercent } from '../../utils/helpers';
import Button from '../../components/ui/Button';

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useRecoilState(wishlistAtom);
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  const removeFromWishlist = (id: number) =>
    setWishlist((prev) => prev.filter((p) => p.id !== id));

  const clearWishlist = () => setWishlist([]);

  if (wishlist.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>❤️</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          Danh sách yêu thích trống
        </h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          Hãy thêm những sản phẩm bạn yêu thích để dễ dàng tìm lại sau này.
        </p>
        <Button size="lg" onClick={() => navigate('/products')}>
          🛍️ Khám phá sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          ❤️ Yêu thích ({wishlist.length} sản phẩm)
        </h1>
        <Button variant="ghost" size="sm" onClick={clearWishlist}>
          🗑️ Xóa tất cả
        </Button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 20,
      }}>
        {wishlist.map((product) => {
          const discount = product.originalPrice
            ? calcDiscountPercent(product.originalPrice, product.price)
            : 0;

          return (
            <div key={product.id} style={{
              background: '#fff', borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              display: 'flex', flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = '';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
              }}
            >
              {/* Image */}
              <div
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/240x200/e5e7eb/9ca3af?text=SP';
                  }}
                />
                {discount > 0 && (
                  <span style={{
                    position: 'absolute', top: 8, left: 8, background: '#ef4444',
                    color: '#fff', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                  }}>-{discount}%</span>
                )}
                {/* Remove button */}
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromWishlist(product.id); }}
                  style={{
                    position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)',
                    border: 'none', borderRadius: '50%', width: 32, height: 32,
                    cursor: 'pointer', fontSize: 16, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                  title="Xóa khỏi yêu thích"
                >
                  ❤️
                </button>
              </div>

              {/* Info */}
              <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{
                  margin: 0, fontSize: 13, fontWeight: 500, color: '#111827',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5,
                }}>
                  {product.name}
                </p>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#2563eb' }}>
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through', marginLeft: 8 }}>
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '0 14px 14px', display: 'flex', gap: 8 }}>
                <Button
                  fullWidth
                  size="sm"
                  variant={isInCart(product.id) ? 'secondary' : 'primary'}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0
                    ? 'Hết hàng'
                    : isInCart(product.id)
                    ? '✓ Đã thêm'
                    : '🛒 Thêm giỏ'}
                </Button>
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{
                    padding: '6px 10px', background: '#f3f4f6', border: 'none',
                    borderRadius: 8, cursor: 'pointer', fontSize: 13,
                    color: '#374151', fontWeight: 500, flexShrink: 0,
                  }}
                >
                  Chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Move all to cart */}
      <div style={{
        marginTop: 32, background: '#fff', borderRadius: 12, padding: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <span style={{ fontSize: 14, color: '#374151' }}>
          Thêm tất cả sản phẩm có hàng vào giỏ?
        </span>
        <Button onClick={() => {
          wishlist.filter((p) => p.stock > 0).forEach((p) => addToCart(p));
          navigate('/cart');
        }}>
          🛒 Thêm tất cả vào giỏ →
        </Button>
      </div>
    </div>
  );
};

export default WishlistPage;
