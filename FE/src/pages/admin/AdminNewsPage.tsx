import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { newsArticles as initialNewsArticles, employees as initialEmployees } from '../../data/mockData';
import { NewsArticle } from '../../types';
import { formatDate, truncate } from '../../utils/helpers';
import '../../assets/styles/pages/admin-pages.css';

type NewsFormState = {
  title: string;
  slug: string;
  content: string;
  image: string;
  publishedAt: string;
  idNhanVienDang?: number;
  tenNhanVienDang?: string;
};

const emptyForm: NewsFormState = {
  title: '',
  slug: '',
  content: '',
  image: '',
  publishedAt: '',
  idNhanVienDang: undefined,
  tenNhanVienDang: '',
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
      idNhanVienDang: news.idNhanVienDang,
      tenNhanVienDang: news.tenNhanVienDang,
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

    let tenNhanVienDang = form.tenNhanVienDang;
    if (form.idNhanVienDang) {
      const employee = initialEmployees.find((e) => e.id === form.idNhanVienDang);
      if (employee) {
        tenNhanVienDang = employee.hoTen;
      }
    }

    const payload: Omit<NewsArticle, 'id'> = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content.trim(),
      image: form.image.trim() || 'news-default.jpg',
      publishedAt: form.publishedAt,
      idNhanVienDang: form.idNhanVienDang,
      tenNhanVienDang,
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
      <div className="admin-page-header">
        <div>
          <h1 className="dashboard-title">
            <FileTextOutlined className="admin-icon-inline" />Quản lý tin tức
          </h1>
          <p className="dashboard-subtitle">
            {`Tổng ${newsList.length} bài viết.`}
          </p>
        </div>
        <button onClick={openCreateModal} className="admin-news-add-btn">
          <PlusOutlined />Thêm tin tức
        </button>
      </div>

      <div className="admin-news-wrap">
        <table className="admin-table">
          <thead>
            <tr className="dashboard-table-head-row">
              {['Tiêu đề', 'Slug', 'Nội dung', 'Tác giả', 'Ngày đăng', 'Thao tác'].map((h) => (
                <th key={h} className="dashboard-table-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {newsList.map((news) => (
              <tr key={news.id} className="dashboard-table-row">
                <td className="admin-news-cell-title">{news.title}</td>
                <td className="admin-news-cell-muted">{news.slug}</td>
                <td className="admin-news-cell-content">{truncate(news.content, 70)}</td>
                <td className="admin-news-cell-muted">{news.tenNhanVienDang || 'N/A'}</td>
                <td className="admin-news-cell-date">{formatDate(news.publishedAt)}</td>
                <td className="admin-news-cell-date">
                  <div className="admin-news-actions">
                    <button onClick={() => openEditModal(news)} className="admin-news-action-btn edit">
                      <EditOutlined /> Sửa
                    </button>
                    <button onClick={() => handleDeleteNews(news.id)} className="admin-news-action-btn delete">
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
          <div className="admin-news-form-grid">
            <div className="admin-form-full">
              <label className="admin-form-label">Tiêu đề *</label>
              <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="admin-form-input" />
            </div>
            <div>
              <label className="admin-form-label">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} className="admin-form-input" />
            </div>
            <div>
              <label className="admin-form-label">Ngày đăng *</label>
              <input type="date" value={form.publishedAt} onChange={(e) => setForm((prev) => ({ ...prev, publishedAt: e.target.value }))} className="admin-form-input" />
            </div>
            <div>
              <label className="admin-form-label">Tác giả</label>
              <select
                value={form.idNhanVienDang || ''}
                onChange={(e) => {
                  const id = e.target.value ? parseInt(e.target.value) : undefined;
                  const selected = initialEmployees.find((emp) => emp.id === id);
                  setForm((prev) => ({
                    ...prev,
                    idNhanVienDang: id,
                    tenNhanVienDang: selected?.hoTen || '',
                  }));
                }}
                className="admin-form-select"
              >
                <option value="">Chọn tác giả</option>
                {initialEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.hoTen}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-form-full">
              <label className="admin-form-label">Hình ảnh</label>
              <input value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} className="admin-form-input" placeholder="news1.jpg" />
            </div>
            <div className="admin-form-full">
              <label className="admin-form-label">Nội dung *</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                className="admin-form-textarea"
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={closeModal} className="admin-action-btn cancel">
              Hủy
            </button>
            <button type="submit" className="admin-action-btn primary">
              {editingNews ? 'Lưu thay đổi' : 'Thêm tin tức'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminNewsPage;
