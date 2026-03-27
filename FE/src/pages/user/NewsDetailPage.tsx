import React from 'react';
import { CalendarOutlined, LeftOutlined, ReadOutlined } from '@ant-design/icons';
import { Link, Navigate, useParams } from 'react-router-dom';
import { newsArticles } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';

const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = newsArticles.find((item) => item.slug === slug);

  if (!article) {
    return <Navigate to="/news" replace />;
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px 40px' }}>
      <Link
        to="/news"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          textDecoration: 'none',
          color: '#2563eb',
          fontWeight: 600,
          marginBottom: '14px',
        }}
      >
        <LeftOutlined /> Quay lại danh sách tin tức
      </Link>

      <article style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <img
          src={`https://picsum.photos/seed/${article.slug}-detail/1200/600`}
          alt={article.title}
          style={{ width: '100%', height: '360px', objectFit: 'cover' }}
        />

        <div style={{ padding: '22px' }}>
          <h1 style={{ margin: '0 0 10px', fontSize: '30px', lineHeight: 1.25, color: '#0f172a' }}>
            <ReadOutlined style={{ marginRight: 8, color: '#2563eb' }} />
            {article.title}
          </h1>

          <div style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <CalendarOutlined /> {formatDate(article.publishedAt)}
          </div>

          {article.tenNhanVienDang && (
            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
              Tác giả: <span style={{ fontWeight: 600 }}>{article.tenNhanVienDang}</span>
            </div>
          )}

          <div style={{ fontSize: '16px', lineHeight: 1.8, color: '#334155' }}>
            <p style={{ marginTop: 0 }}>{article.content}</p>
            <p>
              Nội dung chi tiết được xây dựng theo dữ liệu bảng TinTuc trong hệ thống. Khi nối API BE,
              phần này sẽ hiển thị nội dung bài viết đầy đủ từ cơ sở dữ liệu.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage;
