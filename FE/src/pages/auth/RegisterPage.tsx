import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertOutlined, LockOutlined, MailOutlined, PhoneOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = register(form.name, form.email, form.password, form.phone);
      if (result.success) {
        navigate('/');
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}><ThunderboltOutlined style={{ color: '#f59e0b' }} /></div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1e3a5f' }}>Tạo tài khoản mới</h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '14px' }}>
            Đăng ký để bắt đầu mua sắm
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={form.name}
            onChange={handleChange('name')}
            required
            leftIcon={<UserOutlined />}
          />
          <Input
            label="Email"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange('email')}
            required
            leftIcon={<MailOutlined />}
          />
          <Input
            label="Số điện thoại"
            type="tel"
            placeholder="0901234567"
            value={form.phone}
            onChange={handleChange('phone')}
            required
            leftIcon={<PhoneOutlined />}
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Ít nhất 6 ký tự"
            value={form.password}
            onChange={handleChange('password')}
            required
            leftIcon={<LockOutlined />}
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={form.confirm}
            onChange={handleChange('confirm')}
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
            Đăng ký
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
