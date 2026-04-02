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
import '../../assets/styles/pages/admin-pages.css';

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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý sản phẩm</h1>
          <p className="admin-page-subtitle">
            {products.length} sản phẩm trong hệ thống
          </p>
        </div>
        {!isReadOnly && <Button onClick={openAdd}><PlusOutlined /> Thêm sản phẩm</Button>}
      </div>

      <div className="admin-search-wrap">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc thương hiệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-table-head-row">
              {['Sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Trạng thái', 'Thao tác'].map((h) => (
                <th key={h} className="admin-table-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const cat = categories.find((c) => c.id === product.categoryId);
              return (
                <tr key={product.id} className="admin-table-row">
                  <td className="admin-table-cell">
                    <div className="admin-product-cell-main">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="admin-product-thumb"
                      />
                      <div>
                        <div className="admin-product-name">
                          {product.name}
                        </div>
                        <div className="admin-product-brand">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="admin-table-cell-text">
                    {cat && getCategoryIcon(cat, { marginRight: 6 })} {cat?.name}
                  </td>
                  <td className="admin-table-cell">
                    <div className="admin-product-price">
                      {formatCurrency(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="admin-product-price-old">
                        {formatCurrency(product.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="admin-table-cell">
                    <span
                      className={`admin-product-stock ${
                        product.stock > 5 ? 'high' : product.stock > 0 ? 'medium' : 'low'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="admin-table-cell">
                    <div className="admin-product-status-col">
                      {product.isFeatured && (
                        <span className="admin-product-tag featured">
                          Nổi bật
                        </span>
                      )}
                      {product.isNew && (
                        <span className="admin-product-tag new">
                          Mới
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="admin-table-cell">
                    <div className="admin-table-actions">
                      {isReadOnly ? (
                        <span className="admin-readonly-text">Chỉ xem</span>
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
        <div className="admin-product-form">
          <Input label="Tên sản phẩm" value={form.name} onChange={f('name')} required />
          <div className="admin-product-form-grid-2">
            <Input label="Thương hiệu" value={form.brand} onChange={f('brand')} required />
            <div className="admin-product-field">
              <label className="admin-product-label">Danh mục</label>
              <select
                value={form.categoryId}
                onChange={f('categoryId')}
                className="admin-product-select"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-product-form-grid-3">
            <Input label="Giá hiện tại (VND)" type="number" value={String(form.price)} onChange={f('price')} required />
            <Input label="Giá gốc (VND, tùy chọn)" type="number" value={String(form.originalPrice || '')} onChange={f('originalPrice')} />
            <Input label="Tồn kho" type="number" value={String(form.stock)} onChange={f('stock')} required />
          </div>
          <div className="admin-product-field">
            <label className="admin-product-label">Mô tả ngắn</label>
            <textarea
              value={form.shortDescription}
              onChange={f('shortDescription')}
              rows={2}
              className="admin-product-textarea"
            />
          </div>
          <div className="admin-product-checkbox-row">
            <label className="admin-product-checkbox-label">
              <input type="checkbox" checked={form.isFeatured} onChange={f('isFeatured')} />
              Sản phẩm nổi bật
            </label>
            <label className="admin-product-checkbox-label">
              <input type="checkbox" checked={form.isNew} onChange={f('isNew')} />
              Sản phẩm mới
            </label>
          </div>
          <div className="admin-product-form-actions">
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
        <p className="admin-product-delete-text">
          Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
        </p>
        <div className="admin-form-actions-end">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Hủy</Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm!)}>Xác nhận xóa</Button>
        </div>
      </Modal>}
    </div>
  );
};

export default AdminProductsPage;
