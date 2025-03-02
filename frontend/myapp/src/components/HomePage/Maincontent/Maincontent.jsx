import React from 'react';
import { Link } from 'react-router-dom';
import './Maincontent.css';

const MainContent = () => {
  return (
    <>
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Tính Năng Chính</h2>
            <p>Những công cụ hữu ích giúp theo dõi thai kỳ hiệu quả</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <img src="images/icon3.png" alt="feature-icon" />
              </div>
              <h3>Theo Dõi Tăng Trưởng</h3>
              <p>Cập nhật và theo dõi sự phát triển của thai nhi qua từng tuần</p>
              <Link to="/growth-tracker" className="feature-link">
                Xem chi tiết
              </Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="images/icon2.png" alt="feature-icon" />
              </div>
              <h3>Nhắc Nhở Thông Minh</h3>
              <p>Không bỏ lỡ các mốc khám thai và tiêm phòng quan trọng</p>
              <Link to="/appointment" className="feature-link">
                Xem chi tiết
              </Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="images/icon4.png" alt="feature-icon" />
              </div>
              <h3>Cảnh Báo Sớm</h3>
              <p>Phát hiện sớm các dấu hiệu bất thường trong thai kỳ</p>
              <Link to="/health-tips" className="feature-link">
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="tracking">
        <div className="container tracking-grid">
          <div className="tracking-content">
            <h2>Theo Dõi Thai Kỳ</h2>
            <p>Ghi lại hành trình phát triển của con yêu</p>
            <div className="tracking-features">
              <div className="tracking-item">
                <i className="fas fa-baby"></i>
                <div className="tracking-text">
                  <h4>Chỉ Số Thai Nhi</h4>
                  <p>Cân nặng và chiều cao theo tuần</p>
                  <Link to="/growth-tracker" className="tracking-link">
                    Khám phá
                  </Link>
                </div>
              </div>
              <div className="tracking-item">
                <i className="fas fa-heartbeat"></i>
                <div className="tracking-text">
                  <h4>Theo Dõi Sức Khỏe</h4>
                  <p>Các chỉ số quan trọng của mẹ</p>
                  <Link to="/health-tips" className="tracking-link">
                    Khám phá
                  </Link>
                </div>
              </div>
              <div className="tracking-item">
                <i className="fas fa-calendar-alt"></i>
                <div className="tracking-text">
                  <h4>Lịch Khám Thai</h4>
                  <p>Đặt lịch và nhắc nhở tự động</p>
                  <Link to="/appointment" className="tracking-link">
                    Khám phá
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="tracking-image">
            <img src="images/tracking-demo.png" alt="Tracking Features" />
          </div>
        </div>
      </section>
    </>
  );
};

export default MainContent;