import React from 'react';
import './Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <div className="logo">
              <img src="images/logo.png" alt="MomCare Logo" />
              <span>Mom & Baby</span>
            </div>
            <p>Đồng hành cùng mẹ bầu trên hành trình thai kỳ</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Thông Tin</h4>
              <ul>
                <li><a href="#about">Về chúng tôi</a></li>
                <li><a href="#contact">Liên hệ</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Hỗ Trợ</h4>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#terms">Điều khoản</a></li>
                <li><a href="#privacy">Bảo mật</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Mom & Baby. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;