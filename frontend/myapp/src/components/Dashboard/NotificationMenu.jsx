import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as React from "react";

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: "70%",
    md: "50%",
  },
  maxWidth: "600px",
  maxHeight: "80vh",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
  zIndex: 1300,
};

const menuStyle = {
  maxWidth: "350px",
  maxHeight: "70vh",
  "& .MuiMenu-paper": {
    width: "100%",
    maxWidth: "350px",
    overflow: "auto",
  },
};

function NotificationMenu({ anchorEl, handleClose, setUnreadCount }) {
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedNotification, setSelectedNotification] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const accountID = sessionStorage.getItem("userID");
        const response = await axios.get(
          `http://localhost:8080/api/noti/${accountID}`
        );
        const sortedNotifications = response.data.sort((a, b) => b.notiId - a.notiId);
        console.log(response);
        setNotifications(response.data);
        const unreadNotifications = sortedNotifications.filter((n) => !n.read).length;
        setUnreadCount(unreadNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [setUnreadCount]);

  const markAsRead = async (notiId) => {
    if (!notiId) {
      console.error("notiId is undefined!");
      return;
    }
    try {
      await axios.put(`http://localhost:8080/api/noti/${notiId}`);
      setNotifications((prev) =>
        prev.map((n) => (n.notiId === notiId ? { ...n, read: true } : n))
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleOpenModal = (notification) => {
    console.log(notification);
    setSelectedNotification(notification);
    setOpenModal(true);
    handleClose();

    if (!notification.read) {
      markAsRead(notification.notiId);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedNotification(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Menu
        sx={menuStyle}
        id="menu-notification"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Box key={index}>
              <MenuItem
                onClick={() => handleOpenModal(notification)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px 16px",
                  width: "100%",
                  backgroundColor: notification.read
                    ? "white"
                    : "rgba(0, 255, 0, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Typography
                  fontWeight={notification.read ? "normal" : "bold"}
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {notification.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#757575",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {notification.msg}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#9e9e9e",
                    mt: 0.5,
                    width: "100%",
                    textAlign: "right",
                  }}
                >
                  {new Date(notification.createDate).toLocaleString()}
                </Typography>
              </MenuItem>
              {index < notifications.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <MenuItem onClick={handleClose}>
            <Typography textAlign="center">No notifications</Typography>
          </MenuItem>
        )}
      </Menu>

      {selectedNotification && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="notification-modal-title"
          aria-describedby="notification-modal-description"
          disableScrollLock={true}
        >
          <Box sx={modalStyle}>
            <Typography
              id="notification-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              {selectedNotification.title}
            </Typography>
            <Typography
              id="notification-modal-description"
              sx={{
                mt: 2,
                overflowWrap: "break-word",
              }}
            >
              {selectedNotification.msg}
            </Typography>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              sx={{ mt: 3, float: "right" }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default NotificationMenu;
