import React from "react";
import styled from "styled-components";

// Styled Components
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #fff0f5 0%,
    #fce4e8 100%
  ); /* Gradient nhẹ nhàng */
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-image: url("/images/swiper5.png"); /* Hình nền tĩnh từ Maincontent */
  background-size: cover;
  background-position: center;
  filter: brightness(0.85); /* Mờ nhẹ để nổi bật chữ */
`;

const HeroContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
`;

const HeroTitle = styled.h1`
  color: #ff8989; /* Màu hồng mới */
  font-size: 3.5rem;
  text-shadow: 2px 2px 8px rgba(236, 219, 219, 0.6);
  margin-bottom: 20px;
  font-family: "Arial", sans-serif;
`;

const HeroDescription = styled.p`
  color: #ff8989; /* Màu hồng mới */
  font-size: 1.6rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  margin: 0 auto;
`;

const ServicesSection = styled.section`
  padding: 60px 0;
  background-color: #fff; /* Nền trắng để làm nổi bật nội dung */
`;

const SectionTitle = styled.h2`
  color: #ff8989; /* Màu hồng mới */
  font-size: 2.5rem;
  text-shadow: 2px 2px 6px rgba(11, 140, 196, 0.4);
  text-align: center;
  margin-bottom: 40px;
`;

const ServiceCard = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #fce4ec 0%, #fff 100%);
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ServiceIcon = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 20px;
`;

const ServiceTitle = styled.h3`
  color: #ff8989; /* Màu hồng mới */
  font-size: 1.6rem;
  margin-bottom: 10px;
`;

const ServiceDescription = styled.p`
  color: #6b7280; /* Xám đậm để dễ đọc */
  font-size: 1.1rem;
`;

const StatsSection = styled.section`
  background: linear-gradient(
    135deg,
    #ffb6c1 0%,
    #f8c1cc 100%
  ); /* Gradient hồng đậm */
  padding: 40px 0;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.h2`
  color: #ffffff; /* Trắng để nổi bật trên nền gradient */
  font-size: 2.8rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
`;

const StatLabel = styled.p`
  color: #ff8989; /* Màu hồng mới */
  font-size: 1.3rem;
`;

const AboutUs = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection>
        <HeroBackground />
        <HeroContainer>
          <div>
            <HeroTitle>About Mom & Baby</HeroTitle>
            <HeroDescription>
              We are your trusted companion, offering warm support and helpful
              information for your motherhood journey.
            </HeroDescription>
          </div>
        </HeroContainer>
      </HeroSection>

      {/* Services Section */}
      <ServicesSection>
        <div className="container">
          <SectionTitle>Why Choose Us?</SectionTitle>
          <div className="row">
            {[
              {
                title: "Knowledge Support",
                description:
                  "Scientific and up-to-date information on pregnancy, childbirth, and baby care.",
                image: "images/home-icon5.png",
              },
              {
                title: "Pregnancy Tracking",
                description:
                  "Tools to monitor your baby’s growth and remind you of checkup schedules.",
                image: "images/home-icon3.png",
              },
              {
                title: "Mom Community",
                description:
                  "Connect and share with other moms on your motherhood journey.",
                image: "images/home-icon1.png",
              },
              {
                title: "Expert Advice",
                description:
                  "Support from experts on health, nutrition, and emotional well-being.",
                image: "images/home-icon2.png",
              },
            ].map((service, index) => (
              <div key={index} className="col-md-6">
                <ServiceCard>
                  <ServiceIcon src={service.image} alt={service.title} />
                  <div>
                    <ServiceTitle>{service.title}</ServiceTitle>
                    <ServiceDescription>
                      {service.description}
                    </ServiceDescription>
                  </div>
                </ServiceCard>
              </div>
            ))}
          </div>
        </div>
      </ServicesSection>

      {/* Statistics Section */}
      <StatsSection>
        <div className="container">
          <div className="row text-center">
            {[
              { count: "1,000+", label: "Trusted Moms" },
              { count: "5,000+", label: "Helpful Articles" },
              { count: "2,000+", label: "Discussion Topics" },
              { count: "24/7", label: "Continuous Support" },
            ].map((stat, index) => (
              <div key={index} className="col-sm-3">
                <StatItem>
                  <StatNumber>{stat.count}</StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </StatItem>
              </div>
            ))}
          </div>
        </div>
      </StatsSection>
    </div>
  );
};

export default AboutUs;
