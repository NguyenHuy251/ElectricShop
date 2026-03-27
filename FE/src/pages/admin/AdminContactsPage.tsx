import React, { useEffect, useState } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import { ContactMessage } from '../../types';
import { getContactMessages, updateContactReply, updateContactStatus } from '../../services/contactService';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

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
      return <span style={{ ...statusStyle, background: '#fee2e2', color: '#991b1b' }}>Mới</span>;
    }
    if (status === 'contacted') {
      return <span style={{ ...statusStyle, background: '#dbeafe', color: '#1d4ed8' }}>Đã liên hệ</span>;
    }
    return <span style={{ ...statusStyle, background: '#dcfce7', color: '#166534' }}>Đã đóng</span>;
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>
          <MessageOutlined style={{ marginRight: 8, color: '#2563eb' }} />Quản lý liên hệ
        </h1>
        <p style={{ margin: '6px 0 0', color: '#64748b' }}>Theo dõi và xử lý yêu cầu liên hệ từ khách hàng.</p>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
              {['Họ tên', 'Email / SĐT', 'Tiêu đề', 'Nội dung', 'Ngày gửi', 'Trạng thái', 'Xử lý'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '10px', fontWeight: 600 }}>{item.hoTen}</td>
                <td style={{ padding: '10px', fontSize: '14px', color: '#475569' }}>
                  <div>{item.email}</div>
                  <div>{item.sdt || '-'}</div>
                </td>
                <td style={{ padding: '10px', fontSize: '14px' }}>{item.tieuDe}</td>
                <td style={{ padding: '10px', fontSize: '14px', color: '#334155', maxWidth: '320px' }}>
                  <div style={{ marginBottom: item.phanHoi ? '8px' : 0 }}>{item.noiDung}</div>
                  {item.phanHoi && (
                    <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '6px', padding: '8px' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 700, color: '#0e7490' }}>
                        Phản hồi
                      </p>
                      <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#164e63' }}>{item.phanHoi}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#0e7490' }}>
                        {item.nguoiPhanHoi || 'Admin'}{item.ngayPhanHoi ? ` • ${formatDate(item.ngayPhanHoi)}` : ''}
                      </p>
                    </div>
                  )}
                </td>
                <td style={{ padding: '10px', fontSize: '13px', color: '#64748b' }}>{formatDate(item.ngayTao)}</td>
                <td style={{ padding: '10px' }}>{getStatusTag(item.trangThai)}</td>
                <td style={{ padding: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
                    <select
                      value={item.trangThai}
                      onChange={(e) => handleChangeStatus(item.id, e.target.value as ContactMessage['trangThai'])}
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        fontSize: '13px',
                      }}
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
                      style={{
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {item.phanHoi ? 'Sửa phản hồi' : 'Phản hồi'}
                    </button>

                    {replyTargetId === item.id && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Nhập phản hồi cho liên hệ này"
                          style={{
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '8px',
                            fontSize: '13px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                          }}
                        />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleSaveReply(item.id)}
                            style={{
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              background: '#2563eb',
                              color: '#fff',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => {
                              setReplyTargetId(null);
                              setReplyText('');
                            }}
                            style={{
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              background: '#e2e8f0',
                              color: '#334155',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
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
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
            Chưa có liên hệ nào.
          </div>
        )}
      </div>
    </div>
  );
};

const statusStyle: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: '999px',
  fontWeight: 700,
  fontSize: '12px',
};

export default AdminContactsPage;
