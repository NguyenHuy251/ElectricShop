import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/helpers';

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
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#111827' }}>
          Quản lý Thương hiệu
        </h1>
        {!isReadOnly && (
          <button
            onClick={() => handleOpenModal()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <PlusOutlined /> Thêm thương hiệu
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                ID
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Tên thương hiệu
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Logo
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Quốc gia
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Trạng thái
              </th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', color: '#111827' }}>{brand.id}</td>
                <td style={{ padding: '16px', color: '#111827', fontWeight: 600 }}>
                  {brand.tenThuongHieu}
                </td>
                <td style={{ padding: '16px', color: '#475569' }}>
                  <img
                    src={`/brands/${brand.logo}`}
                    alt={brand.tenThuongHieu}
                    style={{ height: '40px', maxWidth: '60px', borderRadius: '4px' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/60x40?text=' +
                        brand.tenThuongHieu.charAt(0);
                    }}
                  />
                </td>
                <td style={{ padding: '16px', color: '#475569' }}>{brand.quocGia}</td>
                <td style={{ padding: '16px' }}>
                  {!isReadOnly && (
                    <select
                      value={brand.trangThai ? '1' : '0'}
                      onChange={(e) => handleStatusChange(brand.id, e.target.value === '1')}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="1">Hoạt động</option>
                      <option value="0">Tạm dừng</option>
                    </select>
                  )}
                  {isReadOnly && (
                    <span style={{ padding: '6px 10px', fontSize: '14px' }}>
                      {brand.trangThai ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  )}
                </td>
                <td
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                  }}
                >
                  {!isReadOnly && (
                    <>
                      <button
                        onClick={() => handleOpenModal(brand)}
                        style={{
                          padding: '6px 12px',
                          background: '#dbeafe',
                          color: '#0369a1',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 600,
                        }}
                      >
                        <EditOutlined /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 600,
                        }}
                      >
                        <DeleteOutlined /> Xóa
                      </button>
                    </>
                  )}
                  {isReadOnly && <span style={{ color: '#6b7280', fontSize: '13px' }}>Chỉ xem</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div style={{ padding: '24px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 700, color: '#111827' }}>
            {editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Tên thương hiệu <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="tenThuongHieu"
                value={formData.tenThuongHieu}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Nhập tên thương hiệu"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Slug <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Nhập slug (ví dụ: panasonic)"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Logo (tên file)
              </label>
              <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Nhập tên file logo"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Quốc gia
              </label>
              <input
                type="text"
                name="quocGia"
                value={formData.quocGia}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Nhập tên quốc gia"
              />
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="trangThai"
                checked={formData.trangThai}
                onChange={handleInputChange}
                style={{ cursor: 'pointer' }}
              />
              <label style={{ fontWeight: 600, color: '#111827', cursor: 'pointer' }}>
                Kích hoạt thương hiệu
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  padding: '10px 20px',
                  background: '#e5e7eb',
                  color: '#111827',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
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
