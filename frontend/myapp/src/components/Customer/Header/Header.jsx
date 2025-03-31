import React from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Styled components cho Header
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Container = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const HeroContent = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  color: #f8c1cc !important; /* Hồng nhạt chính, dịu dàng */
  font-size: 3.5rem;
  text-shadow: 2px 2px 6px rgba(236, 219, 219, 0.3);
  line-height: 1.2;
  margin: 0;
`;

const Subtitle = styled.h2`
  color: #fcd1d7 !important; /* Hồng nhạt sáng hơn một chút, đồng điệu với Title */
  font-size: 2.5rem;
  text-shadow: 2px 2px 6px rgba(11, 140, 196, 0.3);
  line-height: 1.2;
  margin: 0;
`;

const Description = styled.p`
  color: #fce4e8 !important; /* Hồng rất nhạt, gần trắng, tạo sự mềm mại */
  font-size: 1.5rem;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
  margin: 20px 0;
`;

const HeroButtons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const PrimaryButton = styled.a`
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.2rem;
  background-color: #f8c1cc; /* Hồng nhạt, đồng bộ với Title */
  color: #5a5a5a; /* Xám nhẹ làm màu chữ */
`;

const SecondaryButton = styled.a`
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.2rem;
  background-color: transparent;
  color: #fff0f3; /* Hồng trắng rất nhạt, gần với Description */
  border: 2px solid #fff0f3;
`;

const Header = () => {
  return (
    <div>
      <ToastContainer />
      <HeroSection className="hero">
        <HeroBackground className="hero-background">
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
            <SwiperSlide><img src='/images/about-mainpicture.png' alt="Pregnancy Journey 2" /></SwiperSlide>
            <SwiperSlide><img src='/images/tracking-demo.png' alt="Pregnancy Journey 3" /></SwiperSlide>
          </Swiper>
        </HeroBackground>
        <Container className="container hero-grid">
          <HeroContent className="hero-content">
            <Title>Chào mừng đến với<br />Mom & Baby</Title>
            <Subtitle>Đồng hành cùng mẹ trên hành trình thai kỳ</Subtitle>
            <Description>Theo dõi sự phát triển của thai nhi một cách khoa học và chính xác với các tính năng thông minh.</Description>
            <HeroButtons className="hero-buttons">
              <PrimaryButton href="customer-login" className="btn-primary">Bắt đầu ngay</PrimaryButton>
              <SecondaryButton href="#learn-more" className="btn-secondary">Tìm hiểu thêm</SecondaryButton>
            </HeroButtons>
          </HeroContent>
        </Container>
      </HeroSection>
    </div>
  );
};

export default Header;