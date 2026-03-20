import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: '📦', label: 'Sản phẩm' },
  { to: '/admin/orders', icon: '🛒', label: 'Đơn hàng' },
  { to: '/admin/users', icon: '👥', label: 'Người dùng' },
  { to: '/admin/categories', icon: '📁', label: 'Danh mục' },
];

const AdminSidebar: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      style={{
        width: '240px',
        minHeight: '100vh',
        background: '#1e3a5f',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>ElectricShop</div>
            <div style={{ fontSize: '11px', color: '#93c5fd' }}>Quản trị hệ thống</div>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <img
          src={currentUser?.avatar}
          alt={currentUser?.name}
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{currentUser?.name}</div>
          <div style={{ fontSize: '11px', color: '#93c5fd' }}>Administrator</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 16px',
              textDecoration: 'none',
              color: isActive ? '#fff' : '#93c5fd',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
              fontSize: '14px',
              transition: 'all 0.15s',
            })}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            width: '100%', padding: '10px 12px',
            background: 'rgba(255,255,255,0.07)', border: 'none',
            borderRadius: '8px', cursor: 'pointer', color: '#93c5fd', fontSize: '13px',
            marginBottom: '6px',
          }}
        >
          🏪 Xem cửa hàng
        </button>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            width: '100%', padding: '10px 12px',
            background: 'rgba(239,68,68,0.15)', border: 'none',
            borderRadius: '8px', cursor: 'pointer', color: '#fca5a5', fontSize: '13px',
          }}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
