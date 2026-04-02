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
import '../../assets/styles/layout/admin-sidebar.css';

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
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-logo" onClick={() => navigate('/')}>
        <div className="admin-sidebar-logo-wrap">
          <ThunderboltOutlined className="admin-sidebar-logo-icon" />
          <div>
            <div className="admin-sidebar-brand">ElectricShop</div>
            <div className="admin-sidebar-subtitle">Quản trị hệ thống</div>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div className="admin-sidebar-user">
        <div>
          <div className="admin-sidebar-user-name">{currentUser?.name}</div>
          <div className="admin-sidebar-user-role">{isEmployee ? 'Employee' : 'Administrator'}</div>
        </div>
        <button
          onClick={logout}
          title="Đăng xuất"
          className="admin-sidebar-logout-icon"
        >
          <LogoutOutlined />
        </button>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <button
          onClick={() => setIsUserManagementOpen((prev) => !prev)}
          className={`admin-sidebar-group-btn ${isUserManagementActive ? 'active' : ''}`}
        >
          <span className="admin-sidebar-group-head">
            <span className="admin-sidebar-icon">
              <TeamOutlined />
            </span>
            Quản lý người dùng
          </span>
          {isUserManagementOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
        </button>

        {isUserManagementOpen && (
          <div className="admin-sidebar-submenu">
            {userManagementItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `admin-sidebar-sublink ${isActive ? 'active' : ''}`}
              >
                <span className="admin-sidebar-subicon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsImportManagementOpen((prev) => !prev)}
          className={`admin-sidebar-group-btn ${isImportManagementActive ? 'active' : ''}`}
        >
          <span className="admin-sidebar-group-head">
            <span className="admin-sidebar-icon">
              <CreditCardOutlined />
            </span>
            Nhập hàng
          </span>
          {isImportManagementOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
        </button>

        {isImportManagementOpen && (
          <div className="admin-sidebar-submenu">
            {importManagementItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `admin-sidebar-sublink ${isActive ? 'active' : ''}`}
              >
                <span className="admin-sidebar-subicon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {!isEmployee && (
          <>
            <button
              onClick={() => setIsCustomerCareOpen((prev) => !prev)}
              className={`admin-sidebar-group-btn ${isCustomerCareActive ? 'active' : ''}`}
            >
              <span className="admin-sidebar-group-head">
                <span className="admin-sidebar-icon">
                  <MessageOutlined />
                </span>
                CSKH
              </span>
              {isCustomerCareOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
            </button>

            {isCustomerCareOpen && (
              <div className="admin-sidebar-submenu">
                {customerCareItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `admin-sidebar-sublink ${isActive ? 'active' : ''}`}
                  >
                    <span className="admin-sidebar-subicon">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="admin-sidebar-bottom">
        <button
          onClick={() => navigate('/')}
          className="admin-sidebar-shop-btn"
        >
          <ShopOutlined /> Xem cửa hàng
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
