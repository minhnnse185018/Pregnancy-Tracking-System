import React from "react";
import { Link } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group"; // Icon cho Profile
import BarChartIcon from "@mui/icons-material/BarChart"; // Icon cho Manage Revenue
import PeopleIcon from "@mui/icons-material/People"; // Icon cho Manage Personnel
import StoreIcon from "@mui/icons-material/Store"; // Icon cho Manage Services
import DescriptionIcon from "@mui/icons-material/Description"; // Icon cho Manage Blog
import PaymentIcon from "@mui/icons-material/Payment"; // Icon cho Manage Payroll
import EventIcon from "@mui/icons-material/Event"; // Icon cho View Appointments
import ScheduleIcon from "@mui/icons-material/Schedule";
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

// Sidebar styling
const sidebarStyle = {
  width: "240px",
  backgroundColor: "#E8E8E8",
  height: "100vh", // Đảm bảo sidebar phủ toàn bộ chiều cao
};

// List styling
const listStyle = {
  listStyleType: "none",
  padding: 12,
  color: "#4CAF50",
  backgroundColor: "#DFDFDF",
};

// List item styling
const listItemStyle = {
  padding: "20px 0",
  borderBottom: "1px solid grey",
  fontWeight: "bold",
  textAlign: "left",
  transition: "background 0.3s",
};

// Link styling
const linkStyle = {
  textDecoration: "none",
  color: "#4CAF50", // Màu chữ chuyển sang xanh lá cây
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
};

// Hover effect
listItemStyle[":hover"] = {
  backgroundColor: "#BCBCBC",
};

export default ManagerSidebar;