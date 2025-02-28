"use client";

import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import CustomerNotificationMenu from "../CustomerNotificationMenu";
import UserIconDropdown from "../Dropdown";
import LoginButton from "../Login/LoginButton";
import "./Navbarr.css";

export default function Navbarr() {
  const { hasToken } = useContext(AuthContext); // Lấy state từ AuthContext
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(hasToken);

  useEffect(() => {
    setIsAuthenticated(hasToken); // Re-render khi token thay đổi
  }, [hasToken]);

  const handleOpenNotificationMenu = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  return (
    <nav className="navbar navbar-expand-lg ftco_navbar ftco-navbar-light scrolled" id="ftco-navbar">
      <div className="container">
        <div className="brand-container">
          <Link className="brand-text-link" to="/">
            <img className="navbar-logo" src="/images/logo.png" alt="MomCare Logo" />
            <span className="brand-text">Mom & Baby</span>
          </Link>
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#ftco-nav">
          <span className="fa fa-bars"></span>
        </button>

        <div className="collapse navbar-collapse nav-center" id="ftco-nav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/growth-tracker" className="nav-link">Tracker</Link>
            </li>
            <li className="nav-item">
              <Link to="/membership" className="nav-link">Member</Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link">Community</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <UserIconDropdown />
              <Tooltip title="Open notifications">
                <IconButton onClick={handleOpenNotificationMenu}>
                  <Badge color="error" variant="dot" invisible={unreadCount === 0}>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <CustomerNotificationMenu
                anchorEl={anchorElNotification}
                handleClose={handleCloseNotificationMenu}
                setUnreadCount={setUnreadCount}
              />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </nav>
  );
}