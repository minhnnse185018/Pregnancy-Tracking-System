import {
    Alert,
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Modal,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
  
  const DoctorGrowthAlert = () => {
    const [growthData, setGrowthData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [customerId, setCustomerId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [newAlert, setNewAlert] = useState({
      measurementId: "",
      message: "",
      week: "",
    });
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = sessionStorage.getItem("token");
          const growthResponse = await axios.get(
            `http://localhost:5254/api/FetalMeasurement/GetAllGrowth`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const filteredGrowthData = growthResponse.data
            .filter((item) => item.profileId.toString() === customerId)
            .map((item) => ({
              id: item.id,
              weight: item.weightGrams,
              height: item.heightCm,
              week: item.week || Math.floor(
                (new Date(item.measurementDate) - new Date("2025-01-01")) /
                  (7 * 24 * 60 * 60 * 1000)
              ),
              notes: item.notes || "No notes",
            }));
          setGrowthData(filteredGrowthData.sort((a, b) => a.week - b.week));
  
          const alertResponse = await axios.get(
            `http://localhost:5254/api/GrowthAlert/customer/${customerId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAlerts(alertResponse.data);
        } catch (err) {
          console.error("Fetch error:", err.response ? err.response.data : err.message);
          setError(`Error loading data: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
        } finally {
          setLoading(false);
        }
      };
  
      if (customerId) fetchData();
    }, [customerId]);
  
    const handleCreateAlert = async () => {
      if (!newAlert.measurementId || !newAlert.message || !newAlert.week) {
        setError("Please fill in all required fields (Measurement ID, message, week)!");
        return;
      }
  
      const weekValue = parseInt(newAlert.week);
      if (isNaN(weekValue) || weekValue < 1 || weekValue > 42) {
        setError("Week must be a valid integer between 1 and 42!");
        return;
      }
  
      const measurementIdValue = parseInt(newAlert.measurementId);
      if (isNaN(measurementIdValue) || !growthData.some((data) => data.id === measurementIdValue)) {
        setError("Invalid Measurement ID!");
        return;
      }
  
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token");
        const alertData = {
          fetalMeasurementId: measurementIdValue, // Đổi tên thành fetalMeasurementId để khớp với schema backend
          alertMessage: newAlert.message,
          createdAt: new Date().toISOString(),
        };
        await axios.post(
          `http://localhost:5254/api/GrowthAlert`,
          alertData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const alertResponse = await axios.get(
          `http://localhost:5254/api/GrowthAlert/customer/${customerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlerts(alertResponse.data);
        setNewAlert({ measurementId: "", message: "", week: "" });
        setOpenModal(false);
  
        // Gửi thông báo đến hệ thống Notification
        const notificationData = {
          notiId: Date.now(), // Giả lập ID (thay bằng response từ API)
          title: `Growth Alert - Week ${weekValue}`,
          msg: newAlert.message,
          createDate: new Date().toISOString(),
          read: false,
        };
        await axios.post(
          `http://localhost:8080/api/noti`,
          notificationData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Save error:", err.response ? err.response.data : err.message);
        setError(`Error creating alert: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
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
  
    const pageStyle = {
      backgroundColor: "#FFF5EE",
      minHeight: "100vh",
      padding: "32px",
    };
  
    const containerStyle = {
      maxWidth: "800px",
      margin: "0 auto",
      marginTop: "100px",
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
  
    const alertStyle = (severity) => ({
      marginBottom: "8px",
      backgroundColor: "#FF9800", // Mặc định là warning
      color: "#fff",
    });
  
    return (
      <Box sx={pageStyle}>
        <Box sx={containerStyle}>
          <Paper sx={paperStyle}>
            <Typography variant="h4" sx={titleStyle}>
              Growth Tracker & Alerts (Doctor View)
            </Typography>
  
            <TextField
              label="Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
  
            {loading && <Typography>Loading...</Typography>}
            {error && <Alert severity="error">{error}</Alert>}
  
            {growthData.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                  Growth Tracking History
                </Typography>
                <List>
                  {growthData.map((data) => (
                    <React.Fragment key={data.id}>
                      <ListItem>
                        <ListItemText
                          primary={`Week ${data.week}: Weight ${data.weight}g, Height ${data.height}cm (Measurement ID: ${data.id})`}
                          secondary={data.notes}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
                <Button
                  variant="contained"
                  onClick={() => setOpenModal(true)}
                  style={{ backgroundColor: "#D2691E", color: "#fff", mt: 2 }}
                >
                  Create Alert
                </Button>
              </>
            )}
  
            {alerts.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                  Alerts for Customer
                </Typography>
                <List>
                  {alerts.map((alert) => (
                    <React.Fragment key={alert.id}>
                      <ListItem>
                        <Alert severity="warning" sx={alertStyle("warning")}>
                          <ListItemText
                            primary={alert.alertMessage}
                            secondary={`Week: ${alert.week}, Created: ${new Date(alert.createdAt).toLocaleString()}`}
                            secondaryTypographyProps={{ style: { color: "inherit" } }}
                          />
                        </Alert>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
  
            {/* Modal để nhập cảnh báo */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box sx={modalStyle}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Create New Alert
                </Typography>
                <TextField
                  label="Measurement ID"
                  value={newAlert.measurementId}
                  onChange={(e) => setNewAlert({ ...newAlert, measurementId: e.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Message"
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Week"
                  value={newAlert.week}
                  onChange={(e) => setNewAlert({ ...newAlert, week: e.target.value })}
                  fullWidth
                  type="number"
                  required
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleCreateAlert}
                  disabled={loading}
                  style={{ backgroundColor: "#D2691E", color: "#fff" }}
                >
                  {loading ? "Processing..." : "Save Alert"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenModal(false)}
                  sx={{ mt: 2, ml: 2, color: "#F44336", borderColor: "#F44336" }}
                >
                  Cancel
                </Button>
              </Box>
            </Modal>
          </Paper>
        </Box>
      </Box>
    );
  };
  
  export default DoctorGrowthAlert;