import React, { useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined, GiftOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { vouchers as initialVouchers } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { Voucher } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import '../../assets/styles/pages/admin-pages.css';

type VoucherFormState = {
  code: string;
  title: string;
  description: string;
  discountType: Voucher['discountType'];
  discountValue: string;
  minOrderValue: string;
  maxDiscountValue: string;
  expiredAt: string;
  isActive: boolean;
};

const emptyForm: VoucherFormState = {
  code: '',
  title: '',
  description: '',
  discountType: 'percent',
  discountValue: '',
  minOrderValue: '',
  maxDiscountValue: '',
  expiredAt: '',
  isActive: true,
};

const AdminVouchersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.isEmployee ?? false;

  const [voucherList, setVoucherList] = useState<Voucher[]>(initialVouchers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [form, setForm] = useState<VoucherFormState>(emptyForm);

  const totalActive = useMemo(
    () => voucherList.filter((v) => v.isActive && new Date(v.expiredAt) >= new Date()).length,
    [voucherList],
  );

  const openCreateModal = () => {
    setEditingVoucher(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setForm({
      code: voucher.code,
      title: voucher.title,
      description: voucher.description,
      discountType: voucher.discountType,
      discountValue: String(voucher.discountValue),
      minOrderValue: String(voucher.minOrderValue),
      maxDiscountValue: voucher.maxDiscountValue ? String(voucher.maxDiscountValue) : '',
      expiredAt: voucher.expiredAt,
      isActive: voucher.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
  };

  const handleDeleteVoucher = (id: number) => {
    const shouldDelete = window.confirm('Bạn có chắc muốn xóa voucher này không?');
    if (!shouldDelete) return;
    setVoucherList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code.trim() || !form.title.trim() || !form.discountValue.trim() || !form.minOrderValue.trim() || !form.expiredAt) {
      window.alert('Vui lòng nhập đầy đủ các trường bắt buộc.');
      return;
    }

    const discountValue = Number(form.discountValue);
    const minOrderValue = Number(form.minOrderValue);
    const maxDiscountValue = form.maxDiscountValue.trim() ? Number(form.maxDiscountValue) : undefined;

    if (Number.isNaN(discountValue) || Number.isNaN(minOrderValue) || (form.maxDiscountValue.trim() && Number.isNaN(maxDiscountValue))) {
      window.alert('Giá trị số không hợp lệ.');
      return;
    }

    const payload: Omit<Voucher, 'id'> = {
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      description: form.description.trim(),
      discountType: form.discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      expiredAt: form.expiredAt,
      isActive: form.isActive,
    };

    if (editingVoucher) {
      setVoucherList((prev) =>
        prev.map((voucher) => (voucher.id === editingVoucher.id ? { ...voucher, ...payload } : voucher)),
      );
    } else {
      setVoucherList((prev) => {
        const nextId = prev.length > 0 ? Math.max(...prev.map((v) => v.id)) + 1 : 1;
        return [...prev, { id: nextId, ...payload }];
      });
    }

    closeModal();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="dashboard-title">
            <GiftOutlined className="admin-icon-inline" />Quản lý voucher
          </h1>
          <p className="dashboard-subtitle">
            {`Tổng ${voucherList.length} voucher, ${totalActive} voucher đang hoạt động.`}
          </p>
        </div>
        {!isReadOnly && <button onClick={openCreateModal} className="admin-news-add-btn">
          <PlusOutlined />Thêm voucher
        </button>}
      </div>

      <div className="admin-news-wrap">
        <table className="admin-table">
          <thead>
            <tr className="dashboard-table-head-row">
              {['Mã', 'Tên voucher', 'Giảm giá', 'Đơn tối thiểu', 'Hạn dùng', 'Trạng thái', 'Thao tác'].map((h) => (
                <th key={h} className="dashboard-table-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {voucherList.map((voucher) => {
              const active = voucher.isActive && new Date(voucher.expiredAt) >= new Date();
              return (
                <tr key={voucher.id} className="dashboard-table-row">
                  <td className="admin-news-cell-date">
                    <span className="admin-voucher-code">
                      <TagOutlined />{voucher.code}
                    </span>
                  </td>
                  <td className="admin-news-cell-date">
                    <div className="admin-voucher-title">{voucher.title}</div>
                    <div className="admin-voucher-desc">{voucher.description}</div>
                  </td>
                  <td className="admin-news-cell-date admin-voucher-discount">
                    {voucher.discountType === 'percent'
                      ? `${voucher.discountValue}%`
                      : formatCurrency(voucher.discountValue)}
                  </td>
                  <td className="admin-news-cell-date">{formatCurrency(voucher.minOrderValue)}</td>
                  <td className="admin-news-cell-date">{formatDate(voucher.expiredAt)}</td>
                  <td className="admin-news-cell-date">
                    <span className={`admin-voucher-status ${active ? 'active' : 'inactive'}`}>
                      {active ? 'Đang hoạt động' : 'Hết hiệu lực'}
                    </span>
                  </td>
                  <td className="admin-news-cell-date">
                    <div className="admin-news-actions">
                      {isReadOnly ? (
                        <span className="admin-readonly-text">Chỉ xem</span>
                      ) : (
                        <>
                          <button onClick={() => openEditModal(voucher)} className="admin-news-action-btn edit">
                            <EditOutlined /> Sửa
                          </button>
                          <button onClick={() => handleDeleteVoucher(voucher.id)} className="admin-news-action-btn delete">
                            <DeleteOutlined /> Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!isReadOnly && <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingVoucher ? 'Sửa voucher' : 'Thêm voucher mới'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-news-form-grid">
            <div>
              <label className="admin-form-label">Mã voucher *</label>
              <input
                value={form.code}
                onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                className="admin-form-input"
                placeholder="VD: ELECTRIC20"
              />
            </div>
            <div>
              <label className="admin-form-label">Hạn dùng *</label>
              <input
                type="date"
                value={form.expiredAt}
                onChange={(e) => setForm((prev) => ({ ...prev, expiredAt: e.target.value }))}
                className="admin-form-input"
              />
            </div>
            <div className="admin-form-full">
              <label className="admin-form-label">Tên voucher *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="admin-form-input"
              />
            </div>
            <div className="admin-form-full">
              <label className="admin-form-label">Mô tả</label>
              <input
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="admin-form-input"
              />
            </div>
            <div>
              <label className="admin-form-label">Loại giảm giá</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm((prev) => ({ ...prev, discountType: e.target.value as Voucher['discountType'] }))}
                className="admin-form-select"
              >
                <option value="percent">Phần trăm (%)</option>
                <option value="amount">Số tiền (VND)</option>
              </select>
            </div>
            <div>
              <label className="admin-form-label">Giá trị giảm *</label>
              <input
                type="number"
                min={0}
                value={form.discountValue}
                onChange={(e) => setForm((prev) => ({ ...prev, discountValue: e.target.value }))}
                className="admin-form-input"
              />
            </div>
            <div>
              <label className="admin-form-label">Đơn tối thiểu *</label>
              <input
                type="number"
                min={0}
                value={form.minOrderValue}
                onChange={(e) => setForm((prev) => ({ ...prev, minOrderValue: e.target.value }))}
                className="admin-form-input"
              />
            </div>
            <div>
              <label className="admin-form-label">Giảm tối đa</label>
              <input
                type="number"
                min={0}
                value={form.maxDiscountValue}
                onChange={(e) => setForm((prev) => ({ ...prev, maxDiscountValue: e.target.value }))}
                className="admin-form-input"
                placeholder="Không bắt buộc"
              />
            </div>
            <div className="admin-form-checkbox-row">
              <label className="admin-form-checkbox-label">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                Voucher đang hoạt động
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={closeModal} className="admin-action-btn cancel">
              Hủy
            </button>
            <button type="submit" className="admin-action-btn primary">
              {editingVoucher ? 'Lưu thay đổi' : 'Thêm voucher'}
            </button>
          </div>
        </form>
      </Modal>}
    </div>
  );
};

export default AdminVouchersPage;
