import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { categories } from '../../data/mockData';
import { formatDate, formatCurrency, calcDiscountPercent } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import ProductCard from '../../components/ui/ProductCard';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { getReplyByReviewId, upsertReply } from '../../services/reviewReplyService';
import { createReview, getReviewsByProduct } from '../../services';
import '../../assets/styles/pages/user-pages.css';

interface Review {
  id: number;
  idSanPham: number;
  idTaiKhoan: number;
  tenKhachHang: string;
  soSao: number;
  noiDung: string;
  ngayDanhGia: string;
  tenSanPham: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products } = useProducts();
  const { addToCart, isInCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const product = getProductById(Number(id));
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      if (!product) {
        return;
      }

      setReviewsLoading(true);
      try {
        const response = await getReviewsByProduct(product.id);
        if (isMounted) {
          setReviews(response.data.map((review) => ({
            id: review.id,
            idSanPham: review.idSanPham,
            idTaiKhoan: review.idTaiKhoan,
            tenKhachHang: review.tenKhachHang,
            soSao: review.soSao,
            noiDung: review.noiDung,
            ngayDanhGia: review.ngayDanhGia,
            tenSanPham: review.tenSanPham,
          })));
        }
      } catch (error) {
        console.error('Không thể tải đánh giá:', error);
        if (isMounted) {
          setReviews([]);
        }
      } finally {
        if (isMounted) {
          setReviewsLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, [product]);

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="product-not-found__icon"><AlertOutlined /></div>
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

  const reviewCount = reviews.length > 0 ? reviews.length : product.reviewCount;
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.soSao, 0) / reviews.length
    : product.rating;
  const reviewStars = Math.round(averageRating);

  const stockClass = product.stock > 5
    ? 'product-detail-stock product-detail-stock--ok'
    : product.stock > 0
      ? 'product-detail-stock product-detail-stock--low'
      : 'product-detail-stock product-detail-stock--out';

  return (
    <div className="product-detail-page">
      <nav className="product-detail-breadcrumb">
        <span className="product-detail-breadcrumb__link" onClick={() => navigate('/')}>Trang chủ</span>
        {' › '}
        <span className="product-detail-breadcrumb__link" onClick={() => navigate('/products')}>Sản phẩm</span>
        {' › '}
        <span>{category?.name}</span>
        {' › '}
        <span className="product-detail-breadcrumb__current">{product.name}</span>
      </nav>

      <div className="product-detail-main">
        <div className="product-detail-image-wrap">
          <img src={product.images[0]} alt={product.name} className="product-detail-image" />
          {discount > 0 && <span className="product-detail-discount">-{discount}%</span>}
        </div>

        <div>
          <div className="product-detail-meta">
            {category && getCategoryIcon(category)} {category?.name} • {product.brand}
          </div>

          <h1 className="product-detail-title">{product.name}</h1>

          <div className="product-detail-rating">
            <span className="product-detail-rating__stars">
              {'★'.repeat(reviewStars)}
              {'☆'.repeat(5 - reviewStars)}
            </span>
            <span className="product-detail-rating__text">
              {averageRating.toFixed(1)} ({reviewCount} đánh giá)
            </span>
          </div>

          <div className="product-detail-price-box">
            <div className="product-detail-price">{formatCurrency(product.price)}</div>
            {product.originalPrice && (
              <div className="product-detail-price-row">
                <span className="product-detail-price-old">{formatCurrency(product.originalPrice)}</span>
                <span className="product-detail-price-save">
                  Tiết kiệm {formatCurrency(product.originalPrice - product.price)}
                </span>
              </div>
            )}
          </div>

          <div className={stockClass}>
            {product.stock > 5
              ? `Còn hàng (${product.stock} sản phẩm)`
              : product.stock > 0
                ? `Chỉ còn ${product.stock} sản phẩm`
                : 'Hết hàng'}
            {product.stock > 5 ? <CheckCircleOutlined /> : product.stock > 0 ? <AlertOutlined /> : <CloseCircleOutlined />}
          </div>

          {product.stock > 0 && (
            <div className="product-detail-qty">
              <span className="product-detail-qty__label">Số lượng:</span>
              <div className="product-detail-qty__control">
                <button
                  type="button"
                  className="product-detail-qty__btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="product-detail-qty__value">{quantity}</span>
                <button
                  type="button"
                  className="product-detail-qty__btn"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="product-detail-actions">
            <Button
              className="product-detail-actions__cart"
              variant={isInCart(product.id) ? 'secondary' : 'primary'}
              size="lg"
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock === 0}
            >
              {isInCart(product.id)
                ? <><CheckCircleOutlined /> Đã thêm vào giỏ</>
                : <><ShoppingCartOutlined /> Thêm vào giỏ hàng</>}
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={() => {
                addToCart(product, quantity);
                navigate('/cart');
              }}
              disabled={product.stock === 0}
            >
              Mua ngay
            </Button>
          </div>

          <div className="product-detail-features">
            {[
              { key: 'ship', icon: <TruckOutlined />, text: 'Miễn phí vận chuyển toàn quốc' },
              { key: 'warranty', icon: <SafetyCertificateOutlined />, text: 'Bảo hành chính hãng 12 tháng' },
              { key: 'return', icon: <RollbackOutlined />, text: 'Đổi trả trong 30 ngày' },
              { key: 'cod', icon: <CreditCardOutlined />, text: 'Thanh toán khi nhận hàng' },
            ].map((benefit) => (
              <div key={benefit.key} className="product-detail-feature">
                {benefit.icon} {benefit.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="product-detail-tabs">
        <div className="product-detail-tab-head">
          {(['desc', 'specs', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? 'product-detail-tab-btn product-detail-tab-btn--active' : 'product-detail-tab-btn'}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'desc' ? 'Mô tả sản phẩm' : tab === 'specs' ? 'Thông số kỹ thuật' : `Đánh giá (${reviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'desc' && <p className="product-detail-desc">{product.description}</p>}

        {activeTab === 'specs' && (
          <table className="product-detail-specs">
            <tbody>
              {Object.entries(product.specs).map(([key, value]) => (
                <tr key={key}>
                  <td className="product-detail-specs__key">{key}</td>
                  <td className="product-detail-specs__value">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'reviews' && (
          <div>
            {currentUser && (
              <div className="product-detail-review-form">
                <h3 className="product-detail-review-form__title">Viết đánh giá của bạn</h3>
                <div className="product-detail-review-form__row">
                  <label className="product-detail-review-form__label" htmlFor="review-rating">
                    Số sao
                  </label>
                  <select
                    id="review-rating"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="product-detail-review-form__select"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} sao
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={4}
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm"
                  className="product-detail-review-form__textarea"
                />
                <div className="product-detail-review-form__actions">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={async () => {
                      if (!reviewContent.trim()) {
                        setReviewMessage('Vui lòng nhập nội dung đánh giá');
                        return;
                      }

                      setReviewSubmitting(true);
                      setReviewMessage('');
                      try {
                        await createReview({
                          idSanPham: product.id,
                          soSao: reviewRating,
                          noiDung: reviewContent.trim(),
                        });
                        const refreshed = await getReviewsByProduct(product.id);
                        setReviews(refreshed.data.map((review) => ({
                          id: review.id,
                          idSanPham: review.idSanPham,
                          idTaiKhoan: review.idTaiKhoan,
                          tenKhachHang: review.tenKhachHang,
                          soSao: review.soSao,
                          noiDung: review.noiDung,
                          ngayDanhGia: review.ngayDanhGia,
                          tenSanPham: review.tenSanPham,
                        })));
                        setReviewContent('');
                        setReviewRating(5);
                        setReviewMessage('Đã gửi đánh giá thành công');
                      } catch (error) {
                        setReviewMessage(error instanceof Error ? error.message : 'Không thể gửi đánh giá');
                      } finally {
                        setReviewSubmitting(false);
                      }
                    }}
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </Button>
                </div>
                {reviewMessage && <p className="product-detail-review-form__message">{reviewMessage}</p>}
              </div>
            )}

            {reviewsLoading ? (
              <p className="product-detail-reviews-empty">Đang tải đánh giá...</p>
            ) : reviews.length > 0 ? (
              <div className="product-detail-reviews">
                {reviews.map((review) => {
                  const reply = getReplyByReviewId(review.id);
                  return (
                    <div key={review.id} className="product-detail-review">
                      <div className="product-detail-review__head">
                        <span className="product-detail-review__name">{review.tenKhachHang}</span>
                        <span className="product-detail-review__date">{formatDate(review.ngayDanhGia)}</span>
                      </div>

                      <div className="product-detail-review__stars">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <StarOutlined
                            key={idx}
                            className={idx < review.soSao ? 'product-detail-review__star product-detail-review__star--on' : 'product-detail-review__star'}
                          />
                        ))}
                      </div>

                      <p className="product-detail-review__content">{review.noiDung}</p>

                      {reply && (
                        <div className="product-detail-reply">
                          <p className="product-detail-reply__title">Phản hồi của người bán</p>
                          <p className="product-detail-reply__text">{reply.content}</p>
                          <p className="product-detail-reply__meta">
                            {reply.repliedBy} • {formatDate(reply.repliedAt || '')}
                          </p>
                        </div>
                      )}

                      {isAdmin && (
                        <div className="product-detail-admin-reply">
                          <button
                            type="button"
                            className="product-detail-admin-reply__btn"
                            onClick={() => {
                              setReplyTargetId(review.id);
                              setReplyText(reply?.content || '');
                            }}
                          >
                            Phản hồi
                          </button>

                          {replyTargetId === review.id && (
                            <div className="product-detail-admin-reply__box">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={3}
                                placeholder="Nhập phản hồi của người bán"
                                className="product-detail-admin-reply__textarea"
                              />
                              <div className="product-detail-admin-reply__actions">
                                <button
                                  type="button"
                                  className="product-detail-admin-reply__submit"
                                  onClick={() => {
                                    if (!replyText.trim()) return;
                                    upsertReply({
                                      reviewId: review.id,
                                      content: replyText.trim(),
                                      repliedBy: currentUser?.name || 'Admin',
                                      repliedAt: new Date().toISOString(),
                                    });
                                    setReplyTargetId(null);
                                    setReplyText('');
                                  }}
                                >
                                  Gửi phản hồi
                                </button>
                                <button
                                  type="button"
                                  className="product-detail-admin-reply__cancel"
                                  onClick={() => {
                                    setReplyTargetId(null);
                                    setReplyText('');
                                  }}
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="product-detail-reviews-empty">
                Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
              </p>
            )}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="product-detail-related">
          <h2 className="product-detail-related__title">Sản phẩm liên quan</h2>
          <div className="product-detail-related__grid">
            {related.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;