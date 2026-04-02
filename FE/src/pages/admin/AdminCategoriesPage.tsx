import React, { useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { categories } from '../../data/mockData';
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

  const { products } = useProducts();
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', icon: 'inbox', slug: '' });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý danh mục</h1>
          <p className="admin-page-subtitle">
            {categories.length} danh mục sản phẩm
          </p>
        </div>
        {!isReadOnly && <Button onClick={() => setAddModal(true)}><PlusOutlined /> Thêm danh mục</Button>}
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
                <Button size="sm" variant="ghost"><EditOutlined /></Button>
              ) : (
                <span className="admin-readonly-text">Chỉ xem</span>
              )}
            </div>
          );
        })}
      </div>

      {!isReadOnly && <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Thêm danh mục mới" size="sm">
        <div className="admin-form-column">
          <Input label="Tên danh mục" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input label="Icon key (AntD)" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="inbox, cloud, desktop..." />
          <Input label="Slug (URL)" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="ten-danh-muc" />
          <div className="admin-form-actions-end">
            <Button variant="ghost" onClick={() => setAddModal(false)}>Hủy</Button>
            <Button onClick={() => setAddModal(false)}>Thêm danh mục</Button>
          </div>
        </div>
      </Modal>}
    </div>
  );
};

export default AdminCategoriesPage;
