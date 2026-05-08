import React, { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../utils/apiError';
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from '../../services';
import '../../assets/styles/pages/admin-pages.css';

export interface Supplier {
  id: number;
  tenNhaCungCap: string;
  sdt: string;
  email: string;
  diaChi: string;
}

const AdminSuppliersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.role !== 'admin' && (currentUser?.isEmployee ?? false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    tenNhaCungCap: '',
    sdt: '',
    email: '',
    diaChi: '',
  });

  const loadSuppliers = async () => {
    try {
      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (_error: unknown) {
      alert('Không thể tải danh sách nhà cung cấp');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return suppliers;
    }

    return suppliers.filter((supplier) => {
      return [supplier.tenNhaCungCap, supplier.sdt, supplier.email, supplier.diaChi]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword));
    });
  }, [search, suppliers]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenNhaCungCap || !formData.sdt || !formData.email) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Email không hợp lệ');
      return;
    }

    try {
      if (editingSupplier) {
        const response = await updateSupplier(editingSupplier.id, formData);
        setSuppliers((prev) => prev.map((s) => (s.id === editingSupplier.id ? response.data : s)));
      } else {
        const response = await createSupplier(formData);
        setSuppliers((prev) => [response.data, ...prev]);
        window.alert('Thêm nhà cung cấp thành công');
      }

      handleCloseModal();
    } catch (error: unknown) {
      window.alert(getApiErrorMessage(error, 'Không thể lưu nhà cung cấp'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
      return;
    }

    try {
      await deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      window.alert('Xóa nhà cung cấp thành công');
    } catch (error: unknown) {
      window.alert(getApiErrorMessage(error, 'Không thể xóa nhà cung cấp. Có thể nhà cung cấp đã phát sinh phiếu nhập.'));
    }
  };

  return (
    <div className="admin-import-page">
      <div className="admin-page-header">
        <h1 className="admin-import-header-title">Quản lý Nhà cung cấp</h1>
        {!isReadOnly && (
          <button onClick={() => handleOpenModal()} className="admin-import-create-btn">
            <PlusOutlined /> Thêm nhà cung cấp
          </button>
        )}
      </div>

      <div className="admin-search-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
          placeholder="Tìm theo tên, số điện thoại, email hoặc địa chỉ..."
        />
      </div>

      <div className="admin-import-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-import-head-row">
              <th className="admin-import-th">ID</th>
              <th className="admin-import-th">Tên nhà cung cấp</th>
              <th className="admin-import-th">Điện thoại</th>
              <th className="admin-import-th">Email</th>
              <th className="admin-import-th">Địa chỉ</th>
              <th className="admin-import-th admin-import-th-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Đang tải danh sách nhà cung cấp...</td>
              </tr>
            )}
            {!isLoading && filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="admin-import-row">
                <td className="admin-import-cell admin-import-cell-strong">#{supplier.id}</td>
                <td className="admin-import-cell admin-import-cell-strong">{supplier.tenNhaCungCap}</td>
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
                      <button onClick={() => void handleDelete(supplier.id)} className="admin-import-action-btn delete">
                        <DeleteOutlined /> Xóa
                      </button>
                    </div>
                  )}
                  {isReadOnly && <span className="admin-readonly-text">Chỉ xem</span>}
                </td>
              </tr>
            ))}
            {!isLoading && filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Chưa có nhà cung cấp nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="admin-import-modal-body">
          <h2 className="admin-import-modal-title">{editingSupplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-import-field">
              <label className="admin-import-label">Tên nhà cung cấp <span className="admin-import-label-required">*</span></label>
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
              <label className="admin-import-label">Điện thoại <span className="admin-import-label-required">*</span></label>
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
              <label className="admin-import-label">Email <span className="admin-import-label-required">*</span></label>
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
              <label className="admin-import-label">Địa chỉ</label>
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
              <button type="button" onClick={handleCloseModal} className="admin-import-btn cancel">Hủy</button>
              <button type="submit" className="admin-import-btn primary">{editingSupplier ? 'Cập nhật' : 'Thêm mới'}</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSuppliersPage;
