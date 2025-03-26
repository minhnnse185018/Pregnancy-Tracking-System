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

// Modal styles
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

// Menu styles
const menuStyle = {
  maxWidth: "350px",
  maxHeight: "70vh",
  "& .MuiMenu-paper": {
    width: "100%",
    maxWidth: "350px",
    overflow: "auto",
  },
};

// Utility function to calculate the week of the year from a date
const getWeekOfYear = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
};

function CustomerNotificationMenu({ anchorEl, handleClose, setUnreadCount, profileId }) {
  // State management
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [viewedAlertIds, setViewedAlertIds] = useState(() => {
    // Initialize viewed alert IDs from sessionStorage
    const stored = sessionStorage.getItem("viewedAlertIds");
    return stored ? JSON.parse(stored) : [];
  });

  // Save viewedAlertIds to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("viewedAlertIds", JSON.stringify(viewedAlertIds));
  }, [viewedAlertIds]);

  // Fetch alerts from the API using profileId
  const fetchAlerts = useCallback(async () => {
    if (!profileId) {
      setError("Profile ID is missing. Please select a profile.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the token from sessionStorage
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Construct the API URL
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5254";
      const url = `${apiUrl}/api/GrowthAlert/profile/${profileId}`; // Using GET /api/GrowthAlert/profile/{profileId}

      // Make the API request
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort alerts by ID in descending order (newest first)
      const sortedAlerts = response.data.sort((a, b) => b.id - a.id);
      setAlerts(sortedAlerts);

      // Calculate unread count
      const unreadAlerts = sortedAlerts.filter(
        (alert) => !viewedAlertIds.includes(alert.id)
      );
      setUnreadCount(unreadAlerts.length);
    } catch (error) {
      if (error.response?.status === 404) {
        setError("No recent alerts found for this profile.");
      } else if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        setError(error.message || "Failed to load alerts. Please try again later.");
      }
      setAlerts([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [profileId, viewedAlertIds, setUnreadCount]);

  // Fetch alerts on mount and set up polling
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Poll every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchAlerts]);

  // Mark alerts as viewed when the menu is opened
  useEffect(() => {
    if (anchorEl && alerts.length > 0) {
      const newViewedAlertIds = [
        ...new Set([...viewedAlertIds, ...alerts.map((alert) => alert.id)]),
      ];
      setViewedAlertIds(newViewedAlertIds);
      setUnreadCount(0); // Reset unread count since all alerts are viewed
    }
  }, [anchorEl, alerts, setUnreadCount]);

  // Handle opening the modal
  const handleOpenModal = (alert) => {
    setSelectedAlert(alert);
    setOpenModal(true);
    handleClose();
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAlert(null);
  };

  // Render loading state
  if (loading && alerts.length === 0) {
    return <CircularProgress />;
  }

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
            color={error === "No recent alerts found for this profile." ? "textSecondary" : "error"}
          >
            {error}
          </Typography>
        </MenuItem>
      </Menu>
    );
  }

  // Render the menu with alerts
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
        {alerts.length > 0 ? (
          alerts.map((alert, index) => {
            const alertDate = new Date(alert.createdAt);
            const weekOfYear = getWeekOfYear(alertDate);
            return (
              <Box key={alert.id}>
                <MenuItem
                  onClick={() => handleOpenModal(alert)}
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
                    Growth Alert for Profile ID: {profileId}
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
                    {alert.alertMessage}
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
                    Week {weekOfYear} - {alertDate.toLocaleString()}
                  </Typography>
                </MenuItem>
                {index < alerts.length - 1 && <Divider />}
              </Box>
            );
          })
        ) : (
          <MenuItem onClick={handleClose}>
            <Typography textAlign="center">No alerts for Profile ID: {profileId}</Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Modal to display the full alert message */}
      {selectedAlert && (
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
            >
              Growth Alert for Profile ID: {profileId}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "#757575",
                mb: 2,
              }}
            >
              Week {getWeekOfYear(new Date(selectedAlert.createdAt))} -{" "}
              {new Date(selectedAlert.createdAt).toLocaleString()}
            </Typography>
            <Typography
              id="alert-modal-description"
              sx={{
                mt: 2,
                overflowWrap: "break-word",
              }}
            >
              {selectedAlert.alertMessage}
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

export default CustomerNotificationMenu;