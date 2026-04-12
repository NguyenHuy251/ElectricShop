import React, { useEffect, useMemo, useState } from 'react';
import { ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Customer } from '../../types';
import { deleteCustomer, getCustomers, updateCustomer } from '../../services';
import '../../assets/styles/pages/admin-pages.css';

const AdminCustomersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    tenHienThi: '',
    email: '',
    sdt: '',
    diaChi: '',
  });

  const isAdmin = currentUser?.role === 'admin';

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getCustomers();
      setCustomers(result.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Khong the tai danh sach khach hang');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return customers;
    }

    return customers.filter((u) => {
      return (
        u.hoTen.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.tenDangNhap || '').toLowerCase().includes(q)
      );
    });
  }, [customers, search]);

  const handleEdit = (account: Customer) => {
    if (!isAdmin) {
      return;
    }

    setEditingCustomer(account);
    setEditForm({
      tenHienThi: account.hoTen || '',
      email: account.email || '',
      sdt: account.sdt || '',
      diaChi: account.diaChi || '',
    });
    setEditError('');
    setEditSuccess('');
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !isAdmin) return;

    setEditError('');
    setEditSuccess('');
    setEditLoading(true);

    try {
      await updateCustomer(editingCustomer.id, {
        hoTen: editForm.tenHienThi.trim(),
        email: editForm.email.trim(),
        sdt: editForm.sdt.trim(),
        diaChi: editForm.diaChi.trim(),
      });
      setEditSuccess('Cap nhat khach hang thanh cong');
      await loadCustomers();
      setTimeout(() => setEditingCustomer(null), 1000);
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Khong the cap nhat khach hang');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (account: Customer) => {
    if (!isAdmin) {
      return;
    }

    const ok = window.confirm(`Xóa khách hàng ${account.hoTen} (ID: ${account.id})?`);
    if (!ok) {
      return;
    }

    setDeletingId(account.id);
    try {
      await deleteCustomer(account.id);
      await loadCustomers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Khong the xoa khach hang');
    } finally {
      setDeletingId(null);
    }
  };

  const totalActive = customers.filter((u) => u.trangThai !== false).length;
  const totalInactive = customers.filter((u) => u.trangThai === false).length;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý khách hàng</h1>
          <p className="admin-page-subtitle">{customers.length} khách hàng</p>
        </div>
        <Button variant="outline" onClick={() => void loadCustomers()} loading={loading}>
          <ReloadOutlined /> Làm mới
        </Button>
      </div>

      <div className="admin-customers-stats">
        {[
          { label: 'Tổng khách hàng', value: customers.length, color: '#2563eb' },
          { label: 'Đang hoạt động', value: totalActive, color: '#10b981' },
          { label: 'Đã vô hiệu hóa', value: totalInactive, color: '#ef4444' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`admin-customers-stat-card ${
              stat.color === '#2563eb' ? 'admin-stat-blue' :
              stat.color === '#10b981' ? 'admin-stat-green' :
              'admin-stat-red'
            }`}
          >
            <div className="admin-customers-stat-value">{stat.value}</div>
            <div className="admin-customers-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {!isAdmin && (
        <div className="admin-info-box readonly">
          Bạn đang ở chế độ chỉ xem. Chỉ quản trị viên mới có quyền chỉnh sửa/xóa khách hàng.
        </div>
      )}

      <div className="admin-search-wrap">
        <input
          type="text"
          placeholder="Tìm theo tên hiển thị, username hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
      </div>

      {error && (
        <div className="admin-info-box error">
          {error}
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-table-head-row">
              {['Khách hàng', 'Username', 'Email', 'SĐT', 'Trạng thái', ...(isAdmin ? ['Thao tác'] : [])].map((h) => (
                <th key={h} className="admin-table-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((account) => (
              <tr key={account.id} className="admin-table-row">
                <td className="admin-table-cell">
                  <div>
                    <div className="admin-table-title">{account.hoTen}</div>
                    <div className="admin-table-meta">ID: {account.id}</div>
                  </div>
                </td>
                <td className="admin-table-cell-text">{account.tenDangNhap || '—'}</td>
                <td className="admin-table-cell-text">{account.email || '—'}</td>
                <td className="admin-table-cell-text">{account.sdt || '—'}</td>
                <td className="admin-table-cell">
                  <Badge
                    bg={account.trangThai === false ? '#fef2f2' : '#ecfdf5'}
                    color={account.trangThai === false ? '#dc2626' : '#059669'}
                  >
                    {account.trangThai === false ? 'Đã khóa' : 'Hoạt động'}
                  </Badge>
                </td>
                {isAdmin && (
                  <td className="admin-table-cell admin-table-actions">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(account)}
                      disabled={account.trangThai === false}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => void handleDelete(account)}
                      disabled={account.trangThai === false}
                      loading={deletingId === account.id}
                    >
                      Xóa
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="admin-empty-state">
                  Không tìm thấy khách hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!editingCustomer} onClose={() => setEditingCustomer(null)} title={`Chỉnh sửa: ${editingCustomer?.hoTen}`} size="md">
        <form onSubmit={handleSubmitEdit} className="admin-form-column">
          <Input
            label="Họ và tên"
            value={editForm.tenHienThi}
            onChange={(e) => setEditForm((prev) => ({ ...prev, tenHienThi: e.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <Input
            label="Số điện thoại"
            value={editForm.sdt}
            onChange={(e) => setEditForm((prev) => ({ ...prev, sdt: e.target.value }))}
          />
          <Input
            label="Địa chỉ"
            value={editForm.diaChi}
            onChange={(e) => setEditForm((prev) => ({ ...prev, diaChi: e.target.value }))}
          />

          {editError && (
            <div className="admin-info-box error">
              {editError}
            </div>
          )}

          {editSuccess && (
            <div className="admin-info-box success">
              {editSuccess}
            </div>
          )}

          <div className="admin-table-actions">
            <Button type="submit" size="lg" loading={editLoading}>
              Lưu thay đổi
            </Button>
            <Button type="button" size="lg" variant="secondary" onClick={() => setEditingCustomer(null)}>
              Hủy
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCustomersPage;