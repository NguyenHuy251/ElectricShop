import React, { useEffect, useState } from 'react';
import { CalendarOutlined, ReadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { NewsArticle } from '../../types';
import { formatDate, truncate } from '../../utils/helpers';
import { getNews } from '../../services';
import '../../assets/styles/pages/content.css';

const NewsPage: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      setLoading(true);
      try {
        const response = await getNews();
        if (isMounted) {
          setNewsArticles(response.data);
        }
      } catch (error) {
        console.error('Khong the tai tin tuc:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

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
        {loading && <p>Dang tai tin tuc...</p>}
        {newsArticles.map((article) => (
          <article key={article.id} className="news-card">
            <div className="news-card-cover">
              <img
                src={`https://picsum.photos/seed/${article.slug}/800/500`}
                alt={article.tieuDe}
              />
            </div>
            <div className="news-card-body">
              <h3 className="news-card-title">{article.tieuDe}</h3>
              <p className="news-card-desc">
                {truncate(article.noiDung, 120)}
              </p>
              <div className="news-card-date">
                <CalendarOutlined /> {formatDate(article.ngayDang)}
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
