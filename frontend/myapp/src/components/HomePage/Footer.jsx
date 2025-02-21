import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-4 mb-md-0">
            <h2 className="footer-heading">Mom & Baby</h2>
            <p>Đồng hành cùng mẹ bầu trên hành trình thai kỳ.</p>
          </div>

          <div className="col-md-6 col-lg-4 mb-4 mb-md-0">
            <h2 className="footer-heading">Quick Links</h2>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="py-2 d-block">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/about" className="py-2 d-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="py-2 d-block">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="py-2 d-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="py-2 d-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-6 col-lg-4 mb-4 mb-md-0">
            <h2 className="footer-heading">Have a Questions?</h2>
            <div className="block-23 mb-3">
              <ul>
                <li>
                  <span className="icon fas fa-map-marker-alt"></span>
                  <span className="text">
                    E2a-7, D1 Street, Long Thanh My, Thu Duc City, Ho Chi Minh City 700000
                  </span>
                </li>
                <li>
                  <Link to="#">
                    <span className="icon fas fa-phone"></span>
                    <span className="text">+84 702 290 548</span>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <span className="icon fas fa-paper-plane"></span>
                    <span className="text">babycenter8386@gmail.com</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12 text-center">
            <p className="copyright">
              Copyright &copy; {new Date().getFullYear()} Mom & Baby. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
