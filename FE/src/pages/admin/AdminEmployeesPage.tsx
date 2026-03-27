import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { formatDate, formatCurrency } from '../../utils/helpers';

export interface Employee {
  id: number;
  idTaiKhoan: number;
  maNhanVien: string;
  hoTen: string;
  sdt: string;
  email: string;
  diaChi: string;
  chucVu: string;
  boPhan: string;
  ngayVaoLam: string;
  luongCoBan: number;
  trangThai: boolean;
}

// Mock data - thay thế bằng API call
const initialEmployees: Employee[] = [
  {
    id: 1,
    idTaiKhoan: 1,
    maNhanVien: 'NV001',
    hoTen: 'Admin Hệ Thống',
    sdt: '0900000000',
    email: 'admin@gmail.com',
    diaChi: 'Hà Nội',
    chucVu: 'Quản trị viên',
    boPhan: 'Vận hành',
    ngayVaoLam: '2026-03-26',
    luongCoBan: 15000000,
    trangThai: true,
  },
  {
    id: 2,
    idTaiKhoan: 2,
    maNhanVien: 'NV002',
    hoTen: 'Nguyễn Văn Hùng',
    sdt: '0901234567',
    email: 'hung@gmail.com',
    diaChi: 'HCM',
    chucVu: 'Nhân viên bán hàng',
    boPhan: 'Tổng hợp',
    ngayVaoLam: '2026-03-26',
    luongCoBan: 8000000,
    trangThai: true,
  },
  {
    id: 3,
    idTaiKhoan: 3,
    maNhanVien: 'NV003',
    hoTen: 'Trần Thị Linh',
    sdt: '0902345678',
    email: 'linh@gmail.com',
    diaChi: 'Đà Nẵng',
    chucVu: 'Nhân viên kho',
    boPhan: 'Kho hàng',
    ngayVaoLam: '2026-03-26',
    luongCoBan: 6500000,
    trangThai: true,
  },
  {
    id: 4,
    idTaiKhoan: 4,
    maNhanVien: 'NV004',
    hoTen: 'Lê Văn Tuấn',
    sdt: '0903456789',
    email: 'tuan@gmail.com',
    diaChi: 'Hải Phòng',
    chucVu: 'Nhân viên giao hàng',
    boPhan: 'Logistics',
    ngayVaoLam: '2026-03-26',
    luongCoBan: 7000000,
    trangThai: true,
  },
  {
    id: 5,
    idTaiKhoan: 5,
    maNhanVien: 'NV005',
    hoTen: 'Phạm Thị Hoa',
    sdt: '0904567890',
    email: 'hoa@gmail.com',
    diaChi: 'Cần Thơ',
    chucVu: 'Nhân viên mua hàng',
    boPhan: 'Mua hàng',
    ngayVaoLam: '2026-03-26',
    luongCoBan: 7500000,
    trangThai: true,
  },
];

const AdminEmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    maNhanVien: '',
    hoTen: '',
    sdt: '',
    email: '',
    diaChi: '',
    chucVu: '',
    boPhan: '',
    ngayVaoLam: '',
    luongCoBan: '',
    trangThai: true,
  });

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        maNhanVien: employee.maNhanVien,
        hoTen: employee.hoTen,
        sdt: employee.sdt,
        email: employee.email,
        diaChi: employee.diaChi,
        chucVu: employee.chucVu,
        boPhan: employee.boPhan,
        ngayVaoLam: employee.ngayVaoLam,
        luongCoBan: employee.luongCoBan.toString(),
        trangThai: employee.trangThai,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        maNhanVien: '',
        hoTen: '',
        sdt: '',
        email: '',
        diaChi: '',
        chucVu: '',
        boPhan: '',
        ngayVaoLam: new Date().toISOString().split('T')[0],
        luongCoBan: '',
        trangThai: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
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

    if (!formData.maNhanVien || !formData.hoTen || !formData.email || !formData.chucVu || !formData.boPhan) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                ...formData,
                luongCoBan: parseFloat(formData.luongCoBan),
              }
            : emp
        )
      );
    } else {
      const newEmployee: Employee = {
        id: Math.max(...employees.map((e) => e.id), 0) + 1,
        idTaiKhoan: Math.max(...employees.map((e) => e.idTaiKhoan), 0) + 1,
        ...formData,
        luongCoBan: parseFloat(formData.luongCoBan),
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  const handleStatusChange = (id: number, newStatus: boolean) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, trangThai: newStatus } : emp))
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
          Quản lý Nhân viên
        </h1>
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
          <PlusOutlined /> Thêm nhân viên
        </button>
      </div>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Mã NV
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Họ tên
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Chức vụ
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Bộ phận
              </th>
              <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>
                Lương
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
            {employees.map((employee) => (
              <tr key={employee.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', color: '#111827', fontWeight: 600 }}>
                  {employee.maNhanVien}
                </td>
                <td style={{ padding: '16px', color: '#111827' }}>
                  {employee.hoTen}
                </td>
                <td style={{ padding: '16px', color: '#475569' }}>
                  {employee.chucVu}
                </td>
                <td style={{ padding: '16px', color: '#475569' }}>
                  {employee.boPhan}
                </td>
                <td style={{ padding: '16px', color: '#111827', fontWeight: 600, textAlign: 'right' }}>
                  {formatCurrency(employee.luongCoBan)}
                </td>
                <td style={{ padding: '16px' }}>
                  <select
                    value={employee.trangThai ? '1' : '0'}
                    onChange={(e) => handleStatusChange(employee.id, e.target.value === '1')}
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
                  <button
                    onClick={() => handleOpenModal(employee)}
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
                    onClick={() => handleDelete(employee.id)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div style={{ padding: '24px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 700, color: '#111827' }}>
            {editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Mã nhân viên <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="maNhanVien"
                value={formData.maNhanVien}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Ví dụ: NV001"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Họ tên <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Nhập họ tên"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                  Điện thoại
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
                  placeholder="0901234567"
                />
              </div>
              <div>
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
                  placeholder="email@gmail.com"
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                  Chức vụ <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  name="chucVu"
                  value={formData.chucVu}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Ví dụ: Nhân viên bán hàng"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                  Bộ phận <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  name="boPhan"
                  value={formData.boPhan}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Ví dụ: Bán hàng"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                  Ngày vào làm
                </label>
                <input
                  type="date"
                  name="ngayVaoLam"
                  value={formData.ngayVaoLam}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                  Lương cơ bản
                </label>
                <input
                  type="number"
                  name="luongCoBan"
                  value={formData.luongCoBan}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="0"
                  min="0"
                />
              </div>
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
                Kích hoạt nhân viên
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
                {editingEmployee ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AdminEmployeesPage;
