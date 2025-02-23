import { Typography } from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BreadcrumbsHeader from "../../components/Dashboard/breadcum";
import HeaderInternal from "../../components/Dashboard/HeaderInternal";
import AdminSidebar from "./AdminSidebar"; // Sidebar dành cho Admin

const AdminLayout = () => {
  const location = useLocation(); // Lấy thông tin route hiện tại

  // Kiểm tra nếu đang ở trang chính của Admin Dashboard
  const isDashboard = location.pathname === "/admin";

  return (
    <div style={mainWrapperStyle}>
      <HeaderInternal /> {/* Giữ nguyên Header */}
      <div style={breadcrumbWrapperStyle}>
        <BreadcrumbsHeader /> {/* Breadcrumb nằm trên cùng */}
      </div>
      <div style={managerLayoutStyle}>
        <AdminSidebar /> {/* Sidebar dành cho Admin */}
        <div style={managerContentStyle}>
          {/* Chỉ hiển thị phần chào mừng khi ở trang chính */}
          {isDashboard && (
            <div style={backgroundContainerStyle}>
              <div style={overlayStyle}>
                <Typography variant="h4" style={welcomeTextStyle}>
                  Welcome to Admin Dashboard
                </Typography>
                <Typography variant="h6" style={quoteTextStyle}>
                  "Great leaders don't set out to be a leader... They set out to
                  make a difference."
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

// Nền và overlay cho Admin
// const backgroundContainerStyle = {
//   flex: 1,
//   backgroundImage:
//     'url("https://channel.mediacdn.vn/2021/1/1/photo-2-1609515208847787441742.jpg")', // Hình nền
//   backgroundSize: "cover",
//   backgroundPosition: "center",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   position: "relative",
// };

const backgroundContainerStyle = {
  flex: 1,
  backgroundImage: 'url("https://i.pinimg.com/474x/3e/b3/84/3eb384e241d905ce3526423f313d7a50.jpg")', // Hình nền
  backgroundSize: "contain",  // Giữ nguyên tỉ lệ ảnh, không bị cắt
  backgroundRepeat: "no-repeat",  // Không lặp lại ảnh
  backgroundPosition: "center center",  // Căn giữa ảnh trong container
  backgroundColor: "#FFF5EE", // Thêm màu nền nhẹ nếu ảnh không phủ hết
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

export default AdminLayout;