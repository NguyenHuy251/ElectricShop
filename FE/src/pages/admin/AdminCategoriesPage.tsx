import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { getCategoryIcon } from '../../utils/categoryIcons';
import '../../assets/styles/pages/admin-pages.css';

const AdminCategoriesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.isEmployee ?? false;

  const { categories, addCategory, editCategory, removeCategory } = useCategories();
  const { products } = useProducts();
  const [addModal, setAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', icon: '', slug: '' });

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', icon: '', slug: '' });
    setAddModal(true);
  };

  const openEdit = (id: number) => {
    const found = categories.find((item) => item.id === id);
    if (!found) {
      return;
    }

    setEditingId(id);
    setForm({
      name: found.name,
      slug: found.slug,
      icon: found.icon || '',
    });
    setAddModal(true);
  };

  const closeModal = () => {
    setAddModal(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      window.alert('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      if (editingId) {
        await editCategory(editingId, {
          tenDanhMuc: form.name.trim(),
          slug: form.slug.trim() || undefined,
        });
      } else {
        await addCategory({
          tenDanhMuc: form.name.trim(),
          slug: form.slug.trim() || undefined,
          trangThai: true,
        });
      }

      closeModal();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Khong the luu danh muc');
    }
  };

  const handleDelete = async (id: number) => {
    const shouldDelete = window.confirm('Bạn có chắc muốn xóa danh mục này không?');
    if (!shouldDelete) {
      return;
    }

    try {
      await removeCategory(id);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Khong the xoa danh muc');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý danh mục</h1>
          <p className="admin-page-subtitle">
            {categories.length} danh mục sản phẩm
          </p>
        </div>
        {!isReadOnly && <Button onClick={openAdd}><PlusOutlined /> Thêm danh mục</Button>}
      </div>

      <div className="admin-categories-grid">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="admin-categories-card">
              <div className="admin-categories-info">
                <div className="admin-categories-icon-wrap">
                  {getCategoryIcon(cat, { fontSize: '24px', color: '#2563eb' })}
                </div>
                <div>
                  <div className="admin-categories-name">{cat.name}</div>
                  <div className="admin-categories-count">{count} sản phẩm</div>
                </div>
              </div>
              {!isReadOnly ? (
                <div className="admin-table-actions">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(cat.id)}>
                    <EditOutlined />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(cat.id)}>
                    <DeleteOutlined />
                  </Button>
                </div>
              ) : (
                <span className="admin-readonly-text">Chỉ xem</span>
              )}
            </div>
          );
        })}
      </div>

      {!isReadOnly && <Modal isOpen={addModal} onClose={closeModal} title={editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'} size="sm">
        <div className="admin-form-column">
          <Input label="Tên danh mục" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input label="Icon key (AntD)" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="inbox, cloud, desktop..." />
          <Input label="Slug (URL)" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="ten-danh-muc" />
          <div className="admin-form-actions-end">
            <Button variant="ghost" onClick={closeModal}>Hủy</Button>
            <Button onClick={handleSave}>{editingId ? 'Lưu thay đổi' : 'Thêm danh mục'}</Button>
          </div>
        </div>
      </Modal>}
    </div>
  );
};

export default AdminCategoriesPage;
