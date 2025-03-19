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
import React from "react";

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

function CustomerNotificationMenu({ anchorEl, handleClose, setUnreadCount }) {
  const [alerts, setAlerts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedAlert, setSelectedAlert] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);

  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const customerId = sessionStorage.getItem("userID");
        console.log("Customer ID:", customerId);
        if (!customerId) {
          console.error("No userID found in sessionStorage");
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `http://localhost:5254/api/GrowthAlert/customer/${customerId}/week`,
          {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
          }
        );
        console.log("API Response:", response.data);
        const sortedAlerts = response.data.sort((a, b) => b.id - a.id);
        setAlerts(sortedAlerts);
        setUnreadCount(0);
      } catch (error) {
        console.error("Failed to fetch alerts:", error.response?.data || error.message);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [setUnreadCount]);

  const handleOpenModal = (alert) => {
    setSelectedAlert(alert);
    setOpenModal(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAlert(null);
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
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <Box key={index}>
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