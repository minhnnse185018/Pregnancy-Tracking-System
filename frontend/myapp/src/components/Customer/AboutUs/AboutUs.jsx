import React from "react";

export default function AboutUs() {
  const heroSection = {
    padding: "160px 0",
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
      <section style={heroSection}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img
                src="images/about-mainpicture.png"
                alt="About Mom and Baby"
                style={heroImage}
              />
            </div>
            <div className="col-md-6">
              <h2 style={heroHeading} className="mb-4">
                About Us
              </h2>
              <p style={heroText}>
                <strong>Mom & Baby</strong> is a trusted companion for expectant
                mothers and baby care. We provide useful information, quality
                services, and a friendly community to make your motherhood
                journey easier and more meaningful.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={servicesSection}>
        <div className="container">
          <h2 style={servicesHeading}>Why Choose Us?</h2>
          <div className="row">
            {[
              {
                title: "Useful Information",
                description:
                  "Providing scientific and up-to-date knowledge about pregnancy, childbirth, and baby care.",
                image: "images/home-icon5.png",
              },
              {
                title: "Pregnancy Tracking",
                description:
                  "Tools to track fetal development, remind prenatal check-ups, and vaccinations.",
                image: "images/home-icon3.png",
              },
              {
                title: "Mom Community",
                description:
                  "A place to share experiences, talk, and connect with other mothers on their motherhood journey.",
                image: "images/home-icon1.png",
              },
              {
                title: "Consultation Services",
                description:
                  "Expert advice on nutrition, health, and psychology for mothers and babies.",
                image: "images/home-icon2.png",
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

      <section style={statisticsSection}>
        <div className="container">
          <div className="row text-center">
            {[
              { count: "100,000+", label: "Satisfied Members" },
              { count: "50,000+", label: "Useful Articles" },
              { count: "200,000+", label: "Discussion Topics" },
              { count: "24/7", label: "Consultation Support" },
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
