import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertOutlined,
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { forgotPasswordApi } from '../../api/authApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import '../../assets/styles/pages/auth.css';

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }
  return 'Không thể kết nối máy chủ';
};

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenDangNhap: '',
    email: '',
    matKhauMoi: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.tenDangNhap.trim() || !form.email.trim() || !form.matKhauMoi) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (form.matKhauMoi.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (form.matKhauMoi !== form.confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const result = await forgotPasswordApi({
        tenDangNhap: form.tenDangNhap.trim(),
        email: form.email.trim(),
        matKhauMoi: form.matKhauMoi,
      });
      setSuccess(result.message || 'Đặt lại mật khẩu thành công');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon"><ThunderboltOutlined /></div>
          <h1 className="auth-brand-title">Quên mật khẩu</h1>
          <p className="auth-brand-desc">
            Xác thực bằng email đã đăng ký để đặt lại mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            value={form.tenDangNhap}
            onChange={handleChange('tenDangNhap')}
            required
            leftIcon={<UserOutlined />}
          />
          <Input
            label="Email đã đăng ký"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange('email')}
            required
            leftIcon={<MailOutlined />}
          />
          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="Ít nhất 6 ký tự"
            value={form.matKhauMoi}
            onChange={handleChange('matKhauMoi')}
            required
            leftIcon={<LockOutlined />}
          />
          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
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
          {success && (
            <div className="auth-error" style={{ background: '#dcfce7', color: '#15803d', borderColor: '#86efac' }}>
              <CheckCircleOutlined />{success}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg" disabled={!!success}>
            Đặt lại mật khẩu
          </Button>
        </form>

        <div className="auth-footer">
          Đã nhớ mật khẩu?{' '}
          <Link to="/login" className="auth-link-primary">
            Đăng nhập
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

export default ForgotPasswordPage;
