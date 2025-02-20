import React from 'react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
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
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
          >
            <SwiperSlide><img src='/images/hero-pregnancy.png' alt="Pregnancy Journey 1" /></SwiperSlide>
            <SwiperSlide><img src='/images/hero-pregnancy-2.png' alt="Pregnancy Journey 2" /></SwiperSlide>
            <SwiperSlide><img src='/images/hero-pregnancy-3.png' alt="Pregnancy Journey 3" /></SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Header;