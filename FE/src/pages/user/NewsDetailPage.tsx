import React, { useEffect, useState } from 'react';
import { CalendarOutlined, LeftOutlined, ReadOutlined } from '@ant-design/icons';
import { Link, Navigate, useParams } from 'react-router-dom';
import { NewsArticle } from '../../types';
import { formatDate } from '../../utils/helpers';
import { getNewsBySlug } from '../../services';
import '../../assets/styles/pages/content.css';

const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDetail = async () => {
      if (!slug) {
        return;
      }

      setLoading(true);
      try {
        const response = await getNewsBySlug(slug);
        if (isMounted) {
          setArticle(response.data);
        }
      } catch (error) {
        console.error('Khong the tai chi tiet bai viet:', error);
        if (isMounted) {
          setArticle(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="news-detail-page">Dang tai bai viet...</div>;
  }

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
          alt={article.tieuDe}
          className="news-detail-cover"
        />

        <div className="news-detail-body">
          <h1 className="news-detail-title">
            <ReadOutlined className="news-detail-title-icon" />
            {article.tieuDe}
          </h1>

          <div className="news-detail-date">
            <CalendarOutlined /> {formatDate(article.ngayDang)}
          </div>

          {article.tenNhanVienDang && (
            <div className="news-detail-author">
              Tác giả: <span className="news-author-name">{article.tenNhanVienDang}</span>
            </div>
          )}

          <div className="news-detail-content">
            <p>{article.noiDung}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage;
