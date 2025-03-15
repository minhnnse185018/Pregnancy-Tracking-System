import { Typography } from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BreadcrumbsHeader from "../../components/Dashboard/breadcum";
import HeaderInternal from "../../components/Dashboard/HeaderInternal";
import DoctorSidebar from "./DoctorSidebar"; // Sidebar dành cho Doctor

const DoctorLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/doctor";

  return (
    <div style={mainWrapperStyle}>
      <HeaderInternal />
      <div style={breadcrumbWrapperStyle}>
        <BreadcrumbsHeader />
      </div>
      <div style={managerLayoutStyle}>
        <DoctorSidebar /> {/* Sidebar dành cho Doctor */}
        <div style={managerContentStyle}>
          {isDashboard && (
            <div style={backgroundContainerStyle}>
              <div style={overlayStyle}>
                <Typography variant="h4" style={welcomeTextStyle}>
                  Welcome, Doctor!
                </Typography>
                <Typography variant="h6" style={quoteTextStyle}>
                  "Supporting expectant mothers with care and expertise."
                </Typography>
              </div>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Styles
const mainWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
};

const breadcrumbWrapperStyle = {
  width: "100%",
  padding: "10px 20px",
  backgroundColor: "#f5f5f5",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};

const managerLayoutStyle = {
  display: "flex",
  flex: 1,
  overflow: "hidden",
};

const managerContentStyle = {
  flex: 1,
  padding: "0px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};

const backgroundContainerStyle = {
  flex: 1,
  backgroundImage: 'url("https://i.pinimg.com/474x/3e/b3/84/3eb384e241d905ce3526423f313d7a50.jpg")',
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundColor: "#FFF5EE", // Màu nền nhẹ nhàng
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
};

const overlayStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: "40px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  animation: "fadeIn 2s ease-in-out",
};

const welcomeTextStyle = {
  color: "#fff",
  fontWeight: "bold",
  fontSize: "2.5rem",
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
  marginBottom: "10px",
  animation: "slideIn 1.5s ease-in-out",
};

const quoteTextStyle = {
  fontStyle: "italic",
  color: "#fff",
  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
  animation: "fadeIn 2.5s ease-in-out",
};

export default DoctorLayout;