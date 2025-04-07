import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <footer
      style={{
        backgroundColor: "#FFE5E5", // Soft peach background
        color: "#4A4A4A", // Dark gray text
        padding: "80px 0",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 15px",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "0 -15px",
          }}
        >
          {/* Column 1: Mom & Baby */}
          <div
            style={{
              flex: "0 0 33.333333%",
              maxWidth: "33.333333%",
              padding: "0 15px",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#FF9999",
                borderLeft: "4px solid #FF9999",
                paddingLeft: "10px",
              }}
            >
              Mom & Baby
            </h2>
            <p
              style={{
                color: "#4A4A4A",
                lineHeight: "1.6",
                fontSize: "16px",
                marginBottom: "15px",
              }}
            >
              Accompanying mothers on their pregnancy journey.
            </p>
            <p
              style={{
                color: "#4A4A4A",
                lineHeight: "1.6",
                fontSize: "16px",
              }}
            >
              We provide high-quality products and services to support mothers
              and babies at every stage.
            </p>
            <p
              style={{
                color: "#4A4A4A",
                lineHeight: "1.6",
                fontSize: "16px",
                marginTop: "15px",
              }}
            >
              Let us help you have a healthy and happy journey!
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div
            style={{
              flex: "0 0 33.333333%",
              maxWidth: "33.333333%",
              padding: "0 15px",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#FF9999",
                borderLeft: "4px solid #FF9999",
                paddingLeft: "10px",
              }}
            >
              Quick Links
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li>
                <Link to="/" style={linkStyle} onClick={scrollToTop}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" style={linkStyle} onClick={scrollToTop}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/growth-tracker" style={linkStyle} onClick={scrollToTop}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/blog" style={linkStyle} onClick={scrollToTop}>
                  Blog
                </Link>
              </li>

              <li>
                <Link to="/health-tips" style={linkStyle} onClick={scrollToTop}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Have a Question? */}
          <div
            style={{
              flex: "0 0 33.333333%",
              maxWidth: "33.333333%",
              padding: "0 15px",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#FF9999",
                borderLeft: "4px solid #FF9999",
                paddingLeft: "10px",
              }}
            >
              Have a Question?
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={listItemStyle}>
                <span
                  className="icon fas fa-map-marker-alt"
                  style={iconStyle}
                ></span>{" "}
                E2a-7, D1 Street, Long Thanh My, Thu Duc City, Ho Chi Minh City
                700000
              </li>
              <li style={listItemStyle}>
                <span className="icon fas fa-phone" style={iconStyle}></span>{" "}
                1900 888 999
              </li>
              <li style={listItemStyle}>
                <span
                  className="icon fas fa-paper-plane"
                  style={iconStyle}
                ></span>{" "}
                mombabycaretracking@gmail.com
              </li>
              <li style={listItemStyle}>
                <span className="icon fas fa-clock" style={iconStyle}></span>{" "}
                Open: 9 AM - 6 PM
              </li>
            </ul> 
          </div>
        </div>

        <div
          style={{
            marginTop: "60px",
            borderTop: "1px solid #D3D3D3",
            paddingTop: "30px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#7A7A7A", margin: 0, fontSize: "14px" }}>
              Copyright © {new Date().getFullYear()} Mom & Baby. All rights
              reserved.
            </p>
            <p
              style={{ color: "#7A7A7A", margin: "10px 0 0", fontSize: "14px" }}
            >
              Designed with ❤️ by Mom & Baby Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const linkStyle = {
  display: "block",
  padding: "10px 0",
  color: "#66B2B2",
  textDecoration: "none",
  fontSize: "16px",
};

const listItemStyle = {
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
};

const iconStyle = {
  marginRight: "10px",
  fontSize: "18px",
  color: "#4A4A4A",
};

export default Footer;
