import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/pages/admin-pages.css';

export interface Brand {
  id: number;
  tenThuongHieu: string;
  slug: string;
  logo: string;
  quocGia: string;
  trangThai: boolean;
}

// Mock data - thay thế bằng API call
const initialBrands: Brand[] = [
  {
    id: 1,
    tenThuongHieu: 'Panasonic',
    slug: 'panasonic',
    logo: 'panasonic.png',
    quocGia: 'Japan',
    trangThai: true,
  },
  {
    id: 2,
    tenThuongHieu: 'Philips',
    slug: 'philips',
    logo: 'philips.png',
    quocGia: 'Netherlands',
    trangThai: true,
  },
  {
    id: 3,
    tenThuongHieu: 'Xiaomi',
    slug: 'xiaomi',
    logo: 'xiaomi.png',
    quocGia: 'China',
    trangThai: true,
  },
  {
    id: 4,
    tenThuongHieu: 'Sunhouse',
    slug: 'sunhouse',
    logo: 'sunhouse.png',
    quocGia: 'Vietnam',
    trangThai: true,
  },
  {
    id: 5,
    tenThuongHieu: 'Electrolux',
    slug: 'electrolux',
    logo: 'electrolux.png',
    quocGia: 'Sweden',
    trangThai: true,
  },
];

const AdminBrandsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.isEmployee ?? false;

  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    tenThuongHieu: '',
    slug: '',
    logo: '',
    quocGia: '',
    trangThai: true,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenThuongHieu || !formData.slug) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (editingBrand) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingBrand.id
            ? { ...b, ...formData }
            : b
        )
      );
    } else {
      const newBrand: Brand = {
        id: Math.max(...brands.map((b) => b.id)) + 1,
        ...formData,
      };
      setBrands((prev) => [...prev, newBrand]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleStatusChange = (id: number, newStatus: boolean) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, trangThai: newStatus } : b))
    );
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
            {brands.map((brand) => (
              <tr key={brand.id} className="admin-import-row">
                <td className="admin-import-cell">{brand.id}</td>
                <td className="admin-import-cell admin-import-cell-strong">
                  {brand.tenThuongHieu}
                </td>
                <td className="admin-import-cell admin-import-cell-muted">
                  <img
                    src={`/brands/${brand.logo}`}
                    alt={brand.tenThuongHieu}
                    className="admin-brand-logo"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/60x40?text=' +
                        brand.tenThuongHieu.charAt(0);
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
