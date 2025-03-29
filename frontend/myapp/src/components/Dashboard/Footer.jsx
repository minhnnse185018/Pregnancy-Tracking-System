import React from 'react';
import styled from 'styled-components';
import BlogPage from '../Customer/BlogPage/BlogPage';

const FooterWrapper = styled.footer`
  background: var(--background);
  padding: 64px 0 32px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 64px;
  margin-bottom: 32px;
`;

const FooterLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
`;

const FooterSection = styled.div`
  h4 {
    font-size: 18px;
    margin-bottom: 24px;
    color: var(--text-primary);
  }

  ul {
    list-style: none;
  }

  ul li {
    margin-bottom: 12px;
  }

  a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.3s;
  }

  a:hover {
    color: var(--deep-pink);
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 32px;
  border-top: 1px solid var(--secondary-pink);
  color: var(--text-secondary);
`;

function Footer() {
  return (
    <FooterWrapper>
      <div className="container">
        <FooterContent>
          <div className="footer-info">
            <div className="logo">
              <img src="images/logo.png" alt="MomCare Logo" />
              <span>Mom & Baby</span>
            </div>
            <p>Đồng hành cùng mẹ bầu trên hành trình thai kỳ</p>
          </div>
          <FooterLinks>
            <FooterSection>
              <h4>Thông Tin</h4>
              <ul>
                <li><a href="#about">Về chúng tôi</a></li>
                <li><a href="#contact">Liên hệ</a></li>
                <li><a href="blog">Blog</a></li>
              </ul>
            </FooterSection>
            <FooterSection>
              <h4>Hỗ Trợ</h4>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#terms">Điều khoản</a></li>
                <li><a href="#privacy">Bảo mật</a></li>
              </ul>
            </FooterSection>
          </FooterLinks>
        </FooterContent>
        <FooterBottom>
          <p>&copy; 2024 Mom & Baby. Tất cả quyền được bảo lưu.</p>
        </FooterBottom>
      </div>
    </FooterWrapper>
  );
}

export default Footer;
