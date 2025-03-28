import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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

// Utility function to calculate the current pregnancy week
const calculatePregnancyWeek = (dueDate) => {
  const due = new Date(dueDate);
  const now = new Date();
  const daysPregnant = Math.floor((due - now) / (1000 * 60 * 60 * 24));
  const weeksPregnant = Math.floor((280 - daysPregnant) / 7); // Assuming 280 days (40 weeks) for a full pregnancy
  return weeksPregnant >= 0 && weeksPregnant <= 40 ? weeksPregnant : null;
};

// CustomerNotificationMenu Component (Updated for Reminders)
const CustomerNotificationMenu = ({ reminders }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [pregnantUsers, setPregnantUsers] = useState([]);

  // Fetch all pregnant users and their pregnancy details
  const fetchPregnantUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setSnackbar({
          open: true,
          message: "Authentication token not found.",
          severity: "error",
        });
        return;
      }

      // Hypothetical endpoint to fetch pregnant users
      const response = await axios.get(
        `http://localhost:5254/api/users/pregnant`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPregnantUsers(response.data);
    } catch (error) {
      console.error("Error fetching pregnant users:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch pregnant users.",
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

      await axios.post(notificationUrl, notificationPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSnackbar({
        open: true,
        message: `Notification sent to user ${userId}!`,
        severity: "success",
      });
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
    fetchPregnantUsers();
    const interval = setInterval(() => {
      fetchPregnantUsers();
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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
  }, [pregnantUsers, reminders]);

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
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
  );
};

const ManagerReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editReminder, setEditReminder] = useState(null);
  const accountID = sessionStorage.getItem("userID");

  // Fetch all reminders
  const fetchReminders = async () => {
    try {
      const response = await axios.get(`http://localhost:5254/api/reminder`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setReminders(response.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch reminders.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (!accountID) {
      setSnackbar({
        open: true,
        message: "User ID not found. Please log in.",
        severity: "error",
      });
      return;
    }
    fetchReminders();
    const interval = setInterval(fetchReminders, 30000); // Poll every 30 seconds
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

      if (response.status === 200) {
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
          },
        }
      );

      if (response.status === 200) {
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

  // Handle sending a reminder manually to all users at the reminder's week
  const handleSendReminder = async (reminder) => {
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

      const pregnantUsers = response.data;
      const matchingUsers = pregnantUsers.filter((user) => {
        const currentWeek = calculatePregnancyWeek(user.dueDate);
        return currentWeek === reminder.week;
      });

      for (const user of matchingUsers) {
        await axios.post(
          `http://localhost:5254/api/Notification`,
          {
            userId: user.id,
            message: `Reminder: ${reminder.subject} - ${reminder.body}`,
            createdAt: new Date().toISOString(),
            isRead: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      setSnackbar({
        open: true,
        message: `Reminder sent to ${matchingUsers.length} users!`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error sending reminder:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to send reminder.",
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
                        <IconButton
                          color="success"
                          onClick={() => handleSendReminder(reminder)}
                        >
                          <SendIcon />
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

      <CustomerNotificationMenu reminders={reminders} />

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
