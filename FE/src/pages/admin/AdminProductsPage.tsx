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
import { deleteProductImageApi, getProductImagesApi, normalizeImageInputUrl } from '../../services/productApi';
import '../../assets/styles/pages/admin-pages.css';

const emptyProduct: Omit<Product, 'id'> = {
  name: '', slug: '', categoryId: 1, price: 0, description: '',
  shortDescription: '', images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop'],
  rating: 5, reviewCount: 0, stock: 0, brand: '', specs: {}, isFeatured: false, isNew: false,
};

const IMAGE_PLACEHOLDER = 'https://placehold.co/800x800?text=San+pham';

interface SavedImageItem {
  id: number | null;
  imageUrl: string;
}

const AdminProductsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.isEmployee ?? false;

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [savedImages, setSavedImages] = useState<SavedImageItem[]>([]);
  const [isLoadingSavedImages, setIsLoadingSavedImages] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyProduct);
    setSavedImages([]);
    setModalOpen(true);
  };

  const openEdit = async (product: Product) => {
    setEditProduct(product);
    setForm({ ...product });
    setIsLoadingSavedImages(true);

    try {
      const response = await getProductImagesApi(product.id);
      const normalizedSaved = response.data
        .map((item) => ({
          id: item.id,
          imageUrl: normalizeImageInputUrl(item.imageUrl),
        }))
        .filter((item) => !!item.imageUrl);

      const merged: SavedImageItem[] = [...normalizedSaved];
      (product.images || []).forEach((url) => {
        const normalized = normalizeImageInputUrl(url);
        if (!normalized) {
          return;
        }

        if (!merged.some((item) => item.imageUrl === normalized)) {
          merged.push({ id: null, imageUrl: normalized });
        }
      });

      setSavedImages(merged);
    } catch (error) {
      console.error('Không thể tải thư viện ảnh sản phẩm:', error);
      setSavedImages((product.images || []).map((url) => ({
        id: null,
        imageUrl: normalizeImageInputUrl(url),
      })));
    } finally {
      setIsLoadingSavedImages(false);
    }

    setModalOpen(true);
  };

  const handleSave = async () => {
    if (editProduct) {
      await updateProduct({ ...form, id: editProduct.id });
    } else {
      await addProduct({ ...form, id: Date.now() });
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
  };

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [k]: val }));
  };

  const setImageUrl = (url: string) => {
    const normalizedUrl = normalizeImageInputUrl(url);
    setForm((prev) => ({
      ...prev,
      images: normalizedUrl ? [normalizedUrl] : [],
    }));
  };

  const primaryImage = form.images[0] || '';
  const imagePreviewSrc = primaryImage || IMAGE_PLACEHOLDER;

  const handleDeleteSavedImage = async (imageId: number | null, imageUrl: string) => {
    if (!editProduct || imageId === null) {
      return;
    }

    try {
      await deleteProductImageApi(editProduct.id, imageId);
      setSavedImages((prev) => prev.filter((item) => item.id !== imageId));
      if (primaryImage === imageUrl) {
        setImageUrl('');
      }
    } catch (error) {
      console.error('Không thể xóa ảnh khỏi thư viện:', error);
    }
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
                        onError={(e) => {
                          e.currentTarget.src = IMAGE_PLACEHOLDER;
                        }}
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
          <div className="admin-product-field">
            <label className="admin-product-label">Link hình ảnh</label>
            <Input
              value={primaryImage}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
            <div className="admin-product-image-preview">
              <img
                src={imagePreviewSrc}
                alt={form.name || 'Xem trước hình ảnh sản phẩm'}
                className="admin-product-image-preview__img"
                onError={(e) => {
                  e.currentTarget.src = IMAGE_PLACEHOLDER;
                }}
              />
            </div>
            {editProduct && (
              <div className="admin-product-saved-images">
                <div className="admin-product-saved-images__title">Ảnh đã lưu của sản phẩm</div>
                {isLoadingSavedImages ? (
                  <div className="admin-product-saved-images__empty">Đang tải danh sách ảnh...</div>
                ) : savedImages.length === 0 ? (
                  <div className="admin-product-saved-images__empty">Chưa có ảnh nào trong thư viện</div>
                ) : (
                  <div className="admin-product-saved-images__grid">
                    {savedImages.map((item, index) => (
                      <button
                        key={`${item.id ?? 'local'}-${item.imageUrl}-${index}`}
                        type="button"
                        className={`admin-product-saved-images__item ${primaryImage === item.imageUrl ? 'active' : ''}`}
                        onClick={() => setImageUrl(item.imageUrl)}
                        title="Chọn ảnh này"
                      >
                        {item.id !== null && (
                          <span
                            className="admin-product-saved-images__delete"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              void handleDeleteSavedImage(item.id, item.imageUrl);
                            }}
                            title="Xóa ảnh khỏi danh sách"
                          >
                            ×
                          </span>
                        )}
                        <img
                          src={item.imageUrl}
                          alt={`Ảnh sản phẩm ${index + 1}`}
                          className="admin-product-saved-images__img"
                          onError={(e) => {
                            e.currentTarget.src = IMAGE_PLACEHOLDER;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
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
