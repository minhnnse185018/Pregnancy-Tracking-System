import "@fontsource/poppins"; // Import font chữ Poppins
import { Typography } from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BreadcrumbsHeader from "../../components/Dashboard/breadcum";
import HeaderInternal from "../../components/Dashboard/HeaderInternal";
import ManagerSidebar from "./ManagerSidebar";

const ManagerLayout = () => {
  const location = useLocation(); // Lấy thông tin route hiện tại

  // Kiểm tra nếu đang ở trang chính của Manager Dashboard
  const isDashboard = location.pathname === "/manager";

  return (
    <div style={mainWrapperStyle}>
      <HeaderInternal /> {/* Giữ nguyên header */}
      <div style={breadcrumbWrapperStyle}>
        <BreadcrumbsHeader /> {/* Breadcrumb nằm ngay dưới header */}
      </div>
      <div style={managerLayoutStyle}>
        <ManagerSidebar /> {/* Giữ nguyên sidebar */}
        <div style={managerContentStyle}>
          {/* Chỉ hiển thị phần chào mừng khi ở trang chính */}
          {isDashboard && (
            <div style={backgroundContainerStyle}>
              <div style={overlayStyle}>
                <Typography variant="h4" style={welcomeTextStyle}>
                  Welcome to Manager Dashboard
                </Typography>
                <Typography variant="h6" style={quoteTextStyle}>
                  "Success is not the key to happiness. Happiness is the key to
                  success. If you love what you are doing, you will be
                  successful."
                </Typography>
              </div>
            </div>
          )}

          {/* Phần Outlet để render các trang con */}
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
  padding: "0px", // Loại bỏ padding để nền phủ kín
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};

const backgroundContainerStyle = {
  flex: 1,
  backgroundImage:
    'url("https://img1.wallspic.com/previews/3/5/1/3/3/133153/133153-holding_hands-childbirth-organ-health-heart-550x310.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
};

const overlayStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay xám
  padding: "40px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  animation: "fadeIn 2s ease-in-out", // Hiệu ứng động cho overlay
};

const welcomeTextStyle = {
  color: "#fff",
  fontWeight: "bold",
  fontFamily: "Poppins, sans-serif", // Thay đổi font chữ
  fontSize: "2.5rem",
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
  marginBottom: "10px",
  animation: "slideIn 1.5s ease-in-out", // Hiệu ứng động cho dòng chữ chào mừng
};

const quoteTextStyle = {
  fontStyle: "italic",
  color: "#fff",
  fontFamily: "Poppins, sans-serif", // Thay đổi font chữ
  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
  animation: "fadeIn 2.5s ease-in-out", // Hiệu ứng động cho câu thành ngữ
};

export default ManagerLayout;