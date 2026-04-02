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
import '../../assets/styles/pages/user-pages.css';

const ProfilePage: React.FC = () => {
  const { currentUser, changePassword, updateAccount } = useAuth();
  const [editMode, setEditMode] = useState(false);

  const [tenHienThi, setTenHienThi] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [sdt, setSdt] = useState(currentUser?.phone || '');
  const [diaChi, setDiaChi] = useState(currentUser?.address || '');
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);

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

  if (!currentUser) return null;

  const roleClass = currentUser.role === 'admin'
    ? 'profile-side__role profile-side__role--admin'
    : currentUser.isEmployee
      ? 'profile-side__role profile-side__role--staff'
      : 'profile-side__role profile-side__role--user';

  return (
    <div className="profile-page">
      <h1 className="profile-page__title">
        <UserOutlined />Thông tin tài khoản
      </h1>

      <div className="profile-layout">
        <div className="profile-side">
          <img src={currentUser.avatar} alt={currentUser.name} className="profile-side__avatar" />
          <div className="profile-side__name">{currentUser.name}</div>
          <span className={roleClass}>
            {currentUser.role === 'admin' ? <><SettingOutlined /> Admin</> : currentUser.isEmployee ? <><SettingOutlined /> Nhân viên</> : <><UserOutlined /> Khách hàng</>}
          </span>
        </div>

        <div className="profile-main">
          <div className="profile-card">
            <div className="profile-card__head">
              <h3 className="profile-card__title">Thông tin cá nhân</h3>
              {!editMode && (
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  Chỉnh sửa
                </Button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSubmitUpdateInfo} className="profile-form">
                <Input label="Họ và tên" value={tenHienThi} onChange={(e) => setTenHienThi(e.target.value)} required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Số điện thoại" type="tel" value={sdt} onChange={(e) => setSdt(e.target.value)} />
                <Input label="Địa chỉ" value={diaChi} onChange={(e) => setDiaChi(e.target.value)} />

                {infoError && <div className="profile-feedback profile-feedback--error">{infoError}</div>}
                {infoSuccess && (
                  <div className="profile-feedback profile-feedback--success">
                    <CheckCircleOutlined />{infoSuccess}
                  </div>
                )}

                <div className="profile-form__actions">
                  <Button type="submit" size="lg" loading={infoLoading}>Lưu thay đổi</Button>
                  <Button type="button" size="lg" variant="secondary" onClick={() => setEditMode(false)}>Hủy</Button>
                </div>
              </form>
            ) : (
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <div className="profile-info-item__label"><UserOutlined />Họ và tên</div>
                  <div className="profile-info-item__value">{currentUser.name || 'Chưa cập nhật'}</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-item__label"><MailOutlined />Email</div>
                  <div className="profile-info-item__value">{currentUser.email || 'Chưa cập nhật'}</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-item__label"><PhoneOutlined />Số điện thoại</div>
                  <div className="profile-info-item__value">{currentUser.phone || 'Chưa cập nhật'}</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-item__label">Địa chỉ</div>
                  <div className="profile-info-item__value">{currentUser.address || 'Chưa cập nhật'}</div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-card">
            <h3 className="profile-card__title">
              <LockOutlined />Đổi mật khẩu
            </h3>

            <form onSubmit={handleSubmitChangePassword} className="profile-form">
              <Input label="Mật khẩu hiện tại" type="password" value={matKhauCu} onChange={(e) => setMatKhauCu(e.target.value)} required />
              <Input label="Mật khẩu mới" type="password" value={matKhauMoi} onChange={(e) => setMatKhauMoi(e.target.value)} required />
              <Input label="Xác nhận mật khẩu mới" type="password" value={xacNhanMatKhauMoi} onChange={(e) => setXacNhanMatKhauMoi(e.target.value)} required />

              {passError && <div className="profile-feedback profile-feedback--error">{passError}</div>}
              {passSuccess && (
                <div className="profile-feedback profile-feedback--success">
                  <CheckCircleOutlined />{passSuccess}
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