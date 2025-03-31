import GroupIcon from "@mui/icons-material/Group"; // Icon cho Profile
import PeopleIcon from "@mui/icons-material/People"; // Icon cho Manage Personnel
import StoreIcon from "@mui/icons-material/Store"; // Icon cho Manage Salon
import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="sidebar" style={sidebarStyle}>
      <ul style={listStyle}>
        <li style={listItemStyle}>
          <Link to="admin-profile" style={linkStyle}>
            <GroupIcon /> Profile
          </Link>
        </li>
        {/* <li style={listItemStyle}>
          <Link to="admin-personnel" style={linkStyle}>
            <PeopleIcon /> Manage Personnel
          </Link>
        </li> */}
        <li style={listItemStyle}>
          <Link to="admin-memberplan" style={linkStyle}>
            <StoreIcon /> Manage Membership Plans
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="admin-customer" style={linkStyle}>
            <PeopleIcon /> Manage Customer
          </Link>
        </li>
      </ul>
    </div>
  );
};

// Sidebar styling phù hợp với chủ đề Mom and Baby
const sidebarStyle = {
  width: "260px",
  backgroundColor: "#FFF5EE", // Màu kem nhẹ
  height: "100vh",
  padding: "20px 0",
  boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "0 20px 20px 0", // Bo tròn góc phải
};

// List styling
const listStyle = {
  listStyleType: "none",
  padding: 0,
  color: "#D2691E", // Nâu ấm
};

// List item styling
const listItemStyle = {
  padding: "15px 20px",
  borderBottom: "1px solid #F4A8A8", // Viền pastel nhẹ
  fontWeight: "bold",
  textAlign: "left",
  transition: "background 0.3s, transform 0.2s",
  borderRadius: "10px",
};

// Link styling
const linkStyle = {
  textDecoration: "none",
  color: "#D2691E", // Nâu ấm
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  fontSize: "1rem",
  fontWeight: "600",
};

// Hover effect
listItemStyle[":hover"] = {
  backgroundColor: "#FFDAB9", // Màu cam pastel nhẹ khi hover
  transform: "scale(1.05)",
};

export default AdminSidebar;
