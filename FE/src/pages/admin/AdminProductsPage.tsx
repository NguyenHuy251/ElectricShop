import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../hooks/useAuth';
import { categories } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Product } from '../../types';
import { getCategoryIcon } from '../../utils/categoryIcons';

const emptyProduct: Omit<Product, 'id'> = {
  name: '', slug: '', categoryId: 1, price: 0, description: '',
  shortDescription: '', images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop'],
  rating: 5, reviewCount: 0, stock: 0, brand: '', specs: {}, isFeatured: false, isNew: false,
};

const AdminProductsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.isEmployee ?? false;

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({ ...product });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editProduct) {
      updateProduct({ ...form, id: editProduct.id });
    } else {
      addProduct({ ...form, id: Date.now() });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [k]: val }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Quản lý sản phẩm</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '13px' }}>
            {products.length} sản phẩm trong hệ thống
          </p>
        </div>
        {!isReadOnly && <Button onClick={openAdd}><PlusOutlined /> Thêm sản phẩm</Button>}
      </div>

      {/* Search */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc thương hiệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '8px 12px', border: '1.5px solid #e5e7eb',
            borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {['Sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Trạng thái', 'Thao tác'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const cat = categories.find((c) => c.id === product.categoryId);
              return (
                <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>
                    {cat && getCategoryIcon(cat, { marginRight: 6 })} {cat?.name}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb' }}>
                      {formatCurrency(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'line-through' }}>
                        {formatCurrency(product.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        fontSize: '13px', fontWeight: 600,
                        color: product.stock > 5 ? '#10b981' : product.stock > 0 ? '#f59e0b' : '#ef4444',
                      }}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {product.isFeatured && (
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                          Nổi bật
                        </span>
                      )}
                      {product.isNew && (
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', background: '#f0fdf4', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                          Mới
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {isReadOnly ? (
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Chỉ xem</span>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => openEdit(product)}>
                            <EditOutlined /> Sửa
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(product.id)}>
                            <DeleteOutlined />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {!isReadOnly && (
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        size="lg"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Tên sản phẩm" value={form.name} onChange={f('name')} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Thương hiệu" value={form.brand} onChange={f('brand')} required />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Danh mục</label>
              <select
                value={form.categoryId}
                onChange={f('categoryId')}
                style={{ padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <Input label="Giá hiện tại (VND)" type="number" value={String(form.price)} onChange={f('price')} required />
            <Input label="Giá gốc (VND, tùy chọn)" type="number" value={String(form.originalPrice || '')} onChange={f('originalPrice')} />
            <Input label="Tồn kho" type="number" value={String(form.stock)} onChange={f('stock')} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Mô tả ngắn</label>
            <textarea
              value={form.shortDescription}
              onChange={f('shortDescription')}
              rows={2}
              style={{ padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" checked={form.isFeatured} onChange={f('isFeatured')} />
              Sản phẩm nổi bật
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" checked={form.isNew} onChange={f('isNew')} />
              Sản phẩm mới
            </label>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>
              {editProduct ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </div>
      </Modal>
      )}

      {/* Delete Confirm Modal */}
      {!isReadOnly && <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Xác nhận xóa" size="sm">
        <p style={{ margin: '0 0 20px', color: '#374151' }}>
          Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Hủy</Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm!)}>Xác nhận xóa</Button>
        </div>
      </Modal>}
    </div>
  );
};

export default AdminProductsPage;
