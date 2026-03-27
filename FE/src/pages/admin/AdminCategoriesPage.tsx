import React, { useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { categories } from '../../data/mockData';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { getCategoryIcon } from '../../utils/categoryIcons';

const AdminCategoriesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.isEmployee ?? false;

  const { products } = useProducts();
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', icon: 'inbox', slug: '' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Quản lý danh mục</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '13px' }}>
            {categories.length} danh mục sản phẩm
          </p>
        </div>
        {!isReadOnly && <Button onClick={() => setAddModal(true)}><PlusOutlined /> Thêm danh mục</Button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              style={{
                background: '#fff', borderRadius: '12px', padding: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                border: '1.5px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: '#eff6ff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                  }}
                >
                  {getCategoryIcon(cat, { fontSize: '24px', color: '#2563eb' })}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{cat.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{count} sản phẩm</div>
                </div>
              </div>
              {!isReadOnly ? (
                <Button size="sm" variant="ghost"><EditOutlined /></Button>
              ) : (
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Chỉ xem</span>
              )}
            </div>
          );
        })}
      </div>

      {!isReadOnly && <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Thêm danh mục mới" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Tên danh mục" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input label="Icon key (AntD)" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="inbox, cloud, desktop..." />
          <Input label="Slug (URL)" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="ten-danh-muc" />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setAddModal(false)}>Hủy</Button>
            <Button onClick={() => setAddModal(false)}>Thêm danh mục</Button>
          </div>
        </div>
      </Modal>}
    </div>
  );
};

export default AdminCategoriesPage;
