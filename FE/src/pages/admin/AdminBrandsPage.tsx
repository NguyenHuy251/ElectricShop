import React, { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../utils/apiError';
import { createBrand, deleteBrand, getBrands, updateBrand } from '../../services';
import '../../assets/styles/pages/admin-pages.css';

export interface Brand {
  id: number;
  tenThuongHieu: string;
  slug: string;
  logo: string;
  quocGia: string;
  trangThai: boolean;
}

const buildBrandFallback = (name: string): string => {
  const letter = (name || '?').charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="40" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#6b7280">${letter}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const resolveBrandLogo = (logo: string, name: string): string => {
  const trimmed = (logo || '').trim();
  if (!trimmed) return buildBrandFallback(name);
  if (/^(https?:|data:|blob:|\/\/)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return trimmed;
  return `/brands/${trimmed}`;
};

const AdminBrandsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.role !== 'admin' && (currentUser?.isEmployee ?? false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    tenThuongHieu: '',
    slug: '',
    logo: '',
    quocGia: '',
    trangThai: true,
  });

  const loadBrands = async () => {
    try {
      const response = await getBrands();
      setBrands(response.data);
    } catch (error: unknown) {
      window.alert(getApiErrorMessage(error, 'Không thể tải danh sách thương hiệu'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBrands();
  }, []);

  const filteredBrands = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return brands.filter((brand) => {
      const statusMatches =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
            ? brand.trangThai
            : !brand.trangThai;

      const searchMatches =
        !keyword ||
        [brand.tenThuongHieu, brand.slug, brand.quocGia]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword));

      return statusMatches && searchMatches;
    });
  }, [brands, search, statusFilter]);

  const handleOpenModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        tenThuongHieu: brand.tenThuongHieu,
        slug: brand.slug,
        logo: brand.logo,
        quocGia: brand.quocGia,
        trangThai: brand.trangThai,
      });
    } else {
      setEditingBrand(null);
      setFormData({
        tenThuongHieu: '',
        slug: '',
        logo: '',
        quocGia: '',
        trangThai: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenThuongHieu.trim() || !formData.slug.trim()) {
      window.alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const payload = {
      tenThuongHieu: formData.tenThuongHieu.trim(),
      slug: formData.slug.trim(),
      logo: formData.logo.trim(),
      quocGia: formData.quocGia.trim(),
      trangThai: formData.trangThai,
    };

    try {
      if (editingBrand) {
        const response = await updateBrand(editingBrand.id, payload);
        setBrands((prev) => prev.map((b) => (b.id === editingBrand.id ? response.data : b)));
        window.alert('Cập nhật thương hiệu thành công');
      } else {
        const response = await createBrand(payload);
        setBrands((prev) => [response.data, ...prev]);
        window.alert('Thêm thương hiệu thành công');
      }
      handleCloseModal();
    } catch (error: unknown) {
      window.alert(getApiErrorMessage(error, 'Không thể lưu thương hiệu'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      return;
    }
    try {
      await deleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
      window.alert('Xóa thương hiệu thành công');
    } catch (error: unknown) {
      window.alert(getApiErrorMessage(error, 'Không thể xóa thương hiệu'));
    }
  };

  const handleStatusChange = async (id: number, newStatus: boolean) => {
    const target = brands.find((b) => b.id === id);
    if (!target) return;
    try {
      const response = await updateBrand(id, {
        tenThuongHieu: target.tenThuongHieu,
        slug: target.slug,
        logo: target.logo,
        quocGia: target.quocGia,
        trangThai: newStatus,
      });
      setBrands((prev) => prev.map((b) => (b.id === id ? response.data : b)));
    } catch (error: unknown) {
      window.alert(getApiErrorMessage(error, 'Không thể cập nhật trạng thái'));
    }
  };

  return (
    <div className="admin-import-page">
      <div className="admin-page-header">
        <h1 className="admin-import-header-title">
          Quản lý Thương hiệu
        </h1>
        {!isReadOnly && (
          <button onClick={() => handleOpenModal()} className="admin-import-create-btn">
            <PlusOutlined /> Thêm thương hiệu
          </button>
        )}
      </div>

      <div className="admin-search-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
          placeholder="Tìm theo tên thương hiệu, slug hoặc quốc gia..."
        />
        <div className="admin-filter-row" style={{ marginTop: 12 }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="admin-filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm dừng</option>
          </select>
        </div>
      </div>

      <div className="admin-import-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-import-head-row">
              <th className="admin-import-th">
                ID
              </th>
              <th className="admin-import-th">
                Tên thương hiệu
              </th>
              <th className="admin-import-th">
                Logo
              </th>
              <th className="admin-import-th">
                Quốc gia
              </th>
              <th className="admin-import-th">
                Trạng thái
              </th>
              <th className="admin-import-th admin-import-th-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Đang tải danh sách thương hiệu...</td>
              </tr>
            )}
            {!isLoading && brands.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Chưa có thương hiệu nào</td>
              </tr>
            )}
            {!isLoading && filteredBrands.map((brand) => (
              <tr key={brand.id} className="admin-import-row">
                <td className="admin-import-cell">{brand.id}</td>
                <td className="admin-import-cell admin-import-cell-strong">
                  {brand.tenThuongHieu}
                </td>
                <td className="admin-import-cell admin-import-cell-muted">
                  <img
                    src={resolveBrandLogo(brand.logo, brand.tenThuongHieu)}
                    alt={brand.tenThuongHieu}
                    className="admin-brand-logo"
                    onError={(e) => {
                      const img = e.currentTarget;
                      const fallback = buildBrandFallback(brand.tenThuongHieu);
                      if (img.src !== fallback) {
                        img.src = fallback;
                      }
                    }}
                  />
                </td>
                <td className="admin-import-cell admin-import-cell-muted">{brand.quocGia}</td>
                <td className="admin-import-cell">
                  {!isReadOnly && (
                    <select
                      value={brand.trangThai ? '1' : '0'}
                      onChange={(e) => handleStatusChange(brand.id, e.target.value === '1')}
                      className="admin-employee-status-select"
                    >
                      <option value="1">Hoạt động</option>
                      <option value="0">Tạm dừng</option>
                    </select>
                  )}
                  {isReadOnly && (
                    <span className="admin-brand-status-text">
                      {brand.trangThai ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  )}
                </td>
                <td className="admin-import-cell admin-import-cell-center">
                  {!isReadOnly && (
                    <div className="admin-import-actions">
                      <button onClick={() => handleOpenModal(brand)} className="admin-import-action-btn view">
                        <EditOutlined /> Sửa
                      </button>
                      <button onClick={() => handleDelete(brand.id)} className="admin-import-action-btn delete">
                        <DeleteOutlined /> Xóa
                      </button>
                    </div>
                  )}
                  {isReadOnly && <span className="admin-readonly-text">Chỉ xem</span>}
                </td>
              </tr>
            ))}
            {!isLoading && filteredBrands.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Không tìm thấy thương hiệu phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="admin-import-modal-body">
          <h2 className="admin-import-modal-title">
            {editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-import-field">
              <label className="admin-import-label">
                Tên thương hiệu <span className="admin-import-label-required">*</span>
              </label>
              <input
                type="text"
                name="tenThuongHieu"
                value={formData.tenThuongHieu}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhập tên thương hiệu"
              />
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">
                Slug <span className="admin-import-label-required">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhập slug (ví dụ: panasonic)"
              />
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">
                Logo (tên file)
              </label>
              <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhập tên file logo"
              />
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">
                Quốc gia
              </label>
              <input
                type="text"
                name="quocGia"
                value={formData.quocGia}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhập tên quốc gia"
              />
            </div>

            <div className="admin-employee-checkbox-row">
              <input
                type="checkbox"
                name="trangThai"
                checked={formData.trangThai}
                onChange={handleInputChange}
                className="admin-employee-checkbox"
              />
              <label className="admin-employee-checkbox-label">
                Kích hoạt thương hiệu
              </label>
            </div>

            <div className="admin-import-form-actions">
              <button type="button" onClick={handleCloseModal} className="admin-import-btn cancel">
                Hủy
              </button>
              <button type="submit" className="admin-import-btn primary">
                {editingBrand ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBrandsPage;
