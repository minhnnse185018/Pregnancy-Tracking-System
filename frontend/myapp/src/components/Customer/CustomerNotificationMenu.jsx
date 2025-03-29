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
import React, { useCallback, useEffect, useState } from "react";

// Styles for the modal
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "50%" },
  maxWidth: "600px",
  maxHeight: "80vh",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
  zIndex: 1300,
};

// Styles for the menu
const menuStyle = {
  maxWidth: "350px",
  maxHeight: "70vh",
  "& .MuiMenu-paper": {
    width: "100%",
    maxWidth: "350px",
    overflow: "auto",
  },
};

function CustomerNotificationMenu({ anchorEl, handleClose, setUnreadCount }) {
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [viewedIds, setViewedIds] = useState(() => {
    const stored = sessionStorage.getItem("viewedIds");
    return stored ? JSON.parse(stored) : [];
  });

  // Save viewedIds to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("viewedIds", JSON.stringify(viewedIds));
  }, [viewedIds]);

  // Fetch alerts and notifications
  const fetchData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userID");

      if (!token || !userId) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5254";
      const alertsUrl = `${apiUrl}/api/GrowthAlert/${userId}/week`; // Updated to use userId
      const notificationsUrl = `${apiUrl}/api/Notification/user/${userId}`;

      const [alertsResponse, notificationsResponse] = await Promise.all([
        axios.get(alertsUrl, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(notificationsUrl, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const sortedAlerts = alertsResponse.data.sort((a, b) => b.id - a.id);
      const sortedNotifications = notificationsResponse.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAlerts(sortedAlerts);
      setNotifications(sortedNotifications);

      const unreadAlerts = sortedAlerts.filter(
        (alert) => !viewedIds.includes(`alert-${alert.id}`)
      );
      const unreadNotifications = sortedNotifications.filter(
        (notification) =>
          !notification.isRead &&
          !viewedIds.includes(`notification-${notification.id}`)
      );

      setUnreadCount(unreadAlerts.length + unreadNotifications.length);
      setError(null);
    } catch (error) {
      if (error.response?.status === 404) {
        setError("No recent notifications found.");
      } else if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        setError("Failed to load notifications. Please try again later.");
      }
      setAlerts([]);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [setUnreadCount, viewedIds]);

  // Fetch data on mount and poll every 30 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Mark items as viewed and update backend when menu opens
  useEffect(() => {
    if (anchorEl && (alerts.length > 0 || notifications.length > 0)) {
      const alertIds = alerts.map((alert) => `alert-${alert.id}`);
      const notificationIds = notifications.map((n) => `notification-${n.id}`);
      const newViewedIds = [
        ...new Set([...viewedIds, ...alertIds, ...notificationIds]),
      ];
      setViewedIds(newViewedIds);
      setUnreadCount(0);

      const markNotificationsAsRead = async () => {
        try {
          const token = sessionStorage.getItem("token");
          const apiUrl =
            process.env.REACT_APP_API_URL || "http://localhost:5254";
          const unreadNotifications = notifications.filter((n) => !n.isRead);

          if (unreadNotifications.length > 0) {
            await axios.put(
              `${apiUrl}/api/Notification/markAsRead`,
              unreadNotifications.map((n) => n.id),
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        } catch (error) {
          console.error("Failed to mark notifications as read:", error);
        }
      };
      markNotificationsAsRead();
    }
  }, [anchorEl, alerts, notifications, setUnreadCount]);

  // Handle opening modal
  const handleOpenModal = (item, type) => {
    setSelectedItem({ ...item, type });
    setOpenModal(true);
    handleClose();
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  // Combine and sort alerts and notifications
  const allItems = [
    ...alerts.map((alert) => ({ ...alert, itemType: "alert" })),
    ...notifications.map((notification) => ({
      ...notification,
      itemType: "notification",
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Render loading state
  if (loading) return <CircularProgress />;

  // Render error state
  if (error) {
    return (
      <Menu
        sx={menuStyle}
        id="menu-notification"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Typography
            textAlign="center"
            color={
              error === "No recent notifications found."
                ? "textSecondary"
                : "error"
            }
          >
            {error}
          </Typography>
        </MenuItem>
      </Menu>
    );
  }

  // Render menu with alerts and notifications
  return (
    <div>
      <Menu
        sx={menuStyle}
        id="menu-notification"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {allItems.length > 0 ? (
          allItems.map((item, index) => (
            <Box key={`${item.itemType}-${item.id}`}>
              <MenuItem
                onClick={() => handleOpenModal(item, item.itemType)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px 16px",
                  width: "100%",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.itemType === "alert" ? "Growth Alert" : "Notification"}
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
                  {item.itemType === "alert" ? item.alertMessage : item.message}
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
                  {new Date(item.createdAt).toLocaleString()}
                </Typography>
              </MenuItem>
              {index < allItems.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <MenuItem onClick={handleClose}>
            <Typography textAlign="center">
              No notifications found!!!
            </Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Modal to display full item details */}
      {selectedItem && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="alert-modal-title"
          aria-describedby="alert-modal-description"
          disableScrollLock={true}
        >
          <Box sx={modalStyle}>
            <Typography
              id="alert-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
              textAlign="center"
            >
              {selectedItem.type === "alert"
                ? "Growth Alert"
                : "💡💡💡 Notification 💡💡💡"}
            </Typography>
            <Typography
              id="alert-modal-description"
              sx={{ mt: 2, overflowWrap: "break-word" }}
            >
              {selectedItem.type === "alert"
                ? selectedItem.alertMessage
                : selectedItem.message}
            </Typography>
            {selectedItem.type === "notification" &&
              selectedItem.relatedEntityId && (
                <Button
                  onClick={() => {
                    handleCloseModal();
                    window.location.href = `/blog/${selectedItem.relatedEntityId}`;
                  }}
                  variant="contained"
                  sx={{
                    mt: 3,
                    mr: 2,
                    backgroundColor: "#FF69B4",
                    "&:hover": { backgroundColor: "#FF1493" },
                  }}
                >
                  View Blog
                </Button>
              )}
            <Button
              onClick={handleCloseModal}
              variant="contained"
              sx={{
                mt: 3,
                float: "right",
                backgroundColor: "#FF69B4",
                "&:hover": { backgroundColor: "#FF1493" },
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default CustomerNotificationMenu;
