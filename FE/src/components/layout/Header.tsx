import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  PhoneOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
  CarOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { cartCountSelector } from '../../recoil/selectors/cartSelectors';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { categories } from '../../data/mockData';
import { getCategoryIcon } from '../../utils/categoryIcons';

const Header: React.FC = () => {
  const { currentUser, logout, isLoggedIn } = useAuth();
  const { searchQuery, setSearchQuery } = useProducts();
  const cartCount = useRecoilValue(cartCountSelector);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/products');
  };

  return (
    <header style={{
      background: '#1e3a5f',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Top Bar */}
      <div style={{
        background: '#172b45',
        padding: '6px 0',
        fontSize: '12px',
        color: '#93c5fd',
        textAlign: 'center',
      }}>
        <CarOutlined style={{ marginRight: 6 }} />
        Miễn phí vận chuyển cho đơn hàng trên 2.000.000đ | <PhoneOutlined style={{ margin: '0 6px 0 10px' }} />Hotline: 0336113905
      </div>

      {/* Main Header */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
        }}>
          <ThunderboltOutlined style={{ fontSize: '28px', color: '#f59e0b' }} />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              Electric
            </div>
            <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 600 }}>SHOP</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex' }}>
          <div style={{ display: 'flex', flex: 1, borderRadius: '8px', overflow: 'hidden' }}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, padding: '10px 16px', border: 'none',
                fontSize: '14px', outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#f59e0b', border: 'none', padding: '0 20px',
                color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '16px',
              }}
            >
              <SearchOutlined />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Cart */}
          <Link to="/cart" style={{
            textDecoration: 'none', position: 'relative',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            color: '#fff', padding: '4px 12px',
          }}>
            <ShoppingCartOutlined style={{ fontSize: '22px' }} />
            <span style={{ fontSize: '11px' }}>Giỏ hàng</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 4,
                background: '#ef4444', color: '#fff',
                borderRadius: '999px', fontSize: '10px', fontWeight: 700,
                padding: '1px 5px', minWidth: '16px', textAlign: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  color: '#fff', gap: '2px',
                }}
              >
                <img
                  src={currentUser!.avatar}
                  alt={currentUser!.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
                <span style={{ fontSize: '11px' }}>{currentUser!.name.split(' ').pop()}</span>
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                    background: '#fff', borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    minWidth: '180px', zIndex: 200, overflow: 'hidden',
                  }}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {currentUser?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      style={dropItemStyle}
                    >
                      <SettingOutlined style={{ marginRight: 6 }} />Quản trị
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setMenuOpen(false)} style={dropItemStyle}>
                    <UserOutlined style={{ marginRight: 6 }} />Tài khoản
                  </Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} style={dropItemStyle}>
                    <InboxOutlined style={{ marginRight: 6 }} />Đơn hàng
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    style={{ ...dropItemStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#ef4444' }}
                  >
                    <LogoutOutlined style={{ marginRight: 6 }} />Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none', color: '#fff', fontSize: '13px',
                  padding: '8px 12px', borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                style={{
                  textDecoration: 'none', color: '#1e3a5f', fontSize: '13px',
                  padding: '8px 12px', borderRadius: '6px',
                  background: '#f59e0b', fontWeight: 600,
                }}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Nav */}
      <nav style={{
        background: '#2563eb',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 16px',
          display: 'flex', gap: '0',
        }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              style={{
                textDecoration: 'none',
                color: '#fff',
                padding: '10px 14px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'background 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {getCategoryIcon(cat, { fontSize: '14px' })} {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

const dropItemStyle: React.CSSProperties = {
  display: 'block',
  padding: '10px 16px',
  fontSize: '14px',
  color: '#374151',
  textDecoration: 'none',
  transition: 'background 0.15s',
};

export default Header;
