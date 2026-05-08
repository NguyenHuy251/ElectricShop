import React, { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  ManOutlined,
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
  const [ngaySinh, setNgaySinh] = useState(currentUser?.ngaySinh || '');
  const [gioiTinh, setGioiTinh] = useState(currentUser?.gioiTinh || '');
  const [ngayVaoLam, setNgayVaoLam] = useState(currentUser?.ngayVaoLam || '');
  const [boPhan, setBoPhan] = useState(currentUser?.boPhan || '');
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);

  const [matKhauCu, setMatKhauCu] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [xacNhanMatKhauMoi, setXacNhanMatKhauMoi] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setTenHienThi(currentUser.name || '');
    setEmail(currentUser.email || '');
    setSdt(currentUser.phone || '');
    setDiaChi(currentUser.address || '');
    setNgaySinh(currentUser.ngaySinh || '');
    setGioiTinh(currentUser.gioiTinh || '');
    setNgayVaoLam(currentUser.ngayVaoLam || '');
    setBoPhan(currentUser.boPhan || '');
  }, [
    currentUser?.id,
    currentUser?.name,
    currentUser?.email,
    currentUser?.phone,
    currentUser?.address,
    currentUser?.ngaySinh,
    currentUser?.gioiTinh,
    currentUser?.ngayVaoLam,
    currentUser?.boPhan,
  ]);

  const handleSubmitUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoError('');
    setInfoSuccess('');
    setInfoLoading(true);

    const isAdminUser = currentUser?.role === 'admin';

    const result = await updateAccount({
      id: currentUser!.id,
      tenHienThi: tenHienThi.trim(),
      email: email.trim(),
      sdt: sdt.trim(),
      diaChi: diaChi.trim(),
      ngaySinh: ngaySinh || null,
      gioiTinh: gioiTinh || undefined,
      // Chỉ Admin được sửa ngày vào làm + bộ phận
      ngayVaoLam: isAdminUser ? (ngayVaoLam || null) : undefined,
      boPhan: isAdminUser ? (boPhan.trim() || undefined) : undefined,
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

  const isAdmin = currentUser.role === 'admin';
  const isEmployee = !!currentUser.isEmployee && !isAdmin;
  const isStaffOrAdmin = isAdmin || isEmployee;
  const formatVnDate = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString('vi-VN') : 'Chưa cập nhật';

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
                <Input label="Ngày sinh" type="date" value={ngaySinh || ''} onChange={(e) => setNgaySinh(e.target.value)} />
                <div className="ui-input-wrap">
                  <label className="ui-input-label">Giới tính</label>
                  <div className="ui-input-box">
                    <select
                      className="ui-input-field"
                      value={gioiTinh || ''}
                      onChange={(e) => setGioiTinh(e.target.value)}
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
                {isStaffOrAdmin && (
                  <>
                    {isAdmin ? (
                      <>
                        <Input
                          label="Ngày vào làm"
                          type="date"
                          value={ngayVaoLam || ''}
                          onChange={(e) => setNgayVaoLam(e.target.value)}
                        />
                        <Input
                          label="Bộ phận"
                          value={boPhan}
                          onChange={(e) => setBoPhan(e.target.value)}
                          placeholder="VD: Kinh doanh, Kỹ thuật,..."
                        />
                      </>
                    ) : (
                      <>
                        <div className="ui-input-wrap">
                          <label className="ui-input-label">
                            Ngày vào làm <span style={{ color: '#9ca3af', fontWeight: 400 }}>(chỉ xem)</span>
                          </label>
                          <div className="ui-input-box">
                            <input
                              className="ui-input-field"
                              type="text"
                              value={formatVnDate(ngayVaoLam)}
                              readOnly
                              style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                            />
                          </div>
                        </div>
                        <div className="ui-input-wrap">
                          <label className="ui-input-label">
                            Bộ phận <span style={{ color: '#9ca3af', fontWeight: 400 }}>(chỉ xem)</span>
                          </label>
                          <div className="ui-input-box">
                            <input
                              className="ui-input-field"
                              type="text"
                              value={boPhan || 'Chưa cập nhật'}
                              readOnly
                              style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

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
                <div className="profile-info-item">
                  <div className="profile-info-item__label"><CalendarOutlined />Ngày sinh</div>
                  <div className="profile-info-item__value">
                    {currentUser.ngaySinh
                      ? new Date(currentUser.ngaySinh).toLocaleDateString('vi-VN')
                      : 'Chưa cập nhật'}
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-item__label"><ManOutlined />Giới tính</div>
                  <div className="profile-info-item__value">{currentUser.gioiTinh || 'Chưa cập nhật'}</div>
                </div>
                {isStaffOrAdmin && (
                  <>
                    <div className="profile-info-item">
                      <div className="profile-info-item__label"><CalendarOutlined />Ngày vào làm</div>
                      <div className="profile-info-item__value">
                        {currentUser.ngayVaoLam
                          ? new Date(currentUser.ngayVaoLam).toLocaleDateString('vi-VN')
                          : 'Chưa cập nhật'}
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <div className="profile-info-item__label"><SettingOutlined />Bộ phận</div>
                      <div className="profile-info-item__value">{currentUser.boPhan || 'Chưa cập nhật'}</div>
                    </div>
                  </>
                )}
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