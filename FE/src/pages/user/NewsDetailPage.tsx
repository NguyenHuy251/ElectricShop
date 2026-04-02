import React from 'react';
import { CalendarOutlined, LeftOutlined, ReadOutlined } from '@ant-design/icons';
import { Link, Navigate, useParams } from 'react-router-dom';
import { newsArticles } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';
import '../../assets/styles/pages/content.css';

const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = newsArticles.find((item) => item.slug === slug);

  if (!article) {
    return <Navigate to="/news" replace />;
  }

  return (
    <div className="news-detail-page">
      <Link to="/news" className="news-back-link">
        <LeftOutlined /> Quay lại danh sách tin tức
      </Link>

      <article className="news-detail-article">
        <img
          src={`https://picsum.photos/seed/${article.slug}-detail/1200/600`}
          alt={article.title}
          className="news-detail-cover"
        />

        <div className="news-detail-body">
          <h1 className="news-detail-title">
            <ReadOutlined className="news-detail-title-icon" />
            {article.title}
          </h1>

          <div className="news-detail-date">
            <CalendarOutlined /> {formatDate(article.publishedAt)}
          </div>

          {article.tenNhanVienDang && (
            <div className="news-detail-author">
              Tác giả: <span className="news-author-name">{article.tenNhanVienDang}</span>
            </div>
          )}

          <div className="news-detail-content">
            <p>{article.content}</p>
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
