import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../../services';
import '../../assets/styles/pages/admin-pages.css';

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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    let isMounted = true;

    const loadEmployees = async () => {
      setLoading(true);
      try {
        const response = await getEmployees();
        if (isMounted) {
          setEmployees(response.data);
        }
      } catch (error) {
        console.error('Khong the tai nhan vien:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.maNhanVien || !formData.hoTen || !formData.email || !formData.chucVu || !formData.boPhan) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const payload = {
        maNhanVien: formData.maNhanVien,
        hoTen: formData.hoTen,
        sdt: formData.sdt,
        email: formData.email,
        diaChi: formData.diaChi,
        chucVu: formData.chucVu,
        boPhan: formData.boPhan,
        ngayVaoLam: formData.ngayVaoLam,
        luongCoBan: formData.luongCoBan ? parseFloat(formData.luongCoBan) : 0,
        trangThai: formData.trangThai,
      };

      if (editingEmployee) {
        const response = await updateEmployee(editingEmployee.id, payload);
        setEmployees((prev) => prev.map((emp) => (emp.id === editingEmployee.id ? response.data : emp)));
      } else {
        const response = await createEmployee(payload);
        setEmployees((prev) => [response.data, ...prev]);
      }

      handleCloseModal();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Khong the luu nhan vien');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await deleteEmployee(id);
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'Khong the xoa nhan vien');
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: boolean) => {
    try {
      const response = await updateEmployee(id, { trangThai: newStatus });
      setEmployees((prev) => prev.map((emp) => (emp.id === id ? response.data : emp)));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Khong the cap nhat trang thai');
    }
  };

  return (
    <div className="admin-import-page">
      <div className="admin-page-header">
        <h1 className="admin-import-header-title">
          Quản lý Nhân viên
        </h1>
        <button onClick={() => handleOpenModal()} className="admin-import-create-btn">
          <PlusOutlined /> Thêm nhân viên
        </button>
      </div>

      {loading && <div className="admin-info-box">Dang tai nhan vien...</div>}

      <div className="admin-import-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-import-head-row">
              <th className="admin-import-th">
                Mã NV
              </th>
              <th className="admin-import-th">
                Họ tên
              </th>
              <th className="admin-import-th">
                Chức vụ
              </th>
              <th className="admin-import-th">
                Bộ phận
              </th>
              <th className="admin-import-th admin-import-th-right">
                Lương
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
            {employees.map((employee) => (
              <tr key={employee.id} className="admin-import-row">
                <td className="admin-import-cell admin-import-cell-strong">
                  {employee.maNhanVien}
                </td>
                <td className="admin-import-cell">
                  {employee.hoTen}
                </td>
                <td className="admin-import-cell admin-import-cell-muted">
                  {employee.chucVu}
                </td>
                <td className="admin-import-cell admin-import-cell-muted">
                  {employee.boPhan}
                </td>
                <td className="admin-import-cell admin-import-cell-right admin-import-cell-strong">
                  {formatCurrency(employee.luongCoBan)}
                </td>
                <td className="admin-import-cell">
                  <select
                    value={employee.trangThai ? '1' : '0'}
                    onChange={(e) => handleStatusChange(employee.id, e.target.value === '1')}
                    className="admin-employee-status-select"
                  >
                    <option value="1">Hoạt động</option>
                    <option value="0">Tạm dừng</option>
                  </select>
                </td>
                <td className="admin-import-cell admin-import-cell-center">
                  <div className="admin-import-actions">
                    <button onClick={() => handleOpenModal(employee)} className="admin-import-action-btn view">
                      <EditOutlined /> Sửa
                    </button>
                    <button onClick={() => handleDelete(employee.id)} className="admin-import-action-btn delete">
                      <DeleteOutlined /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="admin-import-modal-body">
          <h2 className="admin-import-modal-title">
            {editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-import-field">
              <label className="admin-import-label">
                Mã nhân viên <span className="admin-import-label-required">*</span>
              </label>
              <input
                type="text"
                name="maNhanVien"
                value={formData.maNhanVien}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Ví dụ: NV001"
              />
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">
                Họ tên <span className="admin-import-label-required">*</span>
              </label>
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhập họ tên"
              />
            </div>

            <div className="admin-employee-grid">
              <div>
                <label className="admin-import-label">
                  Điện thoại
                </label>
                <input
                  type="tel"
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleInputChange}
                  className="admin-import-input"
                  placeholder="0901234567"
                />
              </div>
              <div>
                <label className="admin-import-label">
                  Email <span className="admin-import-label-required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="admin-import-input"
                  placeholder="email@gmail.com"
                />
              </div>
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

            <div className="admin-employee-grid">
              <div>
                <label className="admin-import-label">
                  Chức vụ <span className="admin-import-label-required">*</span>
                </label>
                <input
                  type="text"
                  name="chucVu"
                  value={formData.chucVu}
                  onChange={handleInputChange}
                  className="admin-import-input"
                  placeholder="Ví dụ: Nhân viên bán hàng"
                />
              </div>
              <div>
                <label className="admin-import-label">
                  Bộ phận <span className="admin-import-label-required">*</span>
                </label>
                <input
                  type="text"
                  name="boPhan"
                  value={formData.boPhan}
                  onChange={handleInputChange}
                  className="admin-import-input"
                  placeholder="Ví dụ: Bán hàng"
                />
              </div>
            </div>

            <div className="admin-employee-grid">
              <div>
                <label className="admin-import-label">
                  Ngày vào làm
                </label>
                <input
                  type="date"
                  name="ngayVaoLam"
                  value={formData.ngayVaoLam}
                  onChange={handleInputChange}
                  className="admin-import-input"
                />
              </div>
              <div>
                <label className="admin-import-label">
                  Lương cơ bản
                </label>
                <input
                  type="number"
                  name="luongCoBan"
                  value={formData.luongCoBan}
                  onChange={handleInputChange}
                  className="admin-import-input"
                  placeholder="0"
                  min="0"
                />
              </div>
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
                Kích hoạt nhân viên
              </label>
            </div>

            <div className="admin-import-form-actions">
              <button type="button" onClick={handleCloseModal} className="admin-import-btn cancel">
                Hủy
              </button>
              <button type="submit" className="admin-import-btn primary">
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
