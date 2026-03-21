import React, { useState } from 'react';
import { CheckCircleOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}><UserOutlined style={{ marginRight: 8 }} />Thông tin tài khoản</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Avatar Side */}
        <div
          style={{
            background: '#fff', borderRadius: '12px', padding: '24px',
            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          }}
        >
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #2563eb' }}
          />
          <div style={{ fontSize: '14px', fontWeight: 700 }}>{currentUser?.name}</div>
          <span
            style={{
              padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
              background: currentUser?.role === 'admin' ? '#fef3c7' : '#eff6ff',
              color: currentUser?.role === 'admin' ? '#92400e' : '#1d4ed8',
            }}
          >
            {currentUser?.role === 'admin' ? <><SettingOutlined /> Admin</> : <><UserOutlined /> Khách hàng</>}
          </span>
        </div>

        {/* Form */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700 }}>Chỉnh sửa thông tin</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Họ và tên"
              value={form.name}
              onChange={handleChange('name')}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              required
            />
            <Input
              label="Số điện thoại"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Địa chỉ</label>
              <input
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Nhập địa chỉ của bạn"
                style={{
                  padding: '10px 12px', border: '1.5px solid #d1d5db',
                  borderRadius: '8px', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {saved && (
              <div
                style={{
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  borderRadius: '8px', padding: '10px 14px',
                  color: '#166534', fontSize: '13px',
                }}
              >
                <CheckCircleOutlined style={{ marginRight: 6 }} />Thông tin đã được cập nhật thành công!
              </div>
            )}

            <Button type="submit" size="lg">
              Lưu thay đổi
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
