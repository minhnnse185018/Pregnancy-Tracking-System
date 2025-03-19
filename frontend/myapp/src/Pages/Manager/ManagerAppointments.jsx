import { Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box, Button, Modal, Divider } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

// Hàm render trạng thái
const renderStatusChip = (status) => {
  switch (status) {
    case "Scheduled":
      return <Chip label="Scheduled" sx={{ bgcolor: "#2196F3", color: "#fff" }} />;
    case "Cancelled":
      return <Chip label="Cancelled" sx={{ bgcolor: "#F44336", color: "#fff" }} />;
    case "Completed":
      return <Chip label="Completed" sx={{ bgcolor: "#4CAF50", color: "#fff" }} />;
    default:
      return <Chip label={status} sx={{ bgcolor: "#9E9E9E", color: "#fff" }} />;
  }
};

const ManagerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Gọi API để lấy danh sách cuộc hẹn
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5254/api/appointments/all`);
        setAppointments(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách cuộc hẹn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#fff", minHeight: "100vh", color: "#333" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: "#4CAF50" }}>
        Appointments Management
      </Typography>

      <TableContainer component={Paper} sx={{ padding: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#4CAF50" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Appointment Date</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Created At</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.title}</TableCell>
                  <TableCell>{appointment.appointmentDate}</TableCell>
                  <TableCell>{renderStatusChip(appointment.status)}</TableCell>
                  <TableCell>{appointment.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="contained" sx={{ backgroundColor: "#4CAF50" }} onClick={() => handleViewAppointment(appointment)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No appointments available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal xem chi tiết cuộc hẹn */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: "#4CAF50", textAlign: "center" }}>
            Appointment Details
          </Typography>
          <Divider sx={{ mb: 2, width: "100%" }} />

          {selectedAppointment && (
            <>
              <Box sx={{ mb: 2, textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Title:
                </Typography>
                <Typography>{selectedAppointment.title}</Typography>
              </Box>

              <Box sx={{ mb: 2, textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Description:
                </Typography>
                <Typography>{selectedAppointment.description || "No description provided"}</Typography>
              </Box>

              <Box sx={{ mb: 2, textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Appointment Date:
                </Typography>
                <Typography>{selectedAppointment.appointmentDate}</Typography>
              </Box>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button variant="contained" sx={{ backgroundColor: "#4CAF50", color: "#fff" }} onClick={handleCloseModal}>
                  Close
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ManagerAppointments;
