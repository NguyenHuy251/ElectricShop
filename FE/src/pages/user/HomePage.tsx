import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { featuredProductsSelector, newProductsSelector } from '../../recoil/selectors/productSelectors';
import ProductCard from '../../components/ui/ProductCard';
import { NewsArticle } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import {
  CalendarOutlined,
  FireFilled,
  GiftOutlined,
  InboxOutlined,
  ReadOutlined,
  StarFilled,
  TeamOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { formatDate, truncate } from '../../utils/helpers';
import { getNews } from '../../services';
import '../../assets/styles/pages/user-pages.css';

const HomePage: React.FC = () => {
  const featured = useRecoilValue(featuredProductsSelector);
  const newProducts = useRecoilValue(newProductsSelector);
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        const response = await getNews();
        if (isMounted) {
          setNewsArticles(response.data);
        }
      } catch (error) {
        console.error('Khong the tai tin tuc:', error);
      }
    };

    void loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="user-home-page">
      <div className="user-home-hero">
        <div className="user-home-hero__inner">
          <h1 className="user-home-hero__title">
            <ThunderboltOutlined />Điện gia dụng <span className="user-home-hero__accent">chính hãng</span>
            <br />
            Giá tốt nhất thị trường
          </h1>
          <p className="user-home-hero__desc">
            Hàng ngàn sản phẩm từ các thương hiệu uy tín. Bảo hành chính hãng, giao hàng toàn quốc.
          </p>
          <div className="user-home-hero__actions">
            <button onClick={() => navigate('/products')} className="user-home-hero__btn user-home-hero__btn--primary">
              Mua ngay →
            </button>
            <button onClick={() => navigate('/products')} className="user-home-hero__btn user-home-hero__btn--secondary">
              Xem tất cả
            </button>
          </div>
        </div>
      </div>

      <div className="user-home-stats">
        <div className="user-home-stats__grid">
          {[
            { icon: <InboxOutlined />, value: '10,000+', label: 'Sản phẩm' },
            { icon: <TrophyOutlined />, value: '50+', label: 'Thương hiệu' },
            { icon: <TeamOutlined />, value: '100,000+', label: 'Khách hàng' },
            { icon: <StarFilled />, value: '4.8/5', label: 'Đánh giá' },
          ].map((stat, index) => (
            <div key={index} className="user-home-stat">
              <div className="user-home-stat__icon">{stat.icon}</div>
              <div className="user-home-stat__value">{stat.value}</div>
              <div className="user-home-stat__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="user-home-content">
        <section className="user-home-section">
          <h2 className="user-home-section__title user-home-section__title--spaced">
            Danh mục sản phẩm
          </h2>
          <div className="user-home-category-grid">
            {categories.slice(0, 8).map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="user-home-category-card">
                <span className="user-home-category-card__icon">{getCategoryIcon(cat, { fontSize: '32px' })}</span>
                <span className="user-home-category-card__name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="user-home-section">
          <div className="user-home-section__head">
            <h2 className="user-home-section__title">
              <FireFilled className="user-home-section__icon--orange" />Sản phẩm nổi bật
            </h2>
            <Link to="/products" className="user-home-section__link">
              Xem tất cả →
            </Link>
          </div>
          <div className="user-home-product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {newProducts.length > 0 && (
          <section className="user-home-section">
            <div className="user-home-section__head">
              <h2 className="user-home-section__title">
                <GiftOutlined className="user-home-section__icon--orange" />Hàng mới về
              </h2>
              <Link to="/products" className="user-home-section__link">
                Xem tất cả →
              </Link>
            </div>
            <div className="user-home-product-grid">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <section className="user-home-section">
          <div className="user-home-section__head">
            <h2 className="user-home-section__title">
              <ReadOutlined className="user-home-section__icon--blue" />Tin tức mới
            </h2>
            <Link to="/news" className="user-home-section__link">
              Xem tất cả →
            </Link>
          </div>

          <div className="user-home-news-grid">
            {newsArticles.slice(0, 3).map((article) => (
              <article key={article.id} className="user-home-news-card">
                <div className="user-home-news-card__cover">
                  <img
                    src={`https://picsum.photos/seed/${article.slug}-home/800/500`}
                    alt={article.tieuDe}
                  />
                </div>
                <div className="user-home-news-card__body">
                  <h3 className="user-home-news-card__title">{article.tieuDe}</h3>
                  <p className="user-home-news-card__desc">{truncate(article.noiDung, 110)}</p>
                  <div className="user-home-news-card__meta">
                    <CalendarOutlined /> {formatDate(article.ngayDang)}
                  </div>
                  <Link to={`/news/${article.slug}`} className="user-home-news-card__link">
                    Đọc chi tiết →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="user-home-promo">
            <h2 className="user-home-promo__title">
              <GiftOutlined />Flash Sale - Giảm đến 30%
            </h2>
            <p className="user-home-promo__desc">
              Ưu đãi có giới hạn! Nhanh tay sở hữu ngay hôm nay
            </p>
            <button onClick={() => navigate('/products')} className="user-home-promo__btn">
              Mua ngay
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;