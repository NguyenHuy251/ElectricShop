import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  AppstoreOutlined,
  DownOutlined,
  PhoneOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
  CarOutlined,
  InboxOutlined,
  HomeOutlined,
  GiftOutlined,
  MessageOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { cartCountSelector } from '../../recoil/selectors/cartSelectors';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { categories } from '../../data/mockData';
import { getCategoryIcon } from '../../utils/categoryIcons';
import '../../assets/styles/layout/header.css';

const Header: React.FC = () => {
  const { currentUser, logout, isLoggedIn } = useAuth();
  const { searchQuery, setSearchQuery } = useProducts();
  const cartCount = useRecoilValue(cartCountSelector);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/products');
  };

  return (
    <header className="site-header">
      {/* Top Bar */}
      <div className="site-header-top">
        <CarOutlined className="site-icon site-icon--inline" />
        Miễn phí vận chuyển cho đơn hàng trên 2.000.000đ |{' '}
        <PhoneOutlined className="site-icon site-icon--topbar" />
        Hotline: 0336113905
      </div>

      {/* Main Header */}
      <div className="site-header-main">
        {/* Logo */}
        <Link to="/" className="site-logo">
          <ThunderboltOutlined className="site-icon site-icon--logo" />
          <div>
            <div className="site-logo-title">Electric</div>
            <div className="site-logo-subtitle">SHOP</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="site-search-form">
          <div className="site-search-wrap">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="site-search-input"
            />
            <button type="submit" className="site-search-btn">
              <SearchOutlined />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="site-header-actions">
          <Link to="/vouchers" className="site-action-link site-action-link--voucher">
            <GiftOutlined className="site-icon site-icon--action" />
            <span className="site-action-label">Voucher</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="site-action-link">
            <ShoppingCartOutlined className="site-icon site-icon--cart" />
            <span className="site-action-label">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="site-cart-badge">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {isLoggedIn ? (
            <div className="site-user-menu">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="site-user-menu-btn"
              >
                <img
                  src={currentUser!.avatar}
                  alt={currentUser!.name}
                  className="site-user-avatar"
                />
                <span className="site-user-name-short">{currentUser!.name.split(' ').pop()}</span>
              </button>

              {menuOpen && (
                <div className="site-user-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                  {(currentUser?.role === 'admin' || currentUser?.isEmployee) && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="site-dropdown-item"
                    >
                      <SettingOutlined className="site-icon site-icon--dropdown" />Quản trị
                    </Link>
                  )}
                  <Link
                    to="/my-contacts"
                    onClick={() => setMenuOpen(false)}
                      className="site-dropdown-item"
                  >
                    <MessageOutlined className="site-icon site-icon--dropdown" />Liên hệ
                  </Link>
                  
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="site-dropdown-item">
                    <UserOutlined className="site-icon site-icon--dropdown" />Tài khoản
                  </Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="site-dropdown-item">
                    <InboxOutlined className="site-icon site-icon--dropdown" />Đơn hàng
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="site-dropdown-item site-dropdown-logout"
                  >
                    <LogoutOutlined className="site-icon site-icon--dropdown" />Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="site-auth-links">
              <Link to="/login" className="site-auth-login">Đăng nhập</Link>
              <Link to="/register" className="site-auth-register">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Nav */}
      <nav className="site-header-nav">
        <div className="site-header-nav-wrap">
          <Link
            to="/"
            className="site-nav-link"
          >
            <HomeOutlined className="site-icon site-icon--nav" /> Trang chủ
          </Link>

          <Link
            to="/news"
            className="site-nav-link"
          >
            <ReadOutlined className="site-icon site-icon--nav" /> Tin tức
          </Link>

          <Link
            to="/contact"
            className="site-nav-link"
          >
            <PhoneOutlined className="site-icon site-icon--nav" /> Liên hệ
          </Link>

          <div
            className="site-products-menu"
            onMouseEnter={() => setProductsMenuOpen(true)}
            onMouseLeave={() => setProductsMenuOpen(false)}
          >
            <button
              type="button"
              className={`site-products-menu-btn ${productsMenuOpen ? 'open' : ''}`}
            >
                <AppstoreOutlined className="site-icon site-icon--nav" /> Sản phẩm <DownOutlined className="site-icon site-icon--chevron" />
            </button>

            {productsMenuOpen && (
              <div className="site-products-dropdown">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.id}`}
                    className="site-products-item"
                    onClick={() => setProductsMenuOpen(false)}
                  >
                    {getCategoryIcon(cat, { fontSize: '14px' })} {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
