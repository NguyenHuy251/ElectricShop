import React from 'react';
import { CalendarOutlined, ReadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { newsArticles } from '../../data/mockData';
import { formatDate, truncate } from '../../utils/helpers';
import '../../assets/styles/pages/content.css';

const NewsPage: React.FC = () => {
  return (
    <div className="news-page">
      <div className="news-hero">
        <h1 className="news-hero-title">
          <ReadOutlined className="news-hero-icon" />Tin tức
        </h1>
        <p className="news-hero-desc">
          Cập nhật mẹo sử dụng đồ gia dụng và thông tin mới nhất từ ElectricShop.
        </p>
      </div>

      <div className="news-grid">
        {newsArticles.map((article) => (
          <article key={article.id} className="news-card">
            <div className="news-card-cover">
              <img
                src={`https://picsum.photos/seed/${article.slug}/800/500`}
                alt={article.title}
              />
            </div>
            <div className="news-card-body">
              <h3 className="news-card-title">{article.title}</h3>
              <p className="news-card-desc">
                {truncate(article.content, 120)}
              </p>
              <div className="news-card-date">
                <CalendarOutlined /> {formatDate(article.publishedAt)}
              </div>
              {article.tenNhanVienDang && (
                <div className="news-card-author">
                  Tác giả: <span className="news-author-name">{article.tenNhanVienDang}</span>
                </div>
              )}
              <Link to={`/news/${article.slug}`} className="news-read-link">
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
