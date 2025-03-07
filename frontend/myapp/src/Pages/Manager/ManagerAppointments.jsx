// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Divider,
//   Button,
//   Modal,
// } from "@mui/material";
// import { Star, StarOutline } from "@mui/icons-material";
// import axios from "axios";

// // Hàm render nhãn trạng thái
// const renderStatusChip = (status) => {
//   switch (status) {
//     case "Pending":
//       return (
//         <Chip label="Pending" sx={{ bgcolor: "#FFEB3B", color: "#333" }} />
//       );
//     case "Ready":
//       return <Chip label="Ready" sx={{ bgcolor: "#2196F3", color: "#fff" }} />;
//     case "Cancelled":
//       return (
//         <Chip label="Cancelled" sx={{ bgcolor: "#F44336", color: "#fff" }} />
//       );
//     case "Processing":
//       return (
//         <Chip label="Processing" sx={{ bgcolor: "#FFA500", color: "#fff" }} />
//       );
//     case "Completed":
//       return (
//         <Chip label="Completed" sx={{ bgcolor: "#4CAF50", color: "#fff" }} />
//       );
//     default:
//       return <Chip label={status} sx={{ bgcolor: "#9E9E9E", color: "#fff" }} />;
//   }
// };

// // Hàm render sao dựa trên rating, làm tròn lên
// const renderStars = (rating, size = 24) => {
//   const roundedRating = Math.ceil(rating); // Làm tròn lên số sao
//   const stars = [];

//   for (let i = 1; i <= 5; i++) {
//     if (i <= roundedRating) {
//       stars.push(<Star key={i} sx={{ color: "#FFD700", fontSize: size }} />);
//     } else {
//       stars.push(
//         <StarOutline key={i} sx={{ color: "#FFD700", fontSize: size }} />
//       );
//     }
//   }
//   return stars;
// };

// const ManagerAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const accountID = sessionStorage.getItem("userID");
//   // Fetch dữ liệu từ API
//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/appointment/manage/${accountID}`
//         );
//         setAppointments(response.data);
//       } catch (error) {
//         console.error("Failed to fetch appointments:", error);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const handleViewAppointment = (appointment) => {
//     setSelectedAppointment(appointment);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedAppointment(null);
//   };

//   return (
//     <Box
//       sx={{
//         padding: 4,
//         backgroundColor: "#fff",
//         minHeight: "100vh",
//         color: "#333",
//       }}
//     >
//       <Typography
//         variant="h4"
//         fontWeight="bold"
//         sx={{ mb: 2, color: "#4CAF50" }}
//       >
//         Appointments Management
//       </Typography>
//       <Typography variant="subtitle1" sx={{ mb: 4, color: "#4CAF50" }}>
//         Managing the Appointments
//       </Typography>

//       {/* Table của danh sách cuộc hẹn */}
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Paper
//             sx={{
//               padding: 2,
//               backgroundColor: "#f5f5f5",
//               borderRadius: "8px",
//             }}
//           >
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#4caf50",
//                       color: "#fff",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     <TableCell sx={{ color: "#fff" }}>No</TableCell>
//                     <TableCell sx={{ color: "#fff" }}>Customer Name</TableCell>
//                     <TableCell sx={{ color: "#fff" }}>Stylist Name</TableCell>
//                     <TableCell sx={{ color: "#fff" }}>Date</TableCell>
//                     <TableCell sx={{ color: "#fff" }}>Time</TableCell>
//                     <TableCell sx={{ color: "#fff" }}>Total</TableCell>
//                     <TableCell sx={{ color: "#fff" }}>Services</TableCell>
//                     <TableCell sx={{ color: "#fff" }}>Status</TableCell>
//                     <TableCell sx={{ color: "#fff" }}>Feedback</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {appointments.map((appointment, index) => (
//                     <TableRow key={appointment.appointmentId}>
//                       <TableCell>{index + 1}</TableCell>
//                       <TableCell>{appointment.customerName}</TableCell>
//                       <TableCell>{appointment.stylistName}</TableCell>
//                       <TableCell>{appointment.date}</TableCell>
//                       <TableCell>{`${appointment.startTime} - ${appointment.endTime}`}</TableCell>
//                       <TableCell>{`${appointment.totalPrice} VNĐ`}</TableCell>
//                       <TableCell>
//                         {appointment.serviceName.join(", ")}
//                       </TableCell>
//                       <TableCell>
//                         {renderStatusChip(appointment.status)}
//                       </TableCell>

//                       <TableCell>
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           sx={{ backgroundColor: "#4CAF50" }}
//                           onClick={() => handleViewAppointment(appointment)}
//                         >
//                           View
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Modal hiển thị thông tin chi tiết */}
//       <Modal open={openModal} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 500,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2,
//             outline: "none",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Typography
//             variant="h5"
//             fontWeight="bold"
//             sx={{ mb: 2, color: "#4CAF50", textAlign: "center" }}
//           >
//             Appointment's feedback
//           </Typography>
//           <Divider sx={{ mb: 2, width: "100%" }} />

//           {selectedAppointment && (
//             <>
//               {/* Kiểm tra nếu rating là -1 và feedback là null */}
//               {selectedAppointment.rating === -1 &&
//               !selectedAppointment.feedback ? (
//                 <Typography
//                   variant="subtitle1"
//                   color="text.secondary"
//                   sx={{ mt: 2 }}
//                 >
//                   User has not rated this appointment.
//                 </Typography>
//               ) : (
//                 <>
//                   <Box sx={{ mb: 2, textAlign: "center" }}>
//                     <Box
//                       sx={{ display: "flex", justifyContent: "center", gap: 1 }}
//                     >
//                       {renderStars(selectedAppointment.rating, 40)}
//                     </Box>
//                   </Box>

//                   <Box sx={{ mb: 2, textAlign: "center" }}>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       Feedback:
//                     </Typography>
//                     <Typography>
//                       {selectedAppointment.feedback || "No feedback"}
//                     </Typography>
//                   </Box>
//                 </>
//               )}

//               <Box sx={{ textAlign: "center", mt: 4 }}>
//                 <Button
//                   variant="contained"
//                   sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
//                   onClick={handleCloseModal}
//                 >
//                   Close
//                 </Button>
//               </Box>
//             </>
//           )}
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default ManagerAppointments;
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Button,
  Modal,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Star, StarOutline } from "@mui/icons-material";
import axios from "axios";

// Hàm render nhãn trạng thái
const renderStatusChip = (status) => {
  switch (status) {
    case "Pending":
      return (
        <Chip label="Pending" sx={{ bgcolor: "#FFEB3B", color: "#333" }} />
      );
    case "Ready":
      return <Chip label="Ready" sx={{ bgcolor: "#2196F3", color: "#fff" }} />;
    case "Cancelled":
      return (
        <Chip label="Cancelled" sx={{ bgcolor: "#F44336", color: "#fff" }} />
      );
    case "Processing":
      return (
        <Chip label="Processing" sx={{ bgcolor: "#FFA500", color: "#fff" }} />
      );
    case "Completed":
      return (
        <Chip label="Completed" sx={{ bgcolor: "#4CAF50", color: "#fff" }} />
      );
    default:
      return <Chip label={status} sx={{ bgcolor: "#9E9E9E", color: "#fff" }} />;
  }
};

// Hàm render sao dựa trên rating, làm tròn lên
const renderStars = (rating, size = 24) => {
  const roundedRating = Math.ceil(rating); // Làm tròn lên số sao
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<Star key={i} sx={{ color: "#FFD700", fontSize: size }} />);
    } else {
      stars.push(
        <StarOutline key={i} sx={{ color: "#FFD700", fontSize: size }} />
      );
    }
  }
  return stars;
};

const ManagerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const accountID = sessionStorage.getItem("userID");

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/appointment/manage/${accountID}`
          // `http://localhost:8080/appointment`
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setSnackbarMessage("Failed to load appointments");
        setSnackbarOpen(true);
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
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#fff",
        minHeight: "100vh",
        color: "#333",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 2, color: "#4CAF50" }}
      >
        Appointments Management
      </Typography>

      {/* Table của danh sách cuộc hẹn */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            sx={{
              padding: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    <TableCell sx={{ color: "#fff" }}>No</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Customer Name</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Stylist Name</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Time</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Total</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Services</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Feedback</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <TableRow key={appointment.appointmentId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{appointment.customerName}</TableCell>
                        <TableCell>{appointment.stylistName}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{`${appointment.startTime} - ${appointment.endTime}`}</TableCell>
                        <TableCell>{`${appointment.totalPrice} VNĐ`}</TableCell>
                        <TableCell>
                          {appointment.serviceName.join(", ")}
                        </TableCell>
                        <TableCell>
                          {renderStatusChip(appointment.status)}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ backgroundColor: "#4CAF50" }}
                            onClick={() => handleViewAppointment(appointment)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No appointments available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal hiển thị thông tin chi tiết */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
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
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, color: "#4CAF50", textAlign: "center" }}
          >
            Appointment's Feedback
          </Typography>
          <Divider sx={{ mb: 2, width: "100%" }} />

          {selectedAppointment && (
            <>
              <Box sx={{ mb: 2, textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Rating:
                </Typography>
                {selectedAppointment.rating !== undefined &&
                selectedAppointment.rating !== -1 ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    {renderStars(selectedAppointment.rating, 40)}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    No rating available
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 2, textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Feedback:
                </Typography>
                <Typography>
                  {selectedAppointment.feedback || "No feedback provided"}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerAppointments;
//  ĐÃ XONG TẤT CẢ
