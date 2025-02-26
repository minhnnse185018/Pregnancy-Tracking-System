import React from "react";

export default function AboutUs() {
  // Define styles as JavaScript objects
  const heroSection = {
    padding: "60px 0",
  };

  const heroImage = {
    borderRadius: "15px",
    width: "100%",
    height: "auto",
  };

  const heroHeading = {
    fontSize: "36px",
    color: "#2D3436",
  };

  const heroText = {
    fontSize: "18px",
    color: "#636E72",
  };

  const servicesSection = {
    backgroundColor: "#FFF0F5",
    padding: "60px 0",
  };

  const servicesHeading = {
    fontSize: "36px",
    color: "#FF69B4",
    textAlign: "center",
    marginBottom: "50px",
  };

  const serviceItem = {
    display: "flex",
    marginBottom: "30px",
  };

  const serviceIconContainer = {
    backgroundColor: "#FFE4E1",
    padding: "15px",
    borderRadius: "50%",
    marginRight: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "80px",
  };

  const serviceIcon = {
    width: "60px",
    height: "60px",
  };

  const serviceTitle = {
    fontSize: "24px",
    color: "#2D3436",
    marginBottom: "10px",
  };

  const serviceDescription = {
    color: "#636E72",
  };

  const statisticsSection = {
    backgroundColor: "#FFB6C1",
    padding: "60px 0",
  };

  const statItem = {
    marginBottom: "30px",
  };

  const statNumber = {
    fontSize: "48px",
    color: "#FFFFFF",
  };

  const statLabel = {
    fontSize: "18px",
    color: "#FFFFFF",
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={heroSection}>
        <div className="container">
          <div className="row align-items-center">
            {/* Image Section */}
            <div className="col-md-6">
              <img
                src="images/about-mainpicture.png"
                alt="About Mom and Baby"
                style={heroImage}
              />
            </div>
            {/* Text Section */}
            <div className="col-md-6">
              <h2 style={heroHeading} className="mb-4">
                Về Chúng Tôi
              </h2>
              <p style={heroText}>
                <strong>Mom & Baby</strong> là người bạn đồng hành đáng tin cậy
                dành cho các bà mẹ mang thai và chăm sóc em bé. Chúng tôi cung
                cấp những thông tin hữu ích, dịch vụ chất lượng và cộng đồng
                thân thiện để giúp hành trình làm mẹ của bạn trở nên dễ dàng và
                ý nghĩa hơn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={servicesSection}>
        <div className="container">
          <h2 style={servicesHeading}>Tại Sao Chọn Chúng Tôi?</h2>
          <div className="row">
            {[
              {
                title: "Thông Tin Hữu Ích",
                description:
                  "Cung cấp kiến thức về mang thai, sinh nở và chăm sóc bé một cách khoa học và cập nhật nhất.",
                image: "images/about2.png",
              },
              {
                title: "Theo Dõi Thai Kỳ",
                description:
                  "Công cụ theo dõi sự phát triển của thai nhi, nhắc nhở lịch khám thai và tiêm phòng.",
                image: "images/icon4.png",
              },
              {
                title: "Cộng Đồng Mẹ Bầu",
                description:
                  "Nơi chia sẻ kinh nghiệm, tâm sự và kết nối với các bà mẹ khác trong hành trình làm mẹ.",
                image: "images/about-1.png",
              },
              {
                title: "Dịch Vụ Tư Vấn",
                description:
                  "Hỗ trợ tư vấn từ các chuyên gia về dinh dưỡng, sức khỏe và tâm lý cho mẹ và bé.",
                image: "images/icon3.png",
              },
            ].map((service, index) => (
              <div key={index} className="col-md-6" style={serviceItem}>
                <div style={serviceIconContainer}>
                  <img
                    src={service.image}
                    alt={service.title}
                    style={serviceIcon}
                  />
                </div>
                <div>
                  <h4 style={serviceTitle}>{service.title}</h4>
                  <p style={serviceDescription}>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={statisticsSection}>
        <div className="container">
          <div className="row text-center">
            {[
              { count: "100,000+", label: "Thành Viên Hài Lòng" },
              { count: "50,000+", label: "Bài Viết Hữu Ích" },
              { count: "200,000+", label: "Chủ Đề Thảo Luận" },
              { count: "24/7", label: "Hỗ Trợ Tư Vấn" },
            ].map((stat, index) => (
              <div key={index} className="col-sm-3" style={statItem}>
                <h2 style={statNumber}>{stat.count}</h2>
                <p style={statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}