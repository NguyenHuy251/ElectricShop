import React, { useEffect, useState } from 'react';
import { MessageOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getContactsByAccount } from '../../services/contactService';
import { ContactMessage } from '../../types';
import { formatDate } from '../../utils/helpers';

const MyContactsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    setContacts(
      getContactsByAccount({
        idTaiKhoan: currentUser.id,
        email: currentUser.email,
      }),
    );
  }, [currentUser]);

  const getStatusTag = (status: ContactMessage['trangThai']) => {
    if (status === 'new') {
      return <span style={{ ...statusStyle, background: '#fee2e2', color: '#991b1b' }}>Chờ phản hồi</span>;
    }
    if (status === 'contacted') {
      return <span style={{ ...statusStyle, background: '#dbeafe', color: '#1d4ed8' }}>Đã phản hồi</span>;
    }
    return <span style={{ ...statusStyle, background: '#dcfce7', color: '#166534' }}>Đã đóng</span>;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '26px', color: '#111827' }}>
          <MessageOutlined style={{ marginRight: 8, color: '#2563eb' }} />Liên hệ của tôi
        </h1>
        <button
          onClick={() => navigate('/contact')}
          title="Gửi liên hệ mới"
          style={{
            width: '36px',
            height: '36px',
            border: 'none',
            borderRadius: '10px',
            background: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 700,
          }}
        >
          <PlusOutlined />
        </button>
      </div>
      <p style={{ margin: '8px 0 20px', color: '#64748b' }}>
        Theo dõi các liên hệ bạn đã gửi và kiểm tra phản hồi từ chủ shop.
      </p>

      <div style={{ display: 'grid', gap: '12px' }}>
        {contacts.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{item.tieuDe}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Gửi lúc: {formatDate(item.ngayTao)}</p>
              </div>
              <div>{getStatusTag(item.trangThai)}</div>
            </div>

            <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
              {item.noiDung}
            </div>

            {item.phanHoi ? (
              <div
                style={{
                  marginTop: '10px',
                  background: '#ecfeff',
                  border: '1px solid #a5f3fc',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              >
                <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 700, color: '#0e7490' }}>
                  Phản hồi từ chủ shop
                </p>
                <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#164e63', lineHeight: 1.5 }}>
                  {item.phanHoi}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#0e7490' }}>
                  {item.nguoiPhanHoi || 'Admin'}{item.ngayPhanHoi ? ` • ${formatDate(item.ngayPhanHoi)}` : ''}
                </p>
              </div>
            ) : (
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#64748b' }}>
                Shop chưa phản hồi liên hệ này.
              </div>
            )}
          </div>
        ))}

        {contacts.length === 0 && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '30px 16px', textAlign: 'center', color: '#94a3b8' }}>
            Bạn chưa có liên hệ nào. Hãy gửi liên hệ ở trang Liên hệ để bắt đầu.
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

export default MyContactsPage;
