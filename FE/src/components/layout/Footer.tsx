import React from 'react';
import { Link } from 'react-router-dom';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined, ThunderboltOutlined } from '@ant-design/icons';

const Footer: React.FC = () => (
  <footer style={{
    background: '#1e3a5f', color: '#93c5fd',
    marginTop: '48px', padding: '40px 16px 20px',
  }}>
    <div style={{
      maxWidth: '1200px', margin: '0 auto',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '32px', marginBottom: '32px',
    }}>
      {/* Brand */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ThunderboltOutlined style={{ fontSize: '28px', color: '#f59e0b' }} />
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>ElectricShop</span>
        </div>
        <p style={{ fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
          Cửa hàng điện gia dụng uy tín hàng đầu Việt Nam. Sản phẩm chính hãng, bảo hành tận nơi.
        </p>
        <div style={{ marginTop: '16px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span><EnvironmentOutlined style={{ marginRight: 6 }} />123 Nguyễn Huệ, Quận 1, TP.HCM</span>
          <span><PhoneOutlined style={{ marginRight: 6 }} />Hotline: 1800 9999</span>
          <span><MailOutlined style={{ marginRight: 6 }} />info@electricshop.vn</span>
        </div>
      </div>

      {/* Products */}
      <div>
        <h4 style={{ color: '#fff', margin: '0 0 12px', fontSize: '15px' }}>Danh mục sản phẩm</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Tủ lạnh', 'Máy giặt', 'Điều hòa', 'TV', 'Lò vi sóng', 'Máy lọc nước'].map((cat) => (
            <li key={cat}>
              <Link to="/products" style={{ color: '#93c5fd', textDecoration: 'none', fontSize: '13px' }}>
                › {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Support */}
      <div>
        <h4 style={{ color: '#fff', margin: '0 0 12px', fontSize: '15px' }}>Hỗ trợ khách hàng</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Chính sách đổi trả', 'Bảo hành sản phẩm', 'Hướng dẫn mua hàng', 'Câu hỏi thường gặp', 'Liên hệ hỗ trợ'].map((item) => (
            <li key={item}>
              <span style={{ color: '#93c5fd', fontSize: '13px', cursor: 'pointer' }}>› {item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div>
        <h4 style={{ color: '#fff', margin: '0 0 12px', fontSize: '15px' }}>Đăng ký nhận tin</h4>
        <p style={{ fontSize: '13px', marginBottom: '12px' }}>
          Nhận thông tin khuyến mãi và sản phẩm mới nhất
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="email"
            placeholder="Email của bạn"
            style={{
              flex: 1, padding: '8px 12px', borderRadius: '6px',
              border: 'none', fontSize: '13px', outline: 'none',
            }}
          />
          <button
            style={{
              background: '#f59e0b', border: 'none', color: '#fff',
              padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>

    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.1)',
      paddingTop: '16px',
      textAlign: 'center',
      fontSize: '12px',
    }}>
      © 2025 ElectricShop. Tất cả quyền được bảo lưu.
    </div>
  </footer>
);

export default Footer;
