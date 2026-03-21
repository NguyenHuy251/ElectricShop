import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertOutlined, LockOutlined, MailOutlined, SettingOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginPage: React.FC = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
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
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}><ThunderboltOutlined style={{ color: '#f59e0b' }} /></div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1e3a5f' }}>ElectricShop</h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '14px' }}>
            Đăng nhập vào tài khoản của bạn
          </p>
        </div>

        {/* Demo accounts */}
        <div
          style={{
            background: '#f0f9ff',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px',
            fontSize: '12px',
            color: '#0369a1',
          }}
        >
          <strong>Tài khoản demo:</strong>
          <br />
          <UserOutlined style={{ marginRight: 6 }} />User: user@example.com / user123
          <br />
          <SettingOutlined style={{ marginRight: 6 }} />Admin: admin@electricshop.vn / admin123
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<MailOutlined />}
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
              <AlertOutlined style={{ marginRight: 6 }} />{error}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            Đăng nhập
          </Button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
            color: '#6b7280',
          }}
        >
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>
            Đăng ký ngay
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <Link to="/" style={{ color: '#6b7280', fontSize: '13px', textDecoration: 'none' }}>
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
