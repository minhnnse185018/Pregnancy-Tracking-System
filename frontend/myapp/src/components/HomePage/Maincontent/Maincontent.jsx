"use client"

import { EventAvailable, Forum, HealthAndSafety, ShowChart } from "@mui/icons-material";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import "./Maincontent.css";

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

const Maincontent = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  // Hàm xử lý cuộn đến phần Features
  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const links = {
    Appointment: "/appointment",
    tracker: "/growth-tracker",
    healthtips: "/health-tips",
    blog: "/blog",
    login: "/customer-login",
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark" : ""}`}>
      {/* Hero Section */}
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
            <h1 className="hero-title">Mom & Baby</h1>
            <p className="hero-description">
              Accompanying you on your journey of motherhood and baby care
            </p>
            <div className="hero-buttons">
              <button className="primary-button" onClick={scrollToFeatures}>
                Explore Now
              </button>
              <button className="secondary-button" onClick={() => navigate("/about")}>Learn More</button>
            </div>
            <div className="hero-image-container">
            </div>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Explore Features</h2>

        <div className="features-grid">
          {/* Feature 1 - Appointment */}
          <a href={links.Appointment} className="feature-card">
            <div className="feature-icon-container">
              <EventAvailable className="feature-icon" style={{ fontSize: 48, color: "#FF6F61" }} />
            </div>
            <h3 className="feature-title">Schedule a Checkup</h3>
            <p className="feature-description">
              Book doctor appointments and track important pregnancy milestones.
            </p>
          </a>

          {/* Feature 2 - Baby Growth Tracker */}
          <a href={links.tracker} className="feature-card">
            <div className="feature-icon-container">
              <ShowChart className="feature-icon" style={{ fontSize: 48, color: "#FFA07A" }} />
            </div>
            <h3 className="feature-title">Baby Growth Tracker</h3>
            <p className="feature-description">
              Monitor your baby's development and milestones with ease.
            </p>
          </a>

          {/* Feature 3 - Mom & Baby Care */}
          <a href={links.healthtips} className="feature-card">
            <div className="feature-icon-container">
              <HealthAndSafety className="feature-icon" style={{ fontSize: 48, color: "#4CAF50" }} />
            </div>
            <h3 className="feature-title">Mom & Baby Care</h3>
            <p className="feature-description">
              Find expert advice on postpartum care, nutrition, and baby wellness.
            </p>
          </a>

          {/* Feature 4 - Parenting Community */}
          <a href={links.blog} className="feature-card">
            <div className="feature-icon-container">
              <Forum className="feature-icon" style={{ fontSize: 48, color: "#42A5F5" }} />
            </div>
            <h3 className="feature-title">Parenting Community</h3>
            <p className="feature-description">
              Connect with other parents, share experiences, and get support.
            </p>
          </a>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Start Your Journey</h2>
          <p className="cta-description">
            Sign up today to receive personalized information and track your baby's growth.
          </p>
          <button className="cta-button" onClick={() => navigate("/customer-login")}>
            Sign Up for Free
          </button>
        </div>
      </section>

      {/* Background Text */}
      <div className="background-text">
        <h2>Mom & Baby</h2>
      </div>
    </div>
  );
};

export default Maincontent;