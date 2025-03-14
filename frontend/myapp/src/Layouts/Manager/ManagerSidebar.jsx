import BarChartIcon from "@mui/icons-material/BarChart"; // Icon for Manage Revenue
import DescriptionIcon from "@mui/icons-material/Description"; // Icon for Manage Blog
import EventIcon from "@mui/icons-material/Event"; // Icon for View Appointments
import GroupIcon from "@mui/icons-material/Group"; // Icon for Profile
import PaymentIcon from "@mui/icons-material/Payment"; // Icon for Manage Payroll
import PeopleIcon from "@mui/icons-material/People"; // Icon for Manage Personnel
import ScheduleIcon from "@mui/icons-material/Schedule"; // Icon for Manager Schedule
import StoreIcon from "@mui/icons-material/Store"; // Icon for Manage Services
import React from "react";
import { Link } from "react-router-dom";

const ManagerSidebar = () => {
  return (
    <div className="sidebar" style={sidebarStyle}>
      <ul style={listStyle}>
        <li style={listItemStyle}>
          <Link to="manager-profile" style={linkStyle}>
            <GroupIcon /> Profile
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="manager-revenue" style={linkStyle}>
            <BarChartIcon /> Manage Revenue
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="manager-personnel" style={linkStyle}>
            <PeopleIcon /> Manage Personnel
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="manager-services" style={linkStyle}>
            <StoreIcon /> Manage Services
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="manager-blog" style={linkStyle}>
            <DescriptionIcon /> Manage Blog
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="manager-payroll" style={linkStyle}>
            <PaymentIcon /> Manage Payroll
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="view-appointments" style={linkStyle}>
            <EventIcon /> View Appointments
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="manager-schedule" style={linkStyle}>
            <ScheduleIcon /> Manager Schedule
          </Link>
        </li>
      </ul>
    </div>
  );
};

// Sidebar styling aligned with AdminSidebar and Mom & Baby theme
const sidebarStyle = {
  width: "260px",
  backgroundColor: "#FFF5EE", // Creamy light color
  height: "100vh",
  padding: "20px 0",
  boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "0 20px 20px 0", // Rounded right corners
};

// List styling
const listStyle = {
  listStyleType: "none",
  padding: 0,
  color: "#D2691E", // Warm brown
};

// List item styling
const listItemStyle = {
  padding: "15px 20px",
  borderBottom: "1px solid #F4A8A8", // Soft pastel border
  fontWeight: "bold",
  textAlign: "left",
  transition: "background 0.3s, transform 0.2s",
  borderRadius: "10px",
};

// Link styling
const linkStyle = {
  textDecoration: "none",
  color: "#D2691E", // Warm brown
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  fontSize: "1rem",
  fontWeight: "600",
};

// Hover effect
const hoverStyle = {
  backgroundColor: "#FFDAB9", // Light peach on hover
  transform: "scale(1.05)",
};

// Apply hover effect (since inline styles don't support :hover, this is for reference)
listItemStyle[":hover"] = hoverStyle;

export default ManagerSidebar;