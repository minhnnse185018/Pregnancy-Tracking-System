import { TextField, Typography } from "@mui/material";
import React from "react";
import { Button } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import BreadcrumbsHeader from "../../components/Dashboard/breadcum";
import HeaderInternal from "../../components/Dashboard/HeaderInternal";
import DoctorSidebar from "./DoctorSidebar"; // Sidebar dành cho bác sĩ (giả định đã tạo)

const DoctorLayout = () => {
  const location = useLocation(); // Lấy thông tin route hiện tại

  // Kiểm tra nếu đang ở trang chính của Doctor Dashboard
  const isDashboard = location.pathname === "/doctor";

  // State cho chức năng chat
  const [messages, setMessages] = React.useState([
    { id: 1, sender: "patient", text: "Chào bác sĩ, em đang mang thai tuần 12, có triệu chứng buồn nôn. Làm sao ạ?", time: "10:00 AM" },
    { id: 2, sender: "doctor", text: "Chào bạn, đây là triệu chứng bình thường khi mang thai. Hãy thử ăn nhẹ và nghỉ ngơi. Nếu kéo dài, đến khám nhé!", time: "10:05 AM" },
  ]);
  const [newMessage, setNewMessage] = React.useState("");

  // Hàm gửi tin nhắn
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "doctor",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage(""); // Reset input
    }
  };

  return (
    <div style={mainWrapperStyle}>
      <HeaderInternal /> {/* Giữ nguyên Header */}
      <div style={breadcrumbWrapperStyle}>
        <BreadcrumbsHeader /> {/* Breadcrumb nằm trên cùng */}
      </div>
      <div style={doctorLayoutStyle}>
        <DoctorSidebar /> {/* Sidebar dành cho bác sĩ */}
        <div style={doctorContentStyle}>
          {/* Chỉ hiển thị phần chào mừng khi ở trang chính */}
          {isDashboard && (
            <div style={backgroundContainerStyle}>
              <div style={overlayStyle}>
                <Typography variant="h4" style={welcomeTextStyle}>
                  Welcome to Doctor Dashboard
                </Typography>
                <Typography variant="h6" style={quoteTextStyle}>
                  "Caring for a pregnant woman is caring for the future."
                </Typography>
              </div>
            </div>
          )}

          {/* Phần chat với bệnh nhân */}
          <div style={chatContainerStyle}>
            <Typography variant="h5" style={chatTitleStyle}>
              Chat with Patient (Pregnant Woman)
            </Typography>
            <div style={chatMessagesStyle}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={msg.sender === "doctor" ? doctorMessageStyle : patientMessageStyle}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography variant="caption" style={timeStyle}>
                    {msg.time}
                  </Typography>
                </div>
              ))}
            </div>
            <div style={chatInputContainerStyle}>
              <TextField
                fullWidth
                variant="outlined"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                style={chatInputStyle}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                variant="contained"
                style={sendButtonStyle}
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </div>
          </div>

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

const doctorLayoutStyle = {
  display: "flex",
  flex: 1,
  overflow: "hidden",
};

const doctorContentStyle = {
  flex: 1,
  padding: "20px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};

const backgroundContainerStyle = {
  flex: 1,
  backgroundImage: 'url("https://i.pinimg.com/474x/3e/b3/84/3eb384e241d905ce3526423f313d7a50.jpg")', // Hình nền
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundColor: "#FFF5EE",
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

// Styles cho phần chat
const chatContainerStyle = {
  marginTop: "20px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  padding: "20px",
};

const chatTitleStyle = {
  marginBottom: "15px",
  color: "#1976d2",
};

const chatMessagesStyle = {
  maxHeight: "400px",
  overflowY: "auto",
  marginBottom: "20px",
  padding: "10px",
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
};

const doctorMessageStyle = {
  backgroundColor: "#e3f2fd",
  padding: "10px",
  borderRadius: "8px",
  margin: "5px 0",
  textAlign: "right",
};

const patientMessageStyle = {
  backgroundColor: "#f5f5f5",
  padding: "10px",
  borderRadius: "8px",
  margin: "5px 0",
  textAlign: "left",
};

const timeStyle = {
  display: "block",
  fontSize: "0.7rem",
  color: "#666",
};

const chatInputContainerStyle = {
  display: "flex",
  gap: "10px",
};

const chatInputStyle = {
  flex: 1,
};

const sendButtonStyle = {
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#115293",
  },
};

// Hiệu ứng CSS (nếu cần thêm vào file CSS riêng)
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export default DoctorLayout;