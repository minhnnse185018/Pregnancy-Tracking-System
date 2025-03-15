import {
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";

const DoctorChat = () => {
  const [messages, setMessages] = useState([
    { sender: "Patient", text: "Hello, Doctor! I have a question about my pregnancy.", time: "10:00 AM" },
    { sender: "Doctor", text: "Hello! Please feel free to ask anything.", time: "10:02 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages([...messages, { sender: "Doctor", text: newMessage, time: currentTime }]);
      setNewMessage("");
    }
  };

  // Styles
  const pageStyle = {
    padding: "20px",
    backgroundColor: "#FFF5EE",
    minHeight: "100vh",
  };

  const chatContainerStyle = {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    height: "80vh",
    display: "flex",
    flexDirection: "column",
  };

  const titleStyle = {
    color: "#D2691E",
    marginBottom: "20px",
  };

  const chatBoxStyle = {
    flex: 1,
    overflowY: "auto",
    border: "1px solid #F4A8A8",
    borderRadius: "8px",
    marginBottom: "20px",
  };

  const messageListStyle = {
    padding: "10px",
  };

  const messageStyle = (sender) => ({
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "60%",
    backgroundColor: sender === "Doctor" ? "#D2691E" : "#F4A8A8",
    color: sender === "Doctor" ? "#fff" : "#333",
  });

  const inputBoxStyle = {
    display: "flex",
    gap: "10px",
  };

  const sendButtonStyle = {
    backgroundColor: "#D2691E",
    color: "#fff",
  };

  return (
    <div style={pageStyle}>
      <Paper elevation={3} style={chatContainerStyle}>
        <Typography variant="h4" style={titleStyle}>
          Chat with Patients
        </Typography>
        <Box style={chatBoxStyle}>
          <List style={messageListStyle}>
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                <ListItem
                  style={{
                    justifyContent: msg.sender === "Doctor" ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper style={messageStyle(msg.sender)}>
                    <ListItemText
                      primary={msg.text}
                      secondary={msg.time}
                      secondaryTypographyProps={{ style: { color: "inherit" } }}
                    />
                  </Paper>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
        <Box style={inputBoxStyle}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            variant="contained"
            style={sendButtonStyle}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default DoctorChat;