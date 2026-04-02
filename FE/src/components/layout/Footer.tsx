import React from 'react';
import { Link } from 'react-router-dom';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined, ThunderboltOutlined } from '@ant-design/icons';
import '../../assets/styles/layout/footer.css';

const Footer: React.FC = () => (
  <footer className="site-footer">
    <div className="site-footer-wrap">
      {/* Brand */}
      <div>
        <div className="site-footer-brand-head">
          <ThunderboltOutlined className="site-footer-brand-icon" />
          <span className="site-footer-brand-title">ElectricShop</span>
        </div>
        <p className="site-footer-brand-desc">
          Cửa hàng điện gia dụng uy tín hàng đầu Việt Nam. Sản phẩm chính hãng, bảo hành tận nơi.
        </p>
        <div className="site-footer-contact">
          <span><EnvironmentOutlined />Hưng Yên</span>
          <span><PhoneOutlined />Hotline: 0336113905</span>
          <span><MailOutlined />nguyenhuy05kc@gmail.com</span>
        </div>
      </div>

      {/* Products */}
      <div>
        <h4 className="site-footer-section-title">Danh mục sản phẩm</h4>
        <ul className="site-footer-list">
          {['Tủ lạnh', 'Máy giặt', 'Điều hòa', 'TV', 'Lò vi sóng', 'Máy lọc nước'].map((cat) => (
            <li key={cat}>
              <Link to="/products" className="site-footer-link">
                › {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Support */}
      <div>
        <h4 className="site-footer-section-title">Hỗ trợ khách hàng</h4>
        <ul className="site-footer-list">
          {['Chính sách đổi trả', 'Bảo hành sản phẩm', 'Hướng dẫn mua hàng', 'Câu hỏi thường gặp', 'Liên hệ hỗ trợ'].map((item) => (
            <li key={item}>
              <span className="site-footer-item-text">› {item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div>
        <h4 className="site-footer-section-title">Đăng ký nhận tin</h4>
        <p className="site-footer-newsletter-desc">
          Nhận thông tin khuyến mãi và sản phẩm mới nhất
        </p>
        <div className="site-footer-newsletter">
          <input
            type="email"
            placeholder="Email của bạn"
            className="site-footer-newsletter-input"
          />
          <button className="site-footer-newsletter-btn">
            Gửi
          </button>
        </div>
      </div>
    </div>

    <div className="site-footer-copy">
      © 2025 ElectricShop. Tất cả quyền được bảo lưu.
    </div>
  </footer>
);

export default Footer;
