import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';

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
          Quản lý Nhà cung cấp
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
            <PlusOutlined /> Thêm nhà cung cấp
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                ID
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Tên nhà cung cấp
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Điện thoại
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Email
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Địa chỉ
              </th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', color: '#111827', fontWeight: 600 }}>#{supplier.id}</td>
                <td style={{ padding: '16px', color: '#111827', fontWeight: 600 }}>
                  {supplier.tenNhaCungCap}
                </td>
                <td style={{ padding: '16px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <PhoneOutlined style={{ color: '#2563eb' }} />
                    {supplier.sdt}
                  </div>
                </td>
                <td style={{ padding: '16px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MailOutlined style={{ color: '#f59e0b' }} />
                    {supplier.email}
                  </div>
                </td>
                <td style={{ padding: '16px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <EnvironmentOutlined style={{ color: '#ef4444' }} />
                    {supplier.diaChi}
                  </div>
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
                        onClick={() => handleOpenModal(supplier)}
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
                        onClick={() => handleDelete(supplier.id)}
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
            {editingSupplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Tên nhà cung cấp <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="tenNhaCungCap"
                value={formData.tenNhaCungCap}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Nhập tên nhà cung cấp"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Điện thoại <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="tel"
                name="sdt"
                value={formData.sdt}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Email <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Nhập email"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Địa chỉ
              </label>
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Nhập địa chỉ"
              />
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
