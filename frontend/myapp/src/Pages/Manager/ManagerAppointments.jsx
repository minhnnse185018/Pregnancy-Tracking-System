import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ManagerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const accountID = sessionStorage.getItem("userID");

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5254/api/appointments`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch appointments.",
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
    fetchAppointments();
  }, [accountID]);

  // Handle status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5254/api/appointments/update`,
        { id: appointmentId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === appointmentId ? { ...appt, status: newStatus } : appt
          )
        );
        setSnackbar({
          open: true,
          message: "Appointment status updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to update appointment status.",
        severity: "error",
      });
    }
  };

  // Handle appointment deletion
  const handleDelete = async (appointmentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5254/api/appointments/delete/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setAppointments((prev) =>
          prev.filter((appt) => appt.id !== appointmentId)
        );
        setSnackbar({
          open: true,
          message: "Appointment deleted successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Failed to delete appointment.",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              fontWeight: "bold",
              color: "#f06292",
              textAlign: "center",
              borderBottom: "2px solid #f8bbd0",
              paddingBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            Manage User Appointments
          </Typography>

          <TableContainer sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={commonStyles.tableHeader}>ID</TableCell>
                  <TableCell sx={commonStyles.tableHeader}>User ID</TableCell>
                  <TableCell sx={commonStyles.tableHeader}>Date</TableCell>
                  <TableCell sx={commonStyles.tableHeader}>Time</TableCell>
                  <TableCell sx={commonStyles.tableHeader}>Status</TableCell>
                  <TableCell sx={commonStyles.tableHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id} sx={commonStyles.tableRow}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.userId}</TableCell>
                      <TableCell>
                        {new Date(appointment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>
                        <Select
                          value={appointment.status}
                          onChange={(e) =>
                            handleStatusUpdate(appointment.id, e.target.value)
                          }
                          sx={{
                            height: "40px",
                            borderRadius: "8px",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#f8bbd0",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#f06292",
                            },
                          }}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Confirmed">Confirmed</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>No appointments found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

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

export default ManagerAppointments;
