import React, { useEffect, useState } from 'react';
import { MessageOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getContactsByAccount } from '../../services/contactService';
import { ContactMessage } from '../../types';
import { formatDate } from '../../utils/helpers';
import '../../assets/styles/pages/user-pages.css';

const getStatusClass = (status: ContactMessage['trangThai']) => {
  if (status === 'new') return 'contacts-status contacts-status--new';
  if (status === 'contacted') return 'contacts-status contacts-status--contacted';
  return 'contacts-status contacts-status--closed';
};

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

  return (
    <div className="contacts-page">
      <div className="contacts-page__header">
        <h1 className="contacts-page__title">
          <MessageOutlined className="contacts-page__title-icon" />Liên hệ của tôi
        </h1>
        <button
          onClick={() => navigate('/contact')}
          title="Gửi liên hệ mới"
          className="contacts-page__add"
        >
          <PlusOutlined />
        </button>
      </div>
      <p className="contacts-page__desc">
        Theo dõi các liên hệ bạn đã gửi và kiểm tra phản hồi từ chủ shop.
      </p>

      <div className="contacts-list">
        {contacts.map((item) => (
          <div key={item.id} className="contacts-card">
            <div className="contacts-card__head">
              <div>
                <p className="contacts-card__title">{item.tieuDe}</p>
                <p className="contacts-card__date">Gửi lúc: {formatDate(item.ngayTao)}</p>
              </div>
              <div className={getStatusClass(item.trangThai)}>{item.trangThai === 'new' ? 'Chờ phản hồi' : item.trangThai === 'contacted' ? 'Đã phản hồi' : 'Đã đóng'}</div>
            </div>

            <div className="contacts-card__content">
              {item.noiDung}
            </div>

            {item.phanHoi ? (
              <div className="contacts-card__reply">
                <p className="contacts-card__reply-title">Phản hồi từ chủ shop</p>
                <p className="contacts-card__reply-text">{item.phanHoi}</p>
                <p className="contacts-card__reply-meta">
                  {item.nguoiPhanHoi || 'Admin'}{item.ngayPhanHoi ? ` • ${formatDate(item.ngayPhanHoi)}` : ''}
                </p>
              </div>
            ) : (
              <div className="contacts-card__empty-reply">
                Shop chưa phản hồi liên hệ này.
              </div>
            )}
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="contacts-empty">
            Bạn chưa có liên hệ nào. Hãy gửi liên hệ ở trang Liên hệ để bắt đầu.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContactsPage;