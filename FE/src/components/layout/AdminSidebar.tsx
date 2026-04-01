import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  FolderOutlined,
  GiftOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  CreditCardOutlined,
  HomeOutlined,
  MessageOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/admin', icon: <BarChartOutlined />, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: <AppstoreOutlined />, label: 'Sản phẩm' },
  { to: '/admin/orders', icon: <ShoppingCartOutlined />, label: 'Đơn hàng' },
  { to: '/admin/categories', icon: <FolderOutlined />, label: 'Danh mục' },
  { to: '/admin/vouchers', icon: <GiftOutlined />, label: 'Voucher' },
  { to: '/admin/news', icon: <FileTextOutlined />, label: 'Tin tức' },
];

const employeeNavItems = [
  { to: '/admin', icon: <BarChartOutlined />, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: <AppstoreOutlined />, label: 'Sản phẩm' },
  { to: '/admin/orders', icon: <ShoppingCartOutlined />, label: 'Đơn hàng' },
  { to: '/admin/categories', icon: <FolderOutlined />, label: 'Danh mục' },
  { to: '/admin/vouchers', icon: <GiftOutlined />, label: 'Voucher' },
  { to: '/admin/news', icon: <FileTextOutlined />, label: 'Tin tức' },
];

const AdminSidebar: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployee = currentUser?.isEmployee ?? false;
  const visibleNavItems = isEmployee ? employeeNavItems : navItems;
  const isUserManagementActive =
    location.pathname === '/admin/accounts' ||
    location.pathname === '/admin/employees' ||
    location.pathname === '/admin/customers';
  const isImportManagementActive =
    location.pathname === '/admin/brands' ||
    location.pathname === '/admin/suppliers' ||
    location.pathname === '/admin/import-receipts';
  const isCustomerCareActive =
    location.pathname === '/admin/reviews' ||
    location.pathname === '/admin/contacts';
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(isUserManagementActive);
  const [isImportManagementOpen, setIsImportManagementOpen] = useState(isImportManagementActive);
  const [isCustomerCareOpen, setIsCustomerCareOpen] = useState(isCustomerCareActive);

  useEffect(() => {
    if (isUserManagementActive) {
      setIsUserManagementOpen(true);
    }
  }, [isUserManagementActive]);

  useEffect(() => {
    if (isImportManagementActive) {
      setIsImportManagementOpen(true);
    }
  }, [isImportManagementActive]);

  useEffect(() => {
    if (isCustomerCareActive) {
      setIsCustomerCareOpen(true);
    }
  }, [isCustomerCareActive]);

  const userManagementItems = useMemo(() => {
    if (isEmployee) {
      return [{ to: '/admin/customers', icon: <TeamOutlined />, label: 'Khách hàng' }];
    }

    return [
      { to: '/admin/accounts', icon: <TeamOutlined />, label: 'Tài khoản' },
      { to: '/admin/employees', icon: <UserOutlined />, label: 'Nhân viên' },
      { to: '/admin/customers', icon: <TeamOutlined />, label: 'Khách hàng' },
    ];
  }, [isEmployee]);

  const importManagementItems = useMemo(() => {
    return [
      { to: '/admin/brands', icon: <HomeOutlined />, label: 'Thương hiệu' },
      { to: '/admin/suppliers', icon: <CreditCardOutlined />, label: 'Nhà cung cấp' },
      { to: '/admin/import-receipts', icon: <ShoppingCartOutlined />, label: 'Phiếu nhập' },
    ];
  }, []);

  const customerCareItems = useMemo(() => {
    if (isEmployee) {
      return [];
    }

    return [
      { to: '/admin/reviews', icon: <StarOutlined />, label: 'Đánh giá' },
      { to: '/admin/contacts', icon: <MessageOutlined />, label: 'Liên hệ' },
    ];
  }, [isEmployee]);

  return (
    <aside
      style={{
        width: '240px',
        height: '100vh',
        background: '#1e3a5f',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        overflow: 'hidden',
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
          <ThunderboltOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />
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
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{currentUser?.name}</div>
          <div style={{ fontSize: '11px', color: '#93c5fd' }}>{isEmployee ? 'Employee' : 'Administrator'}</div>
        </div>
        <button
          onClick={logout}
          title="Đăng xuất"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(252,165,165,0.35)',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#fca5a5',
            fontSize: '16px',
            flexShrink: 0,
          }}
        >
          <LogoutOutlined />
        </button>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: '8px 0',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
        }}
      >
        {visibleNavItems.map((item) => (
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

        <button
          onClick={() => setIsUserManagementOpen((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '10px',
            padding: '11px 16px',
            background: isUserManagementActive ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: 'none',
            borderLeft: isUserManagementActive ? '3px solid #f59e0b' : '3px solid transparent',
            color: isUserManagementActive ? '#fff' : '#93c5fd',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>
              <TeamOutlined />
            </span>
            Quản lý người dùng
          </span>
          {isUserManagementOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
        </button>

        {isUserManagementOpen && (
          <div style={{ marginTop: '2px', marginBottom: '4px' }}>
            {userManagementItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 16px 9px 32px',
                  textDecoration: 'none',
                  color: isActive ? '#fff' : '#93c5fd',
                  background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                  fontSize: '13px',
                  transition: 'all 0.15s',
                })}
              >
                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsImportManagementOpen((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '10px',
            padding: '11px 16px',
            background: isImportManagementActive ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: 'none',
            borderLeft: isImportManagementActive ? '3px solid #f59e0b' : '3px solid transparent',
            color: isImportManagementActive ? '#fff' : '#93c5fd',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>
              <CreditCardOutlined />
            </span>
            Nhập hàng
          </span>
          {isImportManagementOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
        </button>

        {isImportManagementOpen && (
          <div style={{ marginTop: '2px', marginBottom: '4px' }}>
            {importManagementItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 16px 9px 32px',
                  textDecoration: 'none',
                  color: isActive ? '#fff' : '#93c5fd',
                  background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                  fontSize: '13px',
                  transition: 'all 0.15s',
                })}
              >
                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {!isEmployee && (
          <>
            <button
              onClick={() => setIsCustomerCareOpen((prev) => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: '10px',
                padding: '11px 16px',
                background: isCustomerCareActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                border: 'none',
                borderLeft: isCustomerCareActive ? '3px solid #f59e0b' : '3px solid transparent',
                color: isCustomerCareActive ? '#fff' : '#93c5fd',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>
                  <MessageOutlined />
                </span>
                CSKH
              </span>
              {isCustomerCareOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
            </button>

            {isCustomerCareOpen && (
              <div style={{ marginTop: '2px', marginBottom: '4px' }}>
                {customerCareItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 16px 9px 32px',
                      textDecoration: 'none',
                      color: isActive ? '#fff' : '#93c5fd',
                      background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                      borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                      fontSize: '13px',
                      transition: 'all 0.15s',
                    })}
                  >
                    <span style={{ fontSize: '14px' }}>{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </>
        )}
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
          }}
        >
          <ShopOutlined /> Xem cửa hàng
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
