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
import React from 'react';

// Styles for the modal
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
  const [alerts, setAlerts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedAlert, setSelectedAlert] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [viewedAlertIds, setViewedAlertIds] = React.useState(() => {
    // Load viewed alert IDs from sessionStorage on mount
    const stored = sessionStorage.getItem("viewedAlertIds");
    return stored ? JSON.parse(stored) : [];
  });

  // Save viewedAlertIds to sessionStorage whenever it changes
  React.useEffect(() => {
    sessionStorage.setItem("viewedAlertIds", JSON.stringify(viewedAlertIds));
  }, [viewedAlertIds]);

  // Fetch alerts when the component mounts or when setUnreadCount changes
  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Get the token from sessionStorage
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        // Construct the API URL using an environment variable
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5254";
        const url = `${apiUrl}/api/GrowthAlert/1/week`;

        // Make the API request
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sort alerts by ID in descending order (newest first)
        const sortedAlerts = response.data.sort((a, b) => b.id - a.id);
        setAlerts(sortedAlerts);

        // Calculate unread count (alerts that haven't been viewed)
        const unreadAlerts = sortedAlerts.filter(
          (alert) => !viewedAlertIds.includes(alert.id)
        );
        setUnreadCount(unreadAlerts.length);
        setError(null);
      } catch (error) {
        if (error.response?.status === 404) {
          setError("No recent alerts found.");
        } else if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
          window.location.href = "/login";
        } else {
          setError("Failed to load alerts. Please try again later.");
        }
        setAlerts([]);
        setUnreadCount(0); // Reset unread count on error
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Poll every 30 seconds
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [setUnreadCount]);

  // Mark alerts as viewed when the menu is opened
  React.useEffect(() => {
    if (anchorEl && alerts.length > 0) {
      // When the menu is opened, mark all current alerts as viewed
      const newViewedAlertIds = [...new Set([...viewedAlertIds, ...alerts.map(alert => alert.id)])];
      setViewedAlertIds(newViewedAlertIds);
      setUnreadCount(0); // Set unread count to 0 since all alerts are now viewed
    }
  }, [anchorEl, alerts, setUnreadCount]);

  // Handle opening the modal when an alert is clicked
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
  if (loading) {
    return <CircularProgress />;
  }

  // Render error state
  if (error) {
    return (
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
        <MenuItem onClick={handleClose}>
          <Typography
            textAlign="center"
            color={error === "No recent alerts found." ? "textSecondary" : "error"}
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
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <Box key={alert.id}>
              <MenuItem
                onClick={() => handleOpenModal(alert)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px 16px",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
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
                  Growth Alert
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
                  {new Date(alert.createdAt).toLocaleString()}
                </Typography>
              </MenuItem>
              {index < alerts.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <MenuItem onClick={handleClose}>
            <Typography textAlign="center">No alerts</Typography>
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
              Growth Alert
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