import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#FFE5E5', // Soft peach background
      color: '#4A4A4A', // Dark gray text
      padding: '80px 0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 15px',
        marginTop: '40px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: '0 -15px'
        }}>
          {/* Cột 1: Mom & Baby */}
          <div style={{
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 15px',
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: '24px', // Increased from 20px to 24px
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#FF9999', // Soft coral for headings
              borderLeft: '4px solid #FF9999',
              paddingLeft: '10px'
            }}>Mom & Baby</h2>
            <p style={{
              color: '#4A4A4A',
              lineHeight: '1.6',
              fontSize: '16px', // Increased from 14px to 16px
              marginBottom: '15px'
            }}>Đồng hành cùng mẹ bầu trên hành trình thai kỳ.</p>
            <p style={{
              color: '#4A4A4A',
              lineHeight: '1.6',
              fontSize: '16px' // Increased from 14px to 16px
            }}>
              Chúng tôi cung cấp các sản phẩm và dịch vụ chất lượng cao để hỗ trợ mẹ và bé trong mọi giai đoạn.
            </p>
            <p style={{
              color: '#4A4A4A',
              lineHeight: '1.6',
              fontSize: '16px', // Increased from 14px to 16px
              marginTop: '15px'
            }}>
              Hãy để chúng tôi giúp bạn có một hành trình khỏe mạnh và hạnh phúc!
            </p>
          </div>

          {/* Cột 2: Quick Links */}
          <div style={{
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 15px',
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: '24px', // Increased from 20px to 24px
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#FF9999', // Soft coral for headings
              borderLeft: '4px solid #FF9999',
              paddingLeft: '10px'
            }}>Quick Links</h2>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li>
                <Link to="/" style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#66B2B2', // Muted teal for links
                  textDecoration: 'none',
                  fontSize: '16px' // Increased from 14px to 16px
                }}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/about" style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#66B2B2',
                  textDecoration: 'none',
                  fontSize: '16px' // Increased from 14px to 16px
                }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#66B2B2',
                  textDecoration: 'none',
                  fontSize: '16px' // Increased from 14px to 16px
                }}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/blog" style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#66B2B2',
                  textDecoration: 'none',
                  fontSize: '16px' // Increased from 14px to 16px
                }}>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#66B2B2',
                  textDecoration: 'none',
                  fontSize: '16px' // Increased from 14px to 16px
                }}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#66B2B2',
                  textDecoration: 'none',
                  fontSize: '16px' // Increased from 14px to 16px
                }}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#66B2B2',
                  textDecoration: 'none',
                  fontSize: '16px' // Increased from 14px to 16px
                }}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Have a Questions */}
          <div style={{
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 15px',
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: '24px', // Increased from 20px to 24px
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#FF9999', // Soft coral for headings
              borderLeft: '4px solid #FF9999',
              paddingLeft: '10px'
            }}>Have a Questions?</h2>
            <div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <span style={{
                    marginRight: '10px',
                    color: '#4A4A4A',
                    fontSize: '18px' // Increased from 16px to 18px
                  }} className="icon fas fa-map-marker-alt"></span>
                  <span style={{
                    color: '#4A4A4A',
                    lineHeight: '1.6',
                    fontSize: '16px' // Increased from 14px to 16px
                  }}>
                    E2a-7, D1 Street, Long Thanh My, Thu Duc City, Ho Chi Minh City 700000
                  </span>
                </li>
                <li style={{
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Link to="#" style={{
                    color: '#66B2B2',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      marginRight: '10px',
                      fontSize: '18px', // Increased from 16px to 18px
                      color: '#4A4A4A'
                    }} className="icon fas fa-phone"></span>
                    <span style={{ fontSize: '16px' }}>+84 702 290 548</span> {/* Increased from 14px to 16px */}
                  </Link>
                </li>
                <li style={{
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Link to="#" style={{
                    color: '#66B2B2',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      marginRight: '10px',
                      fontSize: '18px', // Increased from 16px to 18px
                      color: '#4A4A4A'
                    }} className="icon fas fa-paper-plane"></span>
                    <span style={{ fontSize: '16px' }}>babycenter8386@gmail.com</span> {/* Increased from 14px to 16px */}
                  </Link>
                </li>
                <li style={{
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Link to="#" style={{
                    color: '#66B2B2',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      marginRight: '10px',
                      fontSize: '18px', // Increased from 16px to 18px
                      color: '#4A4A4A'
                    }} className="icon fas fa-clock"></span>
                    <span style={{ fontSize: '16px' }}>Open: 9 AM - 6 PM</span> {/* Increased from 14px to 16px */}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{
          marginTop: '60px',
          borderTop: '1px solid #D3D3D3',
          paddingTop: '30px'
        }}>
          <div style={{
            textAlign: 'center'
          }}>
            <p style={{
              color: '#7A7A7A',
              margin: 0,
              fontSize: '14px' // Increased from 12px to 14px
            }}>
              Copyright © {new Date().getFullYear()} Mom & Baby. Tất cả quyền được bảo lưu.
            </p>
            <p style={{
              color: '#7A7A7A',
              margin: '10px 0 0',
              fontSize: '14px' // Increased from 12px to 14px
            }}>
              Designed with ❤️ by Mom & Baby Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;