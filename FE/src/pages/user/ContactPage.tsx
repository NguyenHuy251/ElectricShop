import React, { useState } from 'react';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { createContactMessage } from '../../services/contactService';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/pages/content.css';

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
    <div className="contact-page">
      <h1 className="contact-title">Liên hệ</h1>
      <p className="contact-desc">
        Cần hỗ trợ về sản phẩm hoặc đơn hàng? Hãy để lại thông tin để đội ngũ ElectricShop liên hệ lại.
      </p>

      <div className="contact-info-grid">
        <div className="contact-info-card">
          <p className="contact-info-label"><PhoneOutlined /> Hotline</p>
          <p className="contact-info-value">0336 113 905</p>
        </div>
        <div className="contact-info-card">
          <p className="contact-info-label"><MailOutlined /> Email</p>
          <p className="contact-info-value">support@electricshop.vn</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="contact-form-grid">
          <div>
            <label className="contact-label">Họ tên *</label>
            <input className="contact-input" value={form.hoTen} onChange={(e) => setForm((p) => ({ ...p, hoTen: e.target.value }))} />
          </div>
          <div>
            <label className="contact-label">Email *</label>
            <input className="contact-input" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
        </div>

        <div className="contact-form-grid">
          <div>
            <label className="contact-label">Số điện thoại</label>
            <input className="contact-input" value={form.sdt} onChange={(e) => setForm((p) => ({ ...p, sdt: e.target.value }))} />
          </div>
          <div>
            <label className="contact-label">Tiêu đề *</label>
            <input className="contact-input" value={form.tieuDe} onChange={(e) => setForm((p) => ({ ...p, tieuDe: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className="contact-label">Nội dung *</label>
          <textarea
            rows={5}
            value={form.noiDung}
            onChange={(e) => setForm((p) => ({ ...p, noiDung: e.target.value }))}
            className="contact-textarea"
          />
        </div>

        <div className="contact-form-bottom">
          <span className="contact-required-note">* Trường bắt buộc</span>
          <button type="submit" className="contact-submit">
            Gửi liên hệ
          </button>
        </div>

        {success && (
          <p className="contact-success">
            {success}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactPage;
