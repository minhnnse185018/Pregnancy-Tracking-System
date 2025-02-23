import React from "react";
import { Link } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group"; // Icon cho Profile
import PeopleIcon from "@mui/icons-material/People"; // Icon cho Manage Personnel
import StoreIcon from "@mui/icons-material/Store"; // Icon cho Manage Salon

const AdminSidebar = () => {
  return (
    <div className="sidebar" style={sidebarStyle}>
      <ul style={listStyle}>
        <li style={listItemStyle}>
          <Link to="admin-profile" style={linkStyle}>
            <GroupIcon /> Profile
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="admin-personnel" style={linkStyle}>
            <PeopleIcon /> Manage Personnel
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="admin-salon" style={linkStyle}>
            <StoreIcon /> Manage Salon
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
  color: "#4CAF50", // Chuyển màu chữ sang xanh lá cây
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

export default AdminSidebar;