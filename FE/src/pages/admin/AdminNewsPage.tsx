import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { Employee, NewsArticle } from '../../types';
import { formatDate, truncate } from '../../utils/helpers';
import { createNews, deleteNews, getEmployees, getNews, updateNews } from '../../services';
import '../../assets/styles/pages/admin-pages.css';

type NewsFormState = {
  tieuDe: string;
  slug: string;
  noiDung: string;
  hinhAnh: string;
  ngayDang: string;
  idNhanVienDang?: number;
  tenNhanVienDang?: string;
};

const emptyForm: NewsFormState = {
  tieuDe: '',
  slug: '',
  noiDung: '',
  hinhAnh: '',
  ngayDang: '',
  idNhanVienDang: undefined,
  tenNhanVienDang: '',
};

const AdminNewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState<NewsFormState>(emptyForm);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const [newsResponse, employeeResponse] = await Promise.all([getNews(), getEmployees()]);
        if (isMounted) {
          setNewsList(newsResponse.data);
          setEmployees(employeeResponse.data);
        }
      } catch (error) {
        console.error('Khong the tai du lieu tin tuc:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingNews(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (news: NewsArticle) => {
    setEditingNews(news);
    setForm({
      tieuDe: news.tieuDe,
      slug: news.slug,
      noiDung: news.noiDung,
      hinhAnh: news.hinhAnh,
      ngayDang: news.ngayDang,
      idNhanVienDang: news.idNhanVienDang,
      tenNhanVienDang: news.tenNhanVienDang,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const handleDeleteNews = async (id: number) => {
    const shouldDelete = window.confirm('Bạn có chắc muốn xóa tin tức này không?');
    if (!shouldDelete) return;
    try {
      await deleteNews(id);
      setNewsList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Khong the xoa tin tuc');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.tieuDe.trim() || !form.slug.trim() || !form.noiDung.trim() || !form.ngayDang) {
      window.alert('Vui lòng nhập đầy đủ các trường bắt buộc.');
      return;
    }

    let tenNhanVienDang = form.tenNhanVienDang;
    if (form.idNhanVienDang) {
      const employee = employees.find((e) => e.id === form.idNhanVienDang);
      if (employee) {
        tenNhanVienDang = employee.hoTen;
      }
    }

    const payload: Omit<NewsArticle, 'id'> = {
      tieuDe: form.tieuDe.trim(),
      slug: form.slug.trim(),
      noiDung: form.noiDung.trim(),
      hinhAnh: form.hinhAnh.trim() || 'news-default.jpg',
      ngayDang: form.ngayDang,
      idNhanVienDang: form.idNhanVienDang,
      tenNhanVienDang,
    };

    try {
      if (editingNews) {
        const response = await updateNews(editingNews.id, payload);
        setNewsList((prev) => prev.map((news) => (news.id === editingNews.id ? response.data : news)));
      } else {
        const response = await createNews(payload);
        setNewsList((prev) => [response.data, ...prev]);
      }

      closeModal();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Khong the luu tin tuc');
    }
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
        {loading && <div className="admin-info-box">Dang tai tin tuc...</div>}
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
                <td className="admin-news-cell-title">{news.tieuDe}</td>
                <td className="admin-news-cell-muted">{news.slug}</td>
                <td className="admin-news-cell-content">{truncate(news.noiDung, 70)}</td>
                <td className="admin-news-cell-muted">{news.tenNhanVienDang || 'N/A'}</td>
                <td className="admin-news-cell-date">{formatDate(news.ngayDang)}</td>
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
              <input value={form.tieuDe} onChange={(e) => setForm((prev) => ({ ...prev, tieuDe: e.target.value }))} className="admin-form-input" />
            </div>
            <div>
              <label className="admin-form-label">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} className="admin-form-input" />
            </div>
            <div>
              <label className="admin-form-label">Ngày đăng *</label>
              <input type="date" value={form.ngayDang} onChange={(e) => setForm((prev) => ({ ...prev, ngayDang: e.target.value }))} className="admin-form-input" />
            </div>
            <div>
              <label className="admin-form-label">Tác giả</label>
              <select
                value={form.idNhanVienDang || ''}
                onChange={(e) => {
                  const id = e.target.value ? parseInt(e.target.value) : undefined;
                  const selected = employees.find((emp) => emp.id === id);
                  setForm((prev) => ({
                    ...prev,
                    idNhanVienDang: id,
                    tenNhanVienDang: selected?.hoTen || '',
                  }));
                }}
                className="admin-form-select"
              >
                <option value="">Chọn tác giả</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.hoTen}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-form-full">
              <label className="admin-form-label">Hình ảnh</label>
              <input value={form.hinhAnh} onChange={(e) => setForm((prev) => ({ ...prev, hinhAnh: e.target.value }))} className="admin-form-input" placeholder="news1.jpg" />
            </div>
            <div className="admin-form-full">
              <label className="admin-form-label">Nội dung *</label>
              <textarea
                value={form.noiDung}
                onChange={(e) => setForm((prev) => ({ ...prev, noiDung: e.target.value }))}
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
