import React, { useEffect, useMemo, useState } from 'react';
import { ReloadOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { AuthUser } from '../../types';
import '../../assets/styles/pages/admin-pages.css';

const AdminUsersPage: React.FC = () => {
  const { currentUser, getAccounts, deleteAccount, updateAccount } = useAuth();
  const [accounts, setAccounts] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingAccount, setEditingAccount] = useState<AuthUser | null>(null);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    tenHienThi: '',
    email: '',
    sdt: '',
    diaChi: '',
    vaiTro: 'User',
  });

  const loadAccounts = async () => {
    setLoading(true);
    setError('');
    const result = await getAccounts();
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setAccounts(result.data);
  };

  useEffect(() => {
    void loadAccounts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return accounts;
    }

    return accounts.filter((u) => {
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q)
      );
    });
  }, [accounts, search]);

  const handleEdit = (account: AuthUser) => {
    setEditingAccount(account);
    let vaiTro = 'User';
    if (account.role === 'admin') {
      vaiTro = 'Admin';
    } else if (account.isEmployee) {
      vaiTro = 'Employee';
    }
    setEditForm({
      tenHienThi: account.name || '',
      email: account.email || '',
      sdt: account.phone || '',
      diaChi: account.address || '',
      vaiTro,
    });
    setEditError('');
    setEditSuccess('');
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    setEditError('');
    setEditSuccess('');
    setEditLoading(true);

    let vaiTro = 'User';
    if (editForm.vaiTro === 'Admin') {
      vaiTro = 'Admin';
    } else if (editForm.vaiTro === 'Employee') {
      vaiTro = 'Employee';
    }

    const result = await updateAccount({
      id: editingAccount.id,
      tenHienThi: editForm.tenHienThi.trim(),
      email: editForm.email.trim(),
      sdt: editForm.sdt.trim(),
      diaChi: editForm.diaChi.trim(),
      vaiTro,
    });
    setEditLoading(false);

    if (!result.success) {
      setEditError(result.message);
      return;
    }

    setEditSuccess(result.message);
    await loadAccounts();
    setTimeout(() => setEditingAccount(null), 1500);
  };

  const handleDelete = async (account: AuthUser) => {
    if (account.role === 'admin') {
      setError('Không thể xóa tài khoản quản trị');
      return;
    }

    if (account.id === currentUser?.id) {
      setError('Không thể tự xóa tài khoản đang đăng nhập');
      return;
    }

    const ok = window.confirm(`Xóa tài khoản ${account.name} (ID: ${account.id})?`);
    if (!ok) {
      return;
    }

    setDeletingId(account.id);
    const result = await deleteAccount(account.id);
    setDeletingId(null);

    if (!result.success) {
      setError(result.message);
      return;
    }

    await loadAccounts();
  };

  const totalAdmins = accounts.filter((u) => u.role === 'admin').length;
  const totalUsers = accounts.filter((u) => u.role === 'user').length;
  const totalInactive = accounts.filter((u) => u.isActive === false).length;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý tài khoản</h1>
          <p className="admin-page-subtitle">{accounts.length} tài khoản</p>
        </div>
        <Button variant="outline" onClick={() => void loadAccounts()} loading={loading}>
          <ReloadOutlined /> Làm mới
        </Button>
      </div>

      <div className="dashboard-stats-grid">
        {[
          { label: 'Tổng tài khoản', value: accounts.length, color: '#2563eb' },
          { label: 'Khách hàng', value: totalUsers, color: '#10b981' },
          { label: 'Quản trị viên', value: totalAdmins, color: '#f59e0b' },
          { label: 'Đã vô hiệu hóa', value: totalInactive, color: '#ef4444' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`admin-users-stat-card ${
              stat.color === '#2563eb' ? 'admin-stat-blue' :
              stat.color === '#10b981' ? 'admin-stat-green' :
              stat.color === '#f59e0b' ? 'admin-stat-amber' :
              'admin-stat-red'
            }`}
          >
            <div className="admin-users-stat-value">{stat.value}</div>
            <div className="admin-users-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

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
        <div className="admin-users-error">
          {error}
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-table-head-row">
              {['Tài khoản', 'Username', 'Email', 'SĐT', 'Vai trò', 'Trạng thái', 'Thao tác'].map((h) => (
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
                    <div className="admin-table-title">{account.name}</div>
                    <div className="admin-table-meta">ID: {account.id}</div>
                  </div>
                </td>
                <td className="admin-table-cell-text">{account.username || '—'}</td>
                <td className="admin-table-cell-text">{account.email || '—'}</td>
                <td className="admin-table-cell-text">{account.phone || '—'}</td>
                <td className="admin-table-cell">
                  <Badge
                    bg={
                      account.role === 'admin'
                        ? '#fef3c7'
                        : account.isEmployee
                          ? '#fce7f3'
                          : '#eff6ff'
                    }
                    color={
                      account.role === 'admin'
                        ? '#92400e'
                        : account.isEmployee
                          ? '#be185d'
                          : '#1d4ed8'
                    }
                  >
                    {account.role === 'admin' ? (
                      <span className="admin-users-role-badge">
                        <SettingOutlined /> Admin
                      </span>
                    ) : account.isEmployee ? (
                      <span className="admin-users-role-badge">
                        <UserOutlined /> Nhân viên
                      </span>
                    ) : (
                      <span className="admin-users-role-badge">
                        <UserOutlined /> Khách hàng
                      </span>
                    )}
                  </Badge>
                </td>
                <td className="admin-table-cell">
                  <Badge
                    bg={account.isActive === false ? '#fef2f2' : '#ecfdf5'}
                    color={account.isActive === false ? '#dc2626' : '#059669'}
                  >
                    {account.isActive === false ? 'Đã khóa' : 'Hoạt động'}
                  </Badge>
                </td>
                <td className="admin-table-cell admin-table-actions">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(account)}
                    disabled={account.isActive === false}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => void handleDelete(account)}
                    disabled={account.role === 'admin' || account.id === currentUser?.id || account.isActive === false}
                    loading={deletingId === account.id}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-empty-state">
                  Không tìm thấy tài khoản
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!editingAccount} onClose={() => setEditingAccount(null)} title={`Chỉnh sửa: ${editingAccount?.name}`} size="md">
        <form onSubmit={handleSubmitEdit} className="admin-users-form">
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
          <div className="admin-users-role-field">
            <label className="admin-users-role-label">Vai trò</label>
            <select
              value={editForm.vaiTro}
              onChange={(e) => setEditForm((prev) => ({ ...prev, vaiTro: e.target.value }))}
              className="admin-users-role-select"
            >
              <option value="User">Khách hàng</option>
              <option value="Employee">Nhân viên</option>
              <option value="Admin">Quản trị viên</option>
            </select>
          </div>

          {editError && (
            <div className="admin-users-error">
              {editError}
            </div>
          )}

          {editSuccess && (
            <div className="admin-users-success">
              {editSuccess}
            </div>
          )}

          <div className="admin-users-form-actions">
            <Button type="submit" size="lg" loading={editLoading}>
              Lưu thay đổi
            </Button>
            <Button type="button" size="lg" variant="secondary" onClick={() => setEditingAccount(null)}>
              Hủy
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
