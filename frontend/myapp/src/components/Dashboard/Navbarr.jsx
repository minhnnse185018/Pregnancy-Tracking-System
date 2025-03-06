import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
            <Nav.Link as={Link} to="/">Home Page</Nav.Link>
            <Nav.Link href="#features">Community</Nav.Link>
            <Nav.Link href="#tracking">Follow</Nav.Link>
            <Nav.Link href="membership">Member</Nav.Link>
            <Nav.Link href="blog">Blog</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout} className="text-danger">
                Đăng xuất
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-primary">
                Đăng nhập
              </Nav.Link>
            )}
            {!isLoggedIn && (
              <Nav.Link as={Link} to="/login" className="btn btn-success text-primary ms-2">
                Đăng ký
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbarr;
