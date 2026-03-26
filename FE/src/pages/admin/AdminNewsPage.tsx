import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { newsArticles as initialNewsArticles } from '../../data/mockData';
import { NewsArticle } from '../../types';
import { formatDate, truncate } from '../../utils/helpers';

type NewsFormState = {
  title: string;
  slug: string;
  content: string;
  image: string;
  publishedAt: string;
};

const emptyForm: NewsFormState = {
  title: '',
  slug: '',
  content: '',
  image: '',
  publishedAt: '',
};

const AdminNewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsArticle[]>(initialNewsArticles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState<NewsFormState>(emptyForm);

  const openCreateModal = () => {
    setEditingNews(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (news: NewsArticle) => {
    setEditingNews(news);
    setForm({
      title: news.title,
      slug: news.slug,
      content: news.content,
      image: news.image,
      publishedAt: news.publishedAt,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const handleDeleteNews = (id: number) => {
    const shouldDelete = window.confirm('Bạn có chắc muốn xóa tin tức này không?');
    if (!shouldDelete) return;
    setNewsList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.slug.trim() || !form.content.trim() || !form.publishedAt) {
      window.alert('Vui lòng nhập đầy đủ các trường bắt buộc.');
      return;
    }

    const payload: Omit<NewsArticle, 'id'> = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content.trim(),
      image: form.image.trim() || 'news-default.jpg',
      publishedAt: form.publishedAt,
    };

    if (editingNews) {
      setNewsList((prev) => prev.map((news) => (news.id === editingNews.id ? { ...news, ...payload } : news)));
    } else {
      setNewsList((prev) => {
        const nextId = prev.length > 0 ? Math.max(...prev.map((n) => n.id)) + 1 : 1;
        return [...prev, { id: nextId, ...payload }];
      });
    }

    closeModal();
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
            <FileTextOutlined style={{ marginRight: 8, color: '#2563eb' }} />Quản lý tin tức
          </h1>
          <p style={{ color: '#6b7280', margin: '6px 0 0', fontSize: '14px' }}>
            {`Tổng ${newsList.length} bài viết.`}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{ border: 'none', borderRadius: '8px', background: '#2563eb', color: '#fff', fontWeight: 700, padding: '10px 14px', cursor: 'pointer' }}
        >
          <PlusOutlined style={{ marginRight: 6 }} />Thêm tin tức
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '18px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
              {['Tiêu đề', 'Slug', 'Nội dung', 'Ngày đăng', 'Thao tác'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {newsList.map((news) => (
              <tr key={news.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '12px 10px', fontSize: '14px', fontWeight: 600 }}>{news.title}</td>
                <td style={{ padding: '12px 10px', fontSize: '14px', color: '#475569' }}>{news.slug}</td>
                <td style={{ padding: '12px 10px', fontSize: '14px', color: '#334155' }}>{truncate(news.content, 70)}</td>
                <td style={{ padding: '12px 10px', fontSize: '14px' }}>{formatDate(news.publishedAt)}</td>
                <td style={{ padding: '12px 10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(news)}
                      style={{ border: 'none', borderRadius: '7px', background: '#0ea5e9', color: '#fff', padding: '8px 10px', cursor: 'pointer' }}
                    >
                      <EditOutlined /> Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteNews(news.id)}
                      style={{ border: 'none', borderRadius: '7px', background: '#ef4444', color: '#fff', padding: '8px 10px', cursor: 'pointer' }}
                    >
                      <DeleteOutlined /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingNews ? 'Sửa tin tức' : 'Thêm tin tức mới'} size="md">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Tiêu đề *</label>
              <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Ngày đăng *</label>
              <input type="date" value={form.publishedAt} onChange={(e) => setForm((prev) => ({ ...prev, publishedAt: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Hình ảnh</label>
              <input value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} style={inputStyle} placeholder="news1.jpg" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Nội dung *</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={closeModal} style={{ ...actionBtnStyle, background: '#e2e8f0', color: '#334155' }}>
              Hủy
            </button>
            <button type="submit" style={{ ...actionBtnStyle, background: '#2563eb', color: '#fff' }}>
              {editingNews ? 'Lưu thay đổi' : 'Thêm tin tức'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#334155',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  padding: '9px 10px',
  fontSize: '14px',
  outline: 'none',
};

const actionBtnStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: '8px',
  padding: '10px 14px',
  fontWeight: 700,
  cursor: 'pointer',
};

export default AdminNewsPage;
