import React, { useEffect, useMemo, useState } from 'react';
import { ReloadOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { AuthUser } from '../../types';

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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Quản lý tài khoản</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '13px' }}>{accounts.length} tài khoản</p>
        </div>
        <Button variant="outline" onClick={() => void loadAccounts()} loading={loading}>
          <ReloadOutlined /> Làm mới
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Tổng tài khoản', value: accounts.length, color: '#2563eb' },
          { label: 'Khách hàng', value: totalUsers, color: '#10b981' },
          { label: 'Quản trị viên', value: totalAdmins, color: '#f59e0b' },
          { label: 'Đã vô hiệu hóa', value: totalInactive, color: '#ef4444' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#fff', borderRadius: '10px', padding: '16px', borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Tìm theo tên hiển thị, username hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1.5px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {error && (
        <div
          style={{
            marginBottom: '12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '10px 12px',
            color: '#dc2626',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {['Tài khoản', 'Username', 'Email', 'SĐT', 'Vai trò', 'Trạng thái', 'Thao tác'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((account) => (
              <tr key={account.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={account.avatar}
                      alt={account.name}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{account.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {account.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{account.username || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{account.email || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{account.phone || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
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
                      <>
                        <SettingOutlined /> Admin
                      </>
                    ) : account.isEmployee ? (
                      <>
                        <UserOutlined /> Nhân viên
                      </>
                    ) : (
                      <>
                        <UserOutlined /> Khách hàng
                      </>
                    )}
                  </Badge>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge
                    bg={account.isActive === false ? '#fef2f2' : '#ecfdf5'}
                    color={account.isActive === false ? '#dc2626' : '#059669'}
                  >
                    {account.isActive === false ? 'Đã khóa' : 'Hoạt động'}
                  </Badge>
                </td>
                <td style={{ padding: '12px 16px', display: 'flex', gap: '6px' }}>
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
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                  Không tìm thấy tài khoản
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!editingAccount} onClose={() => setEditingAccount(null)} title={`Chỉnh sửa: ${editingAccount?.name}`} size="md">
        <form onSubmit={handleSubmitEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Vai trò</label>
            <select
              value={editForm.vaiTro}
              onChange={(e) => setEditForm((prev) => ({ ...prev, vaiTro: e.target.value }))}
              style={{
                padding: '10px 12px',
                border: '1.5px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            >
              <option value="User">Khách hàng</option>
              <option value="Employee">Nhân viên</option>
              <option value="Admin">Quản trị viên</option>
            </select>
          </div>

          {editError && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#dc2626',
                fontSize: '13px',
              }}
            >
              {editError}
            </div>
          )}

          {editSuccess && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#166534',
                fontSize: '13px',
              }}
            >
              {editSuccess}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
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
