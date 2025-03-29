import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

// Styles for the modal in CustomerNotificationMenu
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

// Styles for the menu in CustomerNotificationMenu
const menuStyle = {
  maxWidth: "350px",
  maxHeight: "70vh",
  "& .MuiMenu-paper": {
    width: "100%",
    maxWidth: "350px",
    overflow: "auto",
  },
};

// Utility function to calculate the current pregnancy week
const calculatePregnancyWeek = (dueDate) => {
  const due = new Date(dueDate);
  const now = new Date();
  const daysPregnant = Math.floor((due - now) / (1000 * 60 * 60 * 24));
  const weeksPregnant = Math.floor((280 - daysPregnant) / 7);
  return weeksPregnant >= 0 && weeksPregnant <= 40 ? weeksPregnant : null;
};

// CustomerNotificationMenu Component
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

  useEffect(() => {
    sessionStorage.setItem("viewedIds", JSON.stringify(viewedIds));
  }, [viewedIds]);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userID");

      if (!token || !userId) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5254";
      const alertsUrl = `${apiUrl}/api/GrowthAlert/${userId}/week`;
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
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const handleOpenModal = (item, type) => {
    setSelectedItem({ ...item, type });
    setOpenModal(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  const allItems = [
    ...alerts.map((alert) => ({ ...alert, itemType: "alert" })),
    ...notifications.map((notification) => ({
      ...notification,
      itemType: "notification",
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) return <CircularProgress />;

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

const ManagerReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editReminder, setEditReminder] = useState(null);
  const [pregnantUsers, setPregnantUsers] = useState([]);
  const accountID = sessionStorage.getItem("userID");

  // Fetch all reminders
  const fetchReminders = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`http://localhost:5254/api/reminder`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setReminders(response.data);
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to fetch reminders.",
        severity: "error",
      });
    }
  };

  // Fetch all pregnant users
  const fetchPregnantUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5254/api/users/pregnant`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setPregnantUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching pregnant users:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Failed to fetch pregnant users.",
        severity: "error",
      });
    }
  };

  // Send notification to a user
  const sendNotification = async (userId, reminder) => {
    try {
      const token = sessionStorage.getItem("token");
      const apiUrl = "http://localhost:5254";
      const notificationUrl = `${apiUrl}/api/Notification`;

      const notificationPayload = {
        userId: userId,
        message: `Reminder: ${reminder.subject} - ${reminder.body}`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      const response = await axios.post(notificationUrl, notificationPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSnackbar({
          open: true,
          message: `Notification sent to user ${userId}!`,
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      setSnackbar({
        open: true,
        message: `Failed to send notification to user ${userId}.`,
        severity: "error",
      });
    }
  };

  // Check reminders and send notifications
  useEffect(() => {
    if (!accountID) {
      setSnackbar({
        open: true,
        message: "User ID not found. Please log in.",
        severity: "error",
      });
      return;
    }

    const fetchAndSend = async () => {
      await fetchReminders();
      await fetchPregnantUsers();

      if (pregnantUsers.length > 0 && reminders.length > 0) {
        pregnantUsers.forEach((user) => {
          const currentWeek = calculatePregnancyWeek(user.dueDate);
          if (currentWeek !== null) {
            const matchingReminders = reminders.filter(
              (reminder) => reminder.week === currentWeek
            );
            matchingReminders.forEach((reminder) => {
              sendNotification(user.id, reminder);
            });
          }
        });
      }
    };

    fetchAndSend();
    const interval = setInterval(fetchAndSend, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [accountID]);

  // Handle creating a new reminder
  const handleCreateReminder = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        `http://localhost:5254/api/reminder`,
        values,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setReminders([...reminders, response.data]);
        setSnackbar({
          open: true,
          message: "Reminder created successfully!",
          severity: "success",
        });
        setOpenDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating reminder:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to create reminder.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle updating a reminder
  const handleUpdateReminder = async (values, { setSubmitting }) => {
    try {
      const response = await axios.put(
        `http://localhost:5254/api/reminder/${values.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setReminders(
          reminders.map((reminder) =>
            reminder.id === values.id ? response.data : reminder
          )
        );
        setSnackbar({
          open: true,
          message: "Reminder updated successfully!",
          severity: "success",
        });
        setOpenDialog(false);
        setEditReminder(null);
      }
    } catch (error) {
      console.error("Error updating reminder:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update reminder.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle deleting a reminder
  const handleDeleteReminder = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5254/api/reminder/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setReminders(reminders.filter((reminder) => reminder.id !== id));
        setSnackbar({
          open: true,
          message: "Reminder deleted successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to delete reminder.",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenDialog = (reminder = null) => {
    setEditReminder(reminder);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditReminder(null);
  };

  const validationSchema = Yup.object({
    week: Yup.number().required("Week is required"),
    subject: Yup.string().required("Subject is required"),
    body: Yup.string().required("Body is required"),
  });

  const commonStyles = {
    button: {
      backgroundColor: "#f8bbd0",
      "&:hover": { backgroundColor: "#f06292" },
      borderRadius: "12px",
      padding: "8px 20px",
      textTransform: "none",
      fontWeight: "bold",
    },
    tableHeader: {
      backgroundColor: "#f8bbd0",
      color: "#333",
      fontWeight: "bold",
    },
    tableRow: {
      "&:nth-of-type(odd)": {
        backgroundColor: "#fce4ec",
      },
      "&:hover": {
        backgroundColor: "#ffebee",
      },
    },
    textField: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "&:hover fieldset": { borderColor: "#f8bbd0" },
        "&.Mui-focused fieldset": { borderColor: "#f8bbd0" },
      },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fce4ec",
        minHeight: "100vh",
        display: "flex",
        padding: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          sx={{
            borderRadius: "12px",
            padding: 3,
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#f06292",
                textAlign: "center",
                borderBottom: "2px solid #f8bbd0",
                paddingBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              Manage Pregnancy Reminders
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={commonStyles.button}
              onClick={() => handleOpenDialog()}
            >
              Add Reminder
            </Button>
          </Box>

          <TableContainer sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={commonStyles.tableHeader}>ID</TableCell>
                  <TableCell sx={commonStyles.tableHeader}>Week</TableCell>
                  <TableCell sx={commonStyles.tableHeader}>Subject</TableCell>
                  <TableCell sx={commonStyles.tableHeader}>Body</TableCell>
                  <TableCell sx={commonStyles.tableHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reminders.length > 0 ? (
                  reminders.map((reminder) => (
                    <TableRow key={reminder.id} sx={commonStyles.tableRow}>
                      <TableCell>{reminder.id}</TableCell>
                      <TableCell>{reminder.week}</TableCell>
                      <TableCell>{reminder.subject}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "300px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {reminder.body}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(reminder)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteReminder(reminder.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography>No reminders found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Dialog for creating/editing reminders */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editReminder ? "Edit Reminder" : "Create Reminder"}
        </DialogTitle>
        <Formik
          initialValues={
            editReminder || {
              week: "",
              subject: "",
              body: "",
            }
          }
          validationSchema={validationSchema}
          onSubmit={editReminder ? handleUpdateReminder : handleCreateReminder}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  fullWidth
                  name="week"
                  label="Week"
                  type="number"
                  variant="outlined"
                  margin="dense"
                  sx={commonStyles.textField}
                />
                <ErrorMessage
                  name="week"
                  component="div"
                  style={{ color: "red" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="subject"
                  label="Subject"
                  variant="outlined"
                  margin="dense"
                  sx={commonStyles.textField}
                />
                <ErrorMessage
                  name="subject"
                  component="div"
                  style={{ color: "red" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="body"
                  label="Body"
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="dense"
                  sx={commonStyles.textField}
                />
                <ErrorMessage
                  name="body"
                  component="div"
                  style={{ color: "red" }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDialog}
                  sx={{
                    color: "#f44336",
                    borderColor: "#f44336",
                    borderRadius: "12px",
                    "&:hover": {
                      borderColor: "#d32f2f",
                      backgroundColor: "#ffebee",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={commonStyles.button}
                >
                  {editReminder ? "Update" : "Create"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* CustomerNotificationMenu integration */}
      <CustomerNotificationMenu
        anchorEl={null} // Set to null by default; manage visibility elsewhere if needed
        handleClose={() => {}} // Placeholder
        setUnreadCount={() => {}} // Placeholder
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerReminders;
