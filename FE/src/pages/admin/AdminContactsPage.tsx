import React, { useEffect, useState } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import { ContactMessage } from '../../types';
import { getContactMessages, updateContactReply, updateContactStatus } from '../../services/contactService';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/pages/admin-pages.css';

const AdminContactsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    setContacts(getContactMessages());
  }, []);

  const handleChangeStatus = (id: number, trangThai: ContactMessage['trangThai']) => {
    const updated = updateContactStatus(id, trangThai);
    if (!updated) return;
    setContacts(getContactMessages());
  };

  const handleSaveReply = (id: number) => {
    const normalized = replyText.trim();
    if (!normalized) {
      window.alert('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    const updated = updateContactReply(id, {
      phanHoi: normalized,
      nguoiPhanHoi: currentUser?.name || 'Admin',
    });

    if (!updated) return;

    setContacts(getContactMessages());
    setReplyTargetId(null);
    setReplyText('');
  };

  const getStatusTag = (status: ContactMessage['trangThai']) => {
    if (status === 'new') {
      return <span className="admin-status-tag new">Mới</span>;
    }
    if (status === 'contacted') {
      return <span className="admin-status-tag contacted">Đã liên hệ</span>;
    }
    return <span className="admin-status-tag closed">Đã đóng</span>;
  };

  return (
    <div>
      <div className="dashboard-title-wrap">
        <h1 className="dashboard-title">
          <MessageOutlined className="admin-icon-inline" />Quản lý liên hệ
        </h1>
        <p className="dashboard-subtitle">Theo dõi và xử lý yêu cầu liên hệ từ khách hàng.</p>
      </div>

      <div className="admin-contacts-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-contacts-head-row">
              {['Họ tên', 'Email / SĐT', 'Tiêu đề', 'Nội dung', 'Ngày gửi', 'Trạng thái', 'Xử lý'].map((h) => (
                <th key={h} className="admin-contacts-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((item) => (
              <tr key={item.id} className="admin-contacts-row">
                <td className="admin-contacts-cell admin-contacts-name">{item.hoTen}</td>
                <td className="admin-contacts-cell admin-contacts-contact">
                  <div>{item.email}</div>
                  <div>{item.sdt || '-'}</div>
                </td>
                <td className="admin-contacts-cell">{item.tieuDe}</td>
                <td className="admin-contacts-cell admin-contacts-content">
                  <div className={`admin-contacts-content-main${item.phanHoi ? '' : ' no-reply'}`}>{item.noiDung}</div>
                  {item.phanHoi && (
                    <div className="admin-contacts-reply-box">
                      <p className="admin-contacts-reply-title">
                        Phản hồi
                      </p>
                      <p className="admin-contacts-reply-text">{item.phanHoi}</p>
                      <p className="admin-contacts-reply-meta">
                        {item.nguoiPhanHoi || 'Admin'}{item.ngayPhanHoi ? ` • ${formatDate(item.ngayPhanHoi)}` : ''}
                      </p>
                    </div>
                  )}
                </td>
                <td className="admin-contacts-cell admin-contacts-date">{formatDate(item.ngayTao)}</td>
                <td className="admin-contacts-cell">{getStatusTag(item.trangThai)}</td>
                <td className="admin-contacts-cell">
                  <div className="admin-contacts-actions">
                    <select
                      value={item.trangThai}
                      onChange={(e) => handleChangeStatus(item.id, e.target.value as ContactMessage['trangThai'])}
                      className="admin-contacts-select"
                    >
                      <option value="new">Mới</option>
                      <option value="contacted">Đã liên hệ</option>
                      <option value="closed">Đã đóng</option>
                    </select>

                    <button
                      onClick={() => {
                        setReplyTargetId(item.id);
                        setReplyText(item.phanHoi || '');
                      }}
                      className="admin-contacts-btn reply"
                    >
                      {item.phanHoi ? 'Sửa phản hồi' : 'Phản hồi'}
                    </button>

                    {replyTargetId === item.id && (
                      <div className="admin-contacts-reply-editor">
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Nhập phản hồi cho liên hệ này"
                          className="admin-contacts-reply-input"
                        />
                        <div className="admin-contacts-btn-row">
                          <button onClick={() => handleSaveReply(item.id)} className="admin-contacts-btn save">
                            Lưu
                          </button>
                          <button
                            onClick={() => {
                              setReplyTargetId(null);
                              setReplyText('');
                            }}
                            className="admin-contacts-btn cancel"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contacts.length === 0 && (
          <div className="admin-empty-muted">
            Chưa có liên hệ nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactsPage;
