import React from 'react';
import { CalendarOutlined, ReadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { newsArticles } from '../../data/mockData';
import { formatDate, truncate } from '../../utils/helpers';

const NewsPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '26px 16px 36px' }}>
      <div
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1e3a5f, #0ea5e9)',
          color: '#fff',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>
          <ReadOutlined style={{ marginRight: 8 }} />Tin tức
        </h1>
        <p style={{ margin: '8px 0 0', opacity: 0.92 }}>
          Cập nhật mẹo sử dụng đồ gia dụng và thông tin mới nhất từ ElectricShop.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {newsArticles.map((article) => (
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
            <div style={{ height: '160px', background: '#dbeafe' }}>
              <img
                src={`https://picsum.photos/seed/${article.slug}/800/500`}
                alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '14px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#111827' }}>{article.title}</h3>
              <p style={{ margin: '0 0 10px', color: '#4b5563', fontSize: '14px', lineHeight: 1.5 }}>
                {truncate(article.content, 120)}
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
    </div>
  );
};

export default NewsPage;
