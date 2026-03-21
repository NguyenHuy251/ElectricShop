import React, { useState } from 'react';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { users } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';

const AdminUsersPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Quản lý người dùng</h1>
        <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '13px' }}>
          {users.length} người dùng đã đăng ký
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Tổng người dùng', value: users.length, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Khách hàng', value: users.filter((u) => u.role === 'user').length, color: '#10b981', bg: '#f0fdf4' },
          { label: 'Quản trị viên', value: users.filter((u) => u.role === 'admin').length, color: '#f59e0b', bg: '#fefce8' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#fff', borderRadius: '10px', padding: '16px', borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '8px 12px', border: '1.5px solid #e5e7eb',
            borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {['Người dùng', 'Email', 'Số điện thoại', 'Địa chỉ', 'Vai trò', 'Ngày tham gia'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0 }}
                    />
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.name}</div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{user.email}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{user.phone}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.address || '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge
                    bg={user.role === 'admin' ? '#fef3c7' : '#eff6ff'}
                    color={user.role === 'admin' ? '#92400e' : '#1d4ed8'}
                  >
                    {user.role === 'admin' ? <><SettingOutlined /> Admin</> : <><UserOutlined /> Khách hàng</>}
                  </Badge>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
