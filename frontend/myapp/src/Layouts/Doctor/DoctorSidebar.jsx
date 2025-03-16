import PersonIcon from "@mui/icons-material/Person"; // Icon cho Doctor Profile
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman"; // Icon cho Patient Management
import React from "react";
import { Link } from "react-router-dom";

const DoctorSidebar = () => {
  return (
    <div className="sidebar" style={sidebarStyle}>
      <ul style={listStyle}>
        <li style={listItemStyle}>
          <Link to="/doctor/profile" style={linkStyle}>
            <PersonIcon /> Doctor Profile
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="/doctor/chat" style={linkStyle}>
            <PregnantWomanIcon /> Chat with Patients
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="/doctor/alert" style={linkStyle}>
            <PregnantWomanIcon /> Growth Tracker & Alerts
          </Link>
        </li>
      </ul>
    </div>
  );
};

// Sidebar styling đồng nhất với AdminSidebar
const sidebarStyle = {
  width: "260px",
  backgroundColor: "#FFF5EE", // Màu kem nhẹ
  height: "100vh",
  padding: "20px 0",
  boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "0 20px 20px 0",
};

const listStyle = {
  listStyleType: "none",
  padding: 0,
  color: "#D2691E", // Nâu ấm, đồng nhất với Admin
};

const listItemStyle = {
  padding: "15px 20px",
  borderBottom: "1px solid #F4A8A8", // Viền pastel nhẹ
  fontWeight: "bold",
  textAlign: "left",
  transition: "background 0.3s, transform 0.2s",
  borderRadius: "10px",
};

const linkStyle = {
  textDecoration: "none",
  color: "#D2691E", // Nâu ấm, đồng nhất với Admin
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  fontSize: "1rem",
  fontWeight: "600",
};

// Hover effect
listItemStyle[":hover"] = {
  backgroundColor: "#FFDAB9", // Cam pastel nhẹ khi hover, đồng nhất với Admin
  transform: "scale(1.05)",
};

export default DoctorSidebar;