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
    <div>
      <Navbar expand="lg" className="ftco_navbar ftco-navbar-light shadow-sm" id="ftco-navbar">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="brand-container">
            <img
              src="/images/logo.png"
              alt="MomCare Logo"
              className="navbar-logo"
            />
            <Link to="/" className="brand-text-link">
              <span className="brand-text">Mom & Baby</span>
            </Link>
          </div>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="fa fa-bars"></span> Menu
          </Navbar.Toggle>
          
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Nav className="nav-center">
              <Nav.Link as={Link} to="/" className="nav-link">Home</Nav.Link>
              <Nav.Link as={Link} to="/community" className="nav-link">Community</Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-link">About Us</Nav.Link>
              <Nav.Link as={Link} to="/tracking" className="nav-link">Follow</Nav.Link>
              <Nav.Link as={Link} to="/membership" className="nav-link">Member</Nav.Link>
              <Nav.Link as={Link} to="/blog" className="nav-link">Blog</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link">Contact</Nav.Link>
            </Nav>
            <Nav className="nav-auth">
              {isLoggedIn ? (
                <Nav.Link onClick={handleLogout} className="nav-link logout-link">
                  Logout
                </Nav.Link>
              ) : (
                <LoginButton />
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navbarr;
