import React from 'react';
import './Header.css';
const Header = () => {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <h1>Chào mừng đến với<br />Mom & Baby</h1>
          <h2>Đồng hành cùng mẹ trên hành trình thai kỳ</h2>
          <p>Theo dõi sự phát triển của thai nhi một cách khoa học và chính xác với các tính năng thông minh.</p>
          <div className="hero-buttons">
            <a href="#register" className="btn-primary">Bắt đầu ngay</a>
            <a href="#learn-more" className="btn-secondary">Tìm hiểu thêm</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="images/hero-pregnancy.png" alt="Pregnancy Journey" />
        </div>
      </div>
    </section>
  );
};

export default Header;