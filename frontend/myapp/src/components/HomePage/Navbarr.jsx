import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginButton from '../Customer/Login/LoginButton';
import './Navbarr.css';

function Navbarr() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.error('Logged out successfully!');
  };

  return (
    <Navbar expand="lg" className="bg-light shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="images/logo.png"
            alt="MomCare Logo"
            width="40"
            height="40"
            className="me-2"
          />
          <span className="fw-bold">Mom & Baby</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
            <Nav.Link href="#features">Cộng Đồng</Nav.Link>
            <Nav.Link href="about">About Us</Nav.Link>
            <Nav.Link href="#tracking">Theo dõi</Nav.Link>
            <Nav.Link href="membership">Member</Nav.Link>
            <Nav.Link href="blog">Blog</Nav.Link>
            <Nav.Link href="contact">Contact</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout} className="text-danger">
                Đăng xuất
              </Nav.Link>
            ) : (
              <>
                <LoginButton />
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbarr;