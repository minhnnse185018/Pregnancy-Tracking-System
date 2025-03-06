"use client";

import EventIcon from "@mui/icons-material/Event"; // Icon cho Book Appointment
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety"; // Icon cho Health Tips
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // Icon cho Growth Tracker
import { Badge, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
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
  const [anchorElService, setAnchorElService] = useState(null); // State cho dropdown Service
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(hasToken);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State để kiểm soát toggle menu

  useEffect(() => {
    setIsAuthenticated(hasToken); // Re-render khi token thay đổi
  }, [hasToken]);

  // Xử lý mở/đóng menu thông báo
  const handleOpenNotificationMenu = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  // Xử lý mở/đóng menu Service
  const handleOpenServiceMenu = (event) => {
    setAnchorElService(event.currentTarget);
  };

  const handleCloseServiceMenu = () => {
    setAnchorElService(null);
  };

  // Xử lý toggle menu khi nhấp vào hamburger
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg ftco-navbar-light scrolled" id="ftco-navbar">
      <div className="container">
        <div className="brand-container">
          <Link className="brand-text-link" to="/">
            <img className="navbar-logo" src="/images/logo.png" alt="MomCare Logo" />
            <span className="brand-text">Mom & Baby</span>
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="ftco-nav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          onClick={handleToggleMenu} // Thêm sự kiện toggle
        >
          <span className="fa fa-bars"></span>
        </button>

        <div
          className={`collapse navbar-collapse nav-center ${isMenuOpen ? "show" : ""}`}
          id="ftco-nav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <span
                className="nav-link"
                onClick={(e) => {
                  handleOpenServiceMenu(e);
                  setIsMenuOpen(false); // Đóng menu khi chọn Service
                }}
              >
                Service
              </span>
              <Menu
                anchorEl={anchorElService}
                open={Boolean(anchorElService)}
                onClose={handleCloseServiceMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <MenuItem onClick={() => { handleCloseServiceMenu(); setIsMenuOpen(false); }}>
                  <ListItemIcon>
                    <TrendingUpIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <Link to="/growth-tracker" style={{ textDecoration: "none", color: "inherit" }}>
                      Growth Tracker
                    </Link>
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { handleCloseServiceMenu(); setIsMenuOpen(false); }}>
                  <ListItemIcon>
                    <EventIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <Link to="/appointment" style={{ textDecoration: "none", color: "inherit" }}>
                      Book Appointment
                    </Link>
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { handleCloseServiceMenu(); setIsMenuOpen(false); }}>
                  <ListItemIcon>
                    <HealthAndSafetyIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <Link to="/health-tips" style={{ textDecoration: "none", color: "inherit" }}>
                      Health Tips
                    </Link>
                  </ListItemText>
                </MenuItem>
              </Menu>
            </li>
            <li className="nav-item">
              <Link to="/membership" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Member
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <UserIconDropdown onClick={() => setIsMenuOpen(false)} />
              <Tooltip title="Open notifications">
                <IconButton onClick={(e) => { handleOpenNotificationMenu(e); setIsMenuOpen(false); }}>
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
            <LoginButton onClick={() => setIsMenuOpen(false)} />
          )}
        </div>
      </div>
    </nav>
  );
}