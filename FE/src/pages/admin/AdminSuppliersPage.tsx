import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
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
  const isReadOnly = currentUser?.isEmployee ?? false;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      alert('Khong the tai danh sach nha cung cap');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSuppliers();
  }, []);

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
      alert('Vui long nhap day du thong tin bat buoc');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Email khong hop le');
      return;
    }

    try {
      if (editingSupplier) {
        const response = await updateSupplier(editingSupplier.id, formData);
        setSuppliers((prev) => prev.map((s) => (s.id === editingSupplier.id ? response.data : s)));
      } else {
        const response = await createSupplier(formData);
        setSuppliers((prev) => [response.data, ...prev]);
      }

      handleCloseModal();
    } catch (_error: unknown) {
      alert('Khong the luu nha cung cap');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ban co chac chan muon xoa nha cung cap nay?')) {
      return;
    }

    try {
      await deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (_error: unknown) {
      alert('Khong the xoa nha cung cap. Co the nha cung cap da phat sinh phieu nhap.');
    }
  };

  return (
    <div className="admin-import-page">
      <div className="admin-page-header">
        <h1 className="admin-import-header-title">Quan ly Nha cung cap</h1>
        {!isReadOnly && (
          <button onClick={() => handleOpenModal()} className="admin-import-create-btn">
            <PlusOutlined /> Them nha cung cap
          </button>
        )}
      </div>

      <div className="admin-import-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-import-head-row">
              <th className="admin-import-th">ID</th>
              <th className="admin-import-th">Ten nha cung cap</th>
              <th className="admin-import-th">Dien thoai</th>
              <th className="admin-import-th">Email</th>
              <th className="admin-import-th">Dia chi</th>
              <th className="admin-import-th admin-import-th-center">Hanh dong</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Dang tai danh sach nha cung cap...</td>
              </tr>
            )}
            {!isLoading && suppliers.map((supplier) => (
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
                        <EditOutlined /> Sua
                      </button>
                      <button onClick={() => void handleDelete(supplier.id)} className="admin-import-action-btn delete">
                        <DeleteOutlined /> Xoa
                      </button>
                    </div>
                  )}
                  {isReadOnly && <span className="admin-readonly-text">Chi xem</span>}
                </td>
              </tr>
            ))}
            {!isLoading && suppliers.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Chua co nha cung cap nao</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="admin-import-modal-body">
          <h2 className="admin-import-modal-title">{editingSupplier ? 'Chinh sua nha cung cap' : 'Them nha cung cap moi'}</h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-import-field">
              <label className="admin-import-label">Ten nha cung cap <span className="admin-import-label-required">*</span></label>
              <input
                type="text"
                name="tenNhaCungCap"
                value={formData.tenNhaCungCap}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhap ten nha cung cap"
              />
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">Dien thoai <span className="admin-import-label-required">*</span></label>
              <input
                type="tel"
                name="sdt"
                value={formData.sdt}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhap so dien thoai"
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
                placeholder="Nhap email"
              />
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">Dia chi</label>
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleInputChange}
                className="admin-import-input"
                placeholder="Nhap dia chi"
              />
            </div>

            <div className="admin-import-form-actions">
              <button type="button" onClick={handleCloseModal} className="admin-import-btn cancel">Huy</button>
              <button type="submit" className="admin-import-btn primary">{editingSupplier ? 'Cap nhat' : 'Them moi'}</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSuppliersPage;
