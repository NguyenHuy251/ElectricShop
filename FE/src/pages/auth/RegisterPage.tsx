import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertOutlined, LockOutlined, MailOutlined, PhoneOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import '../../assets/styles/pages/auth.css';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenDangNhap: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const result = await register(
      form.tenDangNhap,
      form.name,
      form.email,
      form.password,
      form.phone,
    );

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon"><ThunderboltOutlined /></div>
          <h1 className="auth-brand-title">Tạo tài khoản mới</h1>
          <p className="auth-brand-desc">
            Đăng ký để bắt đầu mua sắm
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Tên đăng nhập"
            placeholder="user1"
            value={form.tenDangNhap}
            onChange={handleChange('tenDangNhap')}
            required
            leftIcon={<UserOutlined />}
          />
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
            <div className="auth-error">
              <AlertOutlined />{error}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            Đăng ký
          </Button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản?{' '}
          <Link to="/login" className="auth-link-primary">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
