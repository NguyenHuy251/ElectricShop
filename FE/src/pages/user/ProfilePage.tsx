import React, { useState } from 'react';
import {
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const infoItemStyle: React.CSSProperties = {
  background: '#f9fafb',
  borderRadius: '10px',
  padding: '12px',
};

const ProfilePage: React.FC = () => {
  const { currentUser, changePassword, updateAccount } = useAuth();
  const [editMode, setEditMode] = useState(false);
  
  // Form state cho cập nhật thông tin
  const [tenHienThi, setTenHienThi] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [sdt, setSdt] = useState(currentUser?.phone || '');
  const [diaChi, setDiaChi] = useState(currentUser?.address || '');
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);

  // Form state cho đổi mật khẩu
  const [matKhauCu, setMatKhauCu] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [xacNhanMatKhauMoi, setXacNhanMatKhauMoi] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const handleSubmitUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoError('');
    setInfoSuccess('');
    setInfoLoading(true);

    const result = await updateAccount({
      id: currentUser!.id,
      tenHienThi: tenHienThi.trim(),
      email: email.trim(),
      sdt: sdt.trim(),
      diaChi: diaChi.trim(),
    });
    setInfoLoading(false);

    if (!result.success) {
      setInfoError(result.message);
      return;
    }

    setInfoSuccess(result.message);
    setEditMode(false);
  };

  const handleSubmitChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!matKhauCu || !matKhauMoi || !xacNhanMatKhauMoi) {
      setPassError('Vui lòng nhập đầy đủ thông tin đổi mật khẩu');
      return;
    }

    if (matKhauMoi.length < 6) {
      setPassError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (matKhauMoi !== xacNhanMatKhauMoi) {
      setPassError('Xác nhận mật khẩu mới không khớp');
      return;
    }

    setPassLoading(true);
    const result = await changePassword(matKhauCu, matKhauMoi);
    setPassLoading(false);

    if (!result.success) {
      setPassError(result.message);
      return;
    }

    setPassSuccess(result.message);
    setMatKhauCu('');
    setMatKhauMoi('');
    setXacNhanMatKhauMoi('');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
        <UserOutlined style={{ marginRight: 8 }} />Thông tin tài khoản
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: '88px', height: '88px', borderRadius: '50%', border: '3px solid #2563eb' }}
          />
          <div style={{ fontSize: '16px', fontWeight: 700 }}>{currentUser.name}</div>
          <span
            style={{
              padding: '5px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              background: currentUser.role === 'admin' ? '#fef3c7' : currentUser.isEmployee ? '#dbeafe' : '#eff6ff',
              color: currentUser.role === 'admin' ? '#92400e' : currentUser.isEmployee ? '#1e40af' : '#1d4ed8',
            }}
          >
            {currentUser.role === 'admin' ? (
              <>
                <SettingOutlined /> Admin
              </>
            ) : currentUser.isEmployee ? (
              <>
                <SettingOutlined /> Nhân viên
              </>
            ) : (
              <>
                <UserOutlined /> Khách hàng
              </>
            )}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Thông tin cá nhân</h3>
              {!editMode && (
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  Chỉnh sửa
                </Button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSubmitUpdateInfo} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Input
                  label="Họ và tên"
                  value={tenHienThi}
                  onChange={(e) => setTenHienThi(e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Số điện thoại"
                  type="tel"
                  value={sdt}
                  onChange={(e) => setSdt(e.target.value)}
                />
                <Input
                  label="Địa chỉ"
                  value={diaChi}
                  onChange={(e) => setDiaChi(e.target.value)}
                />

                {infoError && (
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
                    {infoError}
                  </div>
                )}

                {infoSuccess && (
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#166534',
                      fontSize: '13px',
                    }}
                  >
                    <CheckCircleOutlined style={{ marginRight: 6 }} />{infoSuccess}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button type="submit" size="lg" loading={infoLoading}>
                    Lưu thay đổi
                  </Button>
                  <Button type="button" size="lg" variant="secondary" onClick={() => setEditMode(false)}>
                    Hủy
                  </Button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={infoItemStyle}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: 4 }}>
                    <UserOutlined style={{ marginRight: 6 }} />Họ và tên
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{currentUser.name || 'Chưa cập nhật'}</div>
                </div>
                <div style={infoItemStyle}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: 4 }}>
                    <MailOutlined style={{ marginRight: 6 }} />Email
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{currentUser.email || 'Chưa cập nhật'}</div>
                </div>
                <div style={infoItemStyle}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: 4 }}>
                    <PhoneOutlined style={{ marginRight: 6 }} />Số điện thoại
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{currentUser.phone || 'Chưa cập nhật'}</div>
                </div>
                <div style={infoItemStyle}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: 4 }}>
                    Địa chỉ
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{currentUser.address || 'Chưa cập nhật'}</div>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>
              <LockOutlined style={{ marginRight: 8 }} />Đổi mật khẩu
            </h3>

            <form onSubmit={handleSubmitChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Input
                label="Mật khẩu hiện tại"
                type="password"
                value={matKhauCu}
                onChange={(e) => setMatKhauCu(e.target.value)}
                required
              />
              <Input
                label="Mật khẩu mới"
                type="password"
                value={matKhauMoi}
                onChange={(e) => setMatKhauMoi(e.target.value)}
                required
              />
              <Input
                label="Xác nhận mật khẩu mới"
                type="password"
                value={xacNhanMatKhauMoi}
                onChange={(e) => setXacNhanMatKhauMoi(e.target.value)}
                required
              />

              {passError && (
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
                  {passError}
                </div>
              )}

              {passSuccess && (
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#166534',
                    fontSize: '13px',
                  }}
                >
                  <CheckCircleOutlined style={{ marginRight: 6 }} />{passSuccess}
                </div>
              )}

              <Button type="submit" size="lg" loading={passLoading}>
                Cập nhật mật khẩu
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
