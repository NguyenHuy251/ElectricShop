import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { featuredProductsSelector, newProductsSelector } from '../../recoil/selectors/productSelectors';
import ProductCard from '../../components/ui/ProductCard';
import { categories, newsArticles } from '../../data/mockData';
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

const HomePage: React.FC = () => {
  const featured = useRecoilValue(featuredProductsSelector);
  const newProducts = useRecoilValue(newProductsSelector);
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #3b82f6 100%)',
          padding: '60px 16px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>
            <ThunderboltOutlined style={{ marginRight: 8 }} />Điện gia dụng <span style={{ color: '#fbbf24' }}>chính hãng</span>
            <br />
            Giá tốt nhất thị trường
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '28px' }}>
            Hàng ngàn sản phẩm từ các thương hiệu uy tín. Bảo hành chính hãng, giao hàng toàn quốc.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/products')}
              style={{
                background: '#f59e0b', color: '#fff', border: 'none',
                padding: '14px 32px', borderRadius: '8px', fontSize: '16px',
                fontWeight: 700, cursor: 'pointer',
              }}
            >
              Mua ngay →
            </button>
            <button
              onClick={() => navigate('/products')}
              style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '2px solid rgba(255,255,255,0.4)',
                padding: '14px 32px', borderRadius: '8px', fontSize: '16px',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Xem tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            maxWidth: '1200px', margin: '0 auto',
            padding: '20px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
          }}
        >
          {[
            { icon: <InboxOutlined />, value: '10,000+', label: 'Sản phẩm' },
            { icon: <TrophyOutlined />, value: '50+', label: 'Thương hiệu' },
            { icon: <TeamOutlined />, value: '100,000+', label: 'Khách hàng' },
            { icon: <StarFilled />, value: '4.8/5', label: 'Đánh giá' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                padding: '16px',
                borderRight: i < 3 ? '1px solid #e5e7eb' : 'none',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e3a5f' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Categories */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
            Danh mục sản phẩm
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}
          >
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                style={{
                  textDecoration: 'none',
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '20px 12px',
                  textAlign: 'center',
                  border: '1.5px solid #e5e7eb',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = '#2563eb';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = '#e5e7eb';
                  el.style.transform = 'none';
                }}
              >
                <span style={{ fontSize: '32px', color: '#2563eb' }}>{getCategoryIcon(cat, { fontSize: '32px' })}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section style={{ marginBottom: '48px' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: '20px',
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
              <FireFilled style={{ marginRight: 8, color: '#f59e0b' }} />
                Sản phẩm nổi bật
            </h2>
            <Link to="/products" style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600 }}>
              Xem tất cả →
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* New Products */}
        {newProducts.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '20px',
              }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
                <GiftOutlined style={{ marginRight: 8, color: '#f59e0b' }} />Hàng mới về
              </h2>
              <Link to="/products" style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600 }}>
                Xem tất cả →
              </Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >
              {newProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* News */}
        <section style={{ marginBottom: '48px' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: '20px',
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
              <ReadOutlined style={{ marginRight: 8, color: '#2563eb' }} />Tin tức mới
            </h2>
            <Link to="/news" style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600 }}>
              Xem tất cả →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {newsArticles.slice(0, 3).map((article) => (
              <article
                key={article.id}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
                }}
              >
                <div style={{ height: '165px', background: '#dbeafe' }}>
                  <img
                    src={`https://picsum.photos/seed/${article.slug}-home/800/500`}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#111827' }}>{article.title}</h3>
                  <p style={{ margin: '0 0 10px', color: '#4b5563', fontSize: '14px', lineHeight: 1.5 }}>
                    {truncate(article.content, 110)}
                  </p>
                  <div style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CalendarOutlined /> {formatDate(article.publishedAt)}
                  </div>
                  <Link
                    to={`/news/${article.slug}`}
                    style={{
                      display: 'inline-block',
                      marginTop: '10px',
                      color: '#2563eb',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                  >
                    Đọc chi tiết →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Promotions Banner */}
        <section>
          <div
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              borderRadius: '16px',
              padding: '32px',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '28px', margin: '0 0 8px', fontWeight: 800 }}>
              <GiftOutlined style={{ marginRight: 8 }} />Flash Sale - Giảm đến 30%
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '16px', opacity: 0.9 }}>
              Ưu đãi có giới hạn! Nhanh tay sở hữu ngay hôm nay
            </p>
            <button
              onClick={() => navigate('/products')}
              style={{
                background: '#fff', color: '#ef4444',
                border: 'none', padding: '12px 32px',
                borderRadius: '8px', fontWeight: 700, fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Mua ngay
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
