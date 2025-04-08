import EventIcon from "@mui/icons-material/Event";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import CustomerNotificationMenu from "../CustomerNotificationMenu";
import UserIconDropdown from "../Dropdown";
import LoginButton from "../Login/LoginButton";

export default function Navbarr() {
  const { hasToken } = useContext(AuthContext);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [anchorElService, setAnchorElService] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(hasToken);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(hasToken);
  }, [hasToken]);

  const handleOpenNotificationMenu = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  const handleOpenServiceMenu = (event) => {
    setAnchorElService(event.currentTarget);
  };

  const handleCloseServiceMenu = () => {
    setAnchorElService(null);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const styles = `
  /* Navbar Styles */
  .ftco-navbar-light {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: #fff !important;
    padding: 10px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  /* Container adjustments */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
  }

  /* Brand container styles */
  .brand-container {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 220px;
  }

  /* Logo styles */
  .navbar-logo {
    width: 70px;
    height: 70px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  .brand-text-link:hover .navbar-logo {
    transform: scale(1.1);
  }

  /* Brand text styles */
  .brand-text-link {
    text-decoration: none !important;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .brand-text {
    color: #f06292; /* Hồng nhạt đậm hơn */
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    transition: color 0.3s ease;
  }

  .brand-text-link:hover .brand-text {
    color: #ec407a; /* Hồng đậm vừa khi hover */
  }

  /* Navigation center styles */
  .nav-center {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    gap: 12px;
    flex-wrap: nowrap;
  }

  .nav-link {
    color: #f06292 !important; /* Hồng nhạt đậm hơn */
    font-size: 15px !important;
    padding: 8px 12px !important;
    font-weight: 600 !important;
    text-transform: uppercase;
    transition: color 0.3s ease;
    position: relative;
    white-space: nowrap;
  }

  .nav-link:hover {
    color: #4db6ac !important; /* Xanh teal nhạt khi hover */
  }

  /* Hover effect underline */
  .nav-link::after {
    content: "";
    position: absolute;
    bottom: 4px;
    left: 50%;
    width: 0;
    height: 2px;
    background: #4db6ac; /* Xanh teal nhạt cho gạch chân */
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  .nav-link:hover::after {
    width: 60%;
  }

  /* Auth section styles */
  .nav-auth {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 120px;
    justify-content: flex-end;
    flex-wrap: nowrap;
  }

  /* Hamburger button styles */
  .navbar-toggler {
    border: none;
    padding: 5px 10px;
    background-color: transparent;
    cursor: pointer;
    display: none;
  }

  .navbar-toggler .fa-bars {
    color: #f06292; /* Hồng nhạt đậm hơn */
    font-size: 20px;
  }

  .navbar-toggler:focus {
    box-shadow: none;
  }

  /* Responsive adjustments */
  @media (max-width: 991.98px) {
    .ftco-navbar-light {
      padding: 8px 0;
    }

    .container {
      flex-wrap: wrap;
    }

    .navbar-toggler {
      display: block;
    }

    .navbar-collapse {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #fff;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 0 0 5px 5px;
    }

    .nav-center {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
      flex-wrap: wrap;
    }

    .nav-link {
      padding: 10px 15px !important;
      text-align: left;
      text-transform: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .nav-link:last-child {
      border-bottom: none;
    }

    .nav-auth {
      margin-top: 10px;
      justify-content: flex-start;
      gap: 15px;
    }

    .navbar-logo {
      width: 50px;
      height: 50px;
    }

    .brand-text {
      font-size: 18px;
    }
  }

  /* Dropdown menu styles */
  .MuiMenuItem-root {
    padding: 8px 16px;
    transition: background-color 0.3s ease;
  }

  .MuiListItemIcon-root {
    min-width: 30px;
    color: #f06292; /* Hồng nhạt đậm hơn */
  }

  .MuiListItemText-primary {
    font-size: 14px;
    color: #f06292; /* Hồng nhạt đậm hơn */
    font-weight: 500;
  }

  .MuiMenuItem-root:hover {
    background-color: #fce4ec; /* Giữ nguyên nền hồng nhạt */
    color: #4db6ac; /* Xanh teal nhạt khi hover */
  }
`;

  return (
    <nav className="navbar navbar-expand-lg ftco-navbar-light" id="ftco-navbar">
      <style>{styles}</style>
      <div className="container">
        <div className="brand-container">
          <Link className="brand-text-link" to="/">
            <img
              className="navbar-logo"
              src="/images/logo.png"
              alt="MomCare Logo"
            />
            <span className="brand-text">Mom & Baby</span>
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="ftco-nav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          onClick={handleToggleMenu}
        >
          <span className="fa fa-bars"></span>
        </button>

        <div
          className={`collapse navbar-collapse nav-center ${
            isMenuOpen ? "show" : ""
          }`}
          id="ftco-nav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <span
                className="nav-link"
                onClick={(e) => {
                  handleOpenServiceMenu(e);
                  setIsMenuOpen(false);
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
                <MenuItem
                  onClick={() => {
                    handleCloseServiceMenu();
                    setIsMenuOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <TrendingUpIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      to="/growth-tracker"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Growth Tracker
                    </Link>
                  </ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseServiceMenu();
                    setIsMenuOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <EventIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      to="/appointment"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Remind Appointment
                    </Link>
                  </ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseServiceMenu();
                    setIsMenuOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <HealthAndSafetyIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      to="/health-tips"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Health Tips
                    </Link>
                  </ListItemText>
                </MenuItem>
              </Menu>
            </li>
            <li className="nav-item">
              <Link
                to="/membership"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Member
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/blog"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            {/* </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link> */}
            </li>
          </ul>
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <UserIconDropdown onClick={() => setIsMenuOpen(false)} />
              <Tooltip title="Open notifications">
                <IconButton
                  onClick={(e) => {
                    handleOpenNotificationMenu(e);
                    setIsMenuOpen(false);
                  }}
                >
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={unreadCount === 0}
                  >
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