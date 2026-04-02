import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/pages/admin-pages.css';

export interface Supplier {
  id: number;
  tenNhaCungCap: string;
  sdt: string;
  email: string;
  diaChi: string;
}

// Mock data - thay thế bằng API call
const initialSuppliers: Supplier[] = [
  {
    id: 1,
    tenNhaCungCap: 'Panasonic VN',
    sdt: '0901999999',
    email: 'panasonic@gmail.com',
    diaChi: 'HCM',
  },
  {
    id: 2,
    tenNhaCungCap: 'Philips VN',
    sdt: '0902999999',
    email: 'philips@gmail.com',
    diaChi: 'HN',
  },
  {
    id: 3,
    tenNhaCungCap: 'Sunhouse',
    sdt: '0903999999',
    email: 'sunhouse@gmail.com',
    diaChi: 'HN',
  },
  {
    id: 4,
    tenNhaCungCap: 'Xiaomi',
    sdt: '0904999999',
    email: 'xiaomi@gmail.com',
    diaChi: 'HCM',
  },
  {
    id: 5,
    tenNhaCungCap: 'Electrolux',
    sdt: '0905999999',
    email: 'electrolux@gmail.com',
    diaChi: 'HN',
  },
];

const AdminSuppliersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.isEmployee ?? false;

  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    tenNhaCungCap: '',
    sdt: '',
    email: '',
    diaChi: '',
  });

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        tenNhaCungCap: supplier.tenNhaCungCap,
        sdt: supplier.sdt,
        email: supplier.email,
        diaChi: supplier.diaChi,
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        tenNhaCungCap: '',
        sdt: '',
        email: '',
        diaChi: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenNhaCungCap || !formData.sdt || !formData.email) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Email không hợp lệ');
      return;
    }

    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id
            ? { ...s, ...formData }
            : s
        )
      );
    } else {
      const newSupplier: Supplier = {
        id: Math.max(...suppliers.map((s) => s.id), 0) + 1,
        ...formData,
      };
      setSuppliers((prev) => [...prev, newSupplier]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="admin-import-page">
      <div className="admin-page-header">
        <h1 className="admin-import-header-title">
          Quản lý Nhà cung cấp
        </h1>
        {!isReadOnly && (
          <button onClick={() => handleOpenModal()} className="admin-import-create-btn">
            <PlusOutlined /> Thêm nhà cung cấp
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
                Tên nhà cung cấp
              </th>
              <th className="admin-import-th">
                Điện thoại
              </th>
              <th className="admin-import-th">
                Email
              </th>
              <th className="admin-import-th">
                Địa chỉ
              </th>
              <th className="admin-import-th admin-import-th-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="admin-import-row">
                <td className="admin-import-cell admin-import-cell-strong">#{supplier.id}</td>
                <td className="admin-import-cell admin-import-cell-strong">
                  {supplier.tenNhaCungCap}
                </td>
                <td className="admin-import-cell admin-import-cell-muted">
                  <div className="admin-supplier-contact">
                    <PhoneOutlined className="admin-supplier-icon phone" />
                    {supplier.sdt}
                  </div>
                </td>
                <td className="admin-import-cell admin-import-cell-muted">
                  <div className="admin-supplier-contact">
                    <MailOutlined className="admin-supplier-icon mail" />
                    {supplier.email}
                  </div>
                </td>
                <td className="admin-import-cell admin-import-cell-muted">
                  <div className="admin-supplier-contact">
                    <EnvironmentOutlined className="admin-supplier-icon address" />
                    {supplier.diaChi}
                  </div>
                </td>
                <td className="admin-import-cell admin-import-cell-center">
                  {!isReadOnly && (
                    <div className="admin-import-actions">
                      <button onClick={() => handleOpenModal(supplier)} className="admin-import-action-btn view">
                        <EditOutlined /> Sửa
                      </button>
                      <button onClick={() => handleDelete(supplier.id)} className="admin-import-action-btn delete">
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
            {editingSupplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-import-field">
              <label className="admin-import-label">
                Tên nhà cung cấp <span className="admin-import-label-required">*</span>
              </label>
              <input
                type="text"
                name="tenNhaCungCap"
                value={formData.tenNhaCungCap}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhập tên nhà cung cấp"
              />
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">
                Điện thoại <span className="admin-import-label-required">*</span>
              </label>
              <input
                type="tel"
                name="sdt"
                value={formData.sdt}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">
                Email <span className="admin-import-label-required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhập email"
              />
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">
                Địa chỉ
              </label>
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhập địa chỉ"
              />
            </div>

            <div className="admin-import-form-actions">
              <button type="button" onClick={handleCloseModal} className="admin-import-btn cancel">
                Hủy
              </button>
              <button type="submit" className="admin-import-btn primary">
                {editingSupplier ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSuppliersPage;
