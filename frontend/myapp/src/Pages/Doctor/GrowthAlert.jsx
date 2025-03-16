import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
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
import React, { useEffect, useState } from "react";

const GrowthAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [customerId, setCustomerId] = useState(""); // ID của thai phụ
  const [openModal, setOpenModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    message: "",
    severity: "warning",
    week: "",
  });

  // Fetch alerts for a specific customer
  useEffect(() => {
    const fetchAlerts = async () => {
      if (customerId) {
        try {
          const response = await axios.get(
            `http://localhost:5254/api/GrowthAlert/customer/${customerId}`
          );
          setAlerts(response.data);
        } catch (error) {
          console.error("Error fetching alerts:", error);
        }
      }
    };

    fetchAlerts();
  }, [customerId]);

  // Handle input change for new alert
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlert((prev) => ({ ...prev, [name]: value }));
  };

  // Handle create new alert
  const handleCreateAlert = async () => {
    try {
      const alertData = {
        customerId: customerId,
        message: newAlert.message,
        severity: newAlert.severity,
        week: parseInt(newAlert.week), // Đảm bảo week là số
      };
      await axios.post(`http://localhost:5254/api/GrowthAlert`, alertData);
      setOpenModal(false);
      setNewAlert({ message: "", severity: "warning", week: "" });
      // Refresh alerts
      const response = await axios.get(
        `http://localhost:5254/api/GrowthAlert/customer/${customerId}`
      );
      setAlerts(response.data);
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  };

  // Styles
  const pageStyle = {
    backgroundColor: "#FFF5EE",
    minHeight: "100vh",
    padding: "32px",
  };

  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
  };

  const paperStyle = {
    padding: "24px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    fontWeight: "bold",
    color: "#D2691E",
    marginBottom: "16px",
  };

  const buttonStyle = {
    backgroundColor: "#D2691E",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#b35717",
    },
    marginBottom: "16px",
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={pageStyle}>
      <Box sx={containerStyle}>
        <Paper sx={paperStyle}>
          <Typography variant="h4" sx={titleStyle}>
            Growth Alerts (Doctor View)
          </Typography>

          {/* Input to select customer ID */}
          <TextField
            label="Customer ID"
            variant="outlined"
            fullWidth
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" sx={buttonStyle} onClick={() => setOpenModal(true)}>
            Create New Alert
          </Button>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Message</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Week</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>{alert.severity}</TableCell>
                    <TableCell>{alert.week}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Modal for creating new alert */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create New Alert
          </Typography>
          <TextField
            label="Message"
            name="message"
            value={newAlert.message}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Severity</InputLabel>
            <Select
              name="severity"
              value={newAlert.severity}
              onChange={handleInputChange}
            >
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="info">Info</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Week"
            name="week"
            value={newAlert.week}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" sx={buttonStyle} onClick={handleCreateAlert}>
            Save Alert
          </Button>
          <Button
            variant="outlined"
            sx={{ mt: 2, color: "#F44336", borderColor: "#F44336" }}
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default GrowthAlert;