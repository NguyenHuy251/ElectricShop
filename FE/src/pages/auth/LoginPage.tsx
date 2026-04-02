import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertOutlined, LockOutlined, SettingOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import '../../assets/styles/pages/auth.css';

const LoginPage: React.FC = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  if (isLoggedIn) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(tenDangNhap, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-brand">
          <div className="auth-brand-icon"><ThunderboltOutlined /></div>
          <h1 className="auth-brand-title">ElectricShop</h1>
          <p className="auth-brand-desc">
            Đăng nhập vào tài khoản của bạn
          </p>
        </div>

        {/* Demo accounts */}
        <div className="auth-demo-box">
          <strong>Tài khoản demo:</strong>
          <br />
          <UserOutlined />User: user1 / 123456
          <br />
          <SettingOutlined />Admin: admin / 654321
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Tên đăng nhập"
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={tenDangNhap}
            onChange={(e) => setTenDangNhap(e.target.value)}
            required
            leftIcon={<UserOutlined />}
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<LockOutlined />}
          />

          {error && (
            <div className="auth-error">
              <AlertOutlined />{error}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            Đăng nhập
          </Button>
        </form>

        <div className="auth-footer">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="auth-link-primary">
            Đăng ký ngay
          </Link>
        </div>

        <div className="auth-back-home">
          <Link to="/" className="auth-back-home-link">
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
