import React, { useState } from 'react';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { createContactMessage } from '../../services/contactService';
import { useAuth } from '../../hooks/useAuth';

const ContactPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    hoTen: '',
    email: '',
    sdt: '',
    tieuDe: '',
    noiDung: '',
  });
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.hoTen.trim() || !form.email.trim() || !form.tieuDe.trim() || !form.noiDung.trim()) {
      window.alert('Vui lòng nhập đầy đủ các trường bắt buộc.');
      return;
    }

    createContactMessage({
      idTaiKhoan: currentUser?.id,
      hoTen: form.hoTen.trim(),
      email: form.email.trim(),
      sdt: form.sdt.trim(),
      tieuDe: form.tieuDe.trim(),
      noiDung: form.noiDung.trim(),
    });

    setSuccess('Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.');
    setForm({ hoTen: '', email: '', sdt: '', tieuDe: '', noiDung: '' });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: '28px', color: '#111827' }}>Liên hệ</h1>
      <p style={{ margin: '0 0 20px', color: '#64748b' }}>
        Cần hỗ trợ về sản phẩm hoặc đơn hàng? Hãy để lại thông tin để đội ngũ ElectricShop liên hệ lại.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#0f172a' }}><PhoneOutlined /> Hotline</p>
          <p style={{ margin: 0, color: '#475569' }}>0336 113 905</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#0f172a' }}><MailOutlined /> Email</p>
          <p style={{ margin: 0, color: '#475569' }}>support@electricshop.vn</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '20px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={labelStyle}>Họ tên *</label>
            <input value={form.hoTen} onChange={(e) => setForm((p) => ({ ...p, hoTen: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={labelStyle}>Số điện thoại</label>
            <input value={form.sdt} onChange={(e) => setForm((p) => ({ ...p, sdt: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Tiêu đề *</label>
            <input value={form.tieuDe} onChange={(e) => setForm((p) => ({ ...p, tieuDe: e.target.value }))} style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Nội dung *</label>
          <textarea
            rows={5}
            value={form.noiDung}
            onChange={(e) => setForm((p) => ({ ...p, noiDung: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>* Trường bắt buộc</span>
          <button
            type="submit"
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Gửi liên hệ
          </button>
        </div>

        {success && (
          <p style={{ margin: '12px 0 0', color: '#166534', background: '#dcfce7', borderRadius: '6px', padding: '8px 10px', fontSize: '14px' }}>
            {success}
          </p>
        )}
      </form>
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
  boxSizing: 'border-box',
};

export default ContactPage;
