import React, { useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined, GiftOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { vouchers as initialVouchers } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { Voucher } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
            <GiftOutlined style={{ marginRight: 8, color: '#2563eb' }} />Quản lý voucher
          </h1>
          <p style={{ color: '#6b7280', margin: '6px 0 0', fontSize: '14px' }}>
            {`Tổng ${voucherList.length} voucher, ${totalActive} voucher đang hoạt động.`}
          </p>
        </div>
        {!isReadOnly && <button
          onClick={openCreateModal}
          style={{
            border: 'none',
            borderRadius: '8px',
            background: '#2563eb',
            color: '#fff',
            fontWeight: 700,
            padding: '10px 14px',
            cursor: 'pointer',
          }}
        >
          <PlusOutlined style={{ marginRight: 6 }} />Thêm voucher
        </button>}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '18px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
              {['Mã', 'Tên voucher', 'Giảm giá', 'Đơn tối thiểu', 'Hạn dùng', 'Trạng thái', 'Thao tác'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {voucherList.map((voucher) => {
              const active = voucher.isActive && new Date(voucher.expiredAt) >= new Date();
              return (
                <tr key={voucher.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 10px' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '13px',
                        border: '1px dashed #94a3b8',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <TagOutlined />{voucher.code}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>{voucher.title}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{voucher.description}</div>
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: '14px', fontWeight: 600 }}>
                    {voucher.discountType === 'percent'
                      ? `${voucher.discountValue}%`
                      : formatCurrency(voucher.discountValue)}
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: '14px' }}>{formatCurrency(voucher.minOrderValue)}</td>
                  <td style={{ padding: '12px 10px', fontSize: '14px' }}>{formatDate(voucher.expiredAt)}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: active ? '#dcfce7' : '#fee2e2',
                        color: active ? '#166534' : '#991b1b',
                      }}
                    >
                      {active ? 'Đang hoạt động' : 'Hết hiệu lực'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {isReadOnly ? (
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Chỉ xem</span>
                      ) : (
                        <>
                          <button
                            onClick={() => openEditModal(voucher)}
                            style={{
                              border: 'none',
                              borderRadius: '7px',
                              background: '#0ea5e9',
                              color: '#fff',
                              padding: '8px 10px',
                              cursor: 'pointer',
                            }}
                          >
                            <EditOutlined /> Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteVoucher(voucher.id)}
                            style={{
                              border: 'none',
                              borderRadius: '7px',
                              background: '#ef4444',
                              color: '#fff',
                              padding: '8px 10px',
                              cursor: 'pointer',
                            }}
                          >
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Mã voucher *</label>
              <input
                value={form.code}
                onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                style={inputStyle}
                placeholder="VD: ELECTRIC20"
              />
            </div>
            <div>
              <label style={labelStyle}>Hạn dùng *</label>
              <input
                type="date"
                value={form.expiredAt}
                onChange={(e) => setForm((prev) => ({ ...prev, expiredAt: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Tên voucher *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Mô tả</label>
              <input
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Loại giảm giá</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm((prev) => ({ ...prev, discountType: e.target.value as Voucher['discountType'] }))}
                style={inputStyle}
              >
                <option value="percent">Phần trăm (%)</option>
                <option value="amount">Số tiền (VND)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Giá trị giảm *</label>
              <input
                type="number"
                min={0}
                value={form.discountValue}
                onChange={(e) => setForm((prev) => ({ ...prev, discountValue: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Đơn tối thiểu *</label>
              <input
                type="number"
                min={0}
                value={form.minOrderValue}
                onChange={(e) => setForm((prev) => ({ ...prev, minOrderValue: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Giảm tối đa</label>
              <input
                type="number"
                min={0}
                value={form.maxDiscountValue}
                onChange={(e) => setForm((prev) => ({ ...prev, maxDiscountValue: e.target.value }))}
                style={inputStyle}
                placeholder="Không bắt buộc"
              />
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                Voucher đang hoạt động
              </label>
            </div>
          </div>

          <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={closeModal} style={{ ...actionBtnStyle, background: '#e2e8f0', color: '#334155' }}>
              Hủy
            </button>
            <button type="submit" style={{ ...actionBtnStyle, background: '#2563eb', color: '#fff' }}>
              {editingVoucher ? 'Lưu thay đổi' : 'Thêm voucher'}
            </button>
          </div>
        </form>
      </Modal>}
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#334155',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  padding: '9px 10px',
  fontSize: '14px',
  outline: 'none',
};

const actionBtnStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: '8px',
  padding: '10px 14px',
  fontWeight: 700,
  cursor: 'pointer',
};

export default AdminVouchersPage;
