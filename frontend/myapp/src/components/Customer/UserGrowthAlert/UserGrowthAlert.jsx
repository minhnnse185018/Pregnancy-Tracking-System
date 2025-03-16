import {
    Alert,
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
  
  // Ngưỡng chuẩn của thai nhi (dựa trên tuần thai, giá trị tham khảo)
  const growthStandards = {
    12: { minWeight: 400, maxWeight: 600, minHeight: 6, maxHeight: 10 },
    16: { minWeight: 600, maxWeight: 800, minHeight: 10, maxHeight: 15 },
    20: { minWeight: 800, maxWeight: 1000, minHeight: 15, maxHeight: 20 },
    // Thêm các tuần khác nếu cần
  };
  
  const UserGrowthAlert = () => {
    const [growthData, setGrowthData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newTracking, setNewTracking] = useState({
      weight: "",
      height: "",
      week: "",
    });
  
    // Giả định customerId (profileId) được lấy từ thông tin đăng nhập của user
    const customerId = sessionStorage.getItem("userID");
  
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
  
    const handleAddTracking = async (e) => {
      e.preventDefault();
      if (!newTracking.weight || !newTracking.height || !newTracking.week) {
        setError("Please fill in all required fields (weight, height, week)!");
        return;
      }
  
      const weekValue = parseInt(newTracking.week);
      const weightValue = parseInt(newTracking.weight);
      const heightValue = parseInt(newTracking.height);
  
      if (isNaN(weekValue) || weekValue < 1 || weekValue > 42) {
        setError("Week must be a valid integer between 1 and 42!");
        return;
      }
      if (isNaN(weightValue) || isNaN(heightValue)) {
        setError("Weight and height must be valid numbers!");
        return;
      }
  
      const standards = growthStandards[weekValue] || {
        minWeight: 0,
        maxWeight: Infinity,
        minHeight: 0,
        maxHeight: Infinity,
      };
      const isAbnormal =
        weightValue < standards.minWeight ||
        weightValue > standards.maxWeight ||
        heightValue < standards.minHeight ||
        heightValue > standards.maxHeight;
  
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token");
        const trackingData = {
          profileId: customerId,
          weightGrams: weightValue,
          heightCm: heightValue,
          week: weekValue,
          measurementDate: new Date().toISOString(),
        };
        const response = await axios.post(
          `http://localhost:5254/api/FetalMeasurement`,
          trackingData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const newMeasurementId = response.data.id; // Giả định API trả về ID của bản ghi mới
  
        // Lấy dữ liệu mới nhất để cập nhật state
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
  
        // Nếu có bất thường, tạo alert
        if (isAbnormal) {
          const alertMessage = `Abnormal growth detected: Weight ${weightValue}g (range: ${standards.minWeight}-${standards.maxWeight}g), Height ${heightValue}cm (range: ${standards.minHeight}-${standards.maxHeight}cm) at Week ${weekValue}.`;
          const alertData = {
            measurementId: newMeasurementId, // Đổi thành measurementId để khớp với schema
            alertMessage,
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
  
          // Cập nhật danh sách alert
          const alertResponse = await axios.get(
            `http://localhost:5254/api/GrowthAlert/customer/${customerId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAlerts(alertResponse.data);
        }
  
        setNewTracking({ weight: "", height: "", week: "" });
      } catch (err) {
        console.error("Save error:", err.response ? err.response.data : err.message);
        setError(`Error saving tracking: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
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
  
    const alertStyle = () => ({
      marginBottom: "8px",
      backgroundColor: "#FF9800",
      color: "#fff",
    });
  
    return (
      <Box sx={pageStyle}>
        <Box sx={containerStyle}>
          <Paper sx={paperStyle}>
            <Typography variant="h4" sx={titleStyle}>
              Growth Tracker & Alerts (User View)
            </Typography>
  
            {loading && <Typography>Loading...</Typography>}
            {error && <Alert severity="error">{error}</Alert>}
  
            <form onSubmit={handleAddTracking}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Add New Tracking
              </Typography>
              <TextField
                label="Weight (grams)"
                value={newTracking.weight}
                onChange={(e) => setNewTracking({ ...newTracking, weight: e.target.value })}
                fullWidth
                type="number"
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Height (cm)"
                value={newTracking.height}
                onChange={(e) => setNewTracking({ ...newTracking, height: e.target.value })}
                fullWidth
                type="number"
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Week"
                value={newTracking.week}
                onChange={(e) => setNewTracking({ ...newTracking, week: e.target.value })}
                fullWidth
                type="number"
                required
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                type="submit"
                style={{ backgroundColor: "#D2691E", color: "#fff" }}
                disabled={loading}
              >
                {loading ? "Processing..." : "Save Tracking"}
              </Button>
            </form>
  
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
                          primary={`Week ${data.week}: Weight ${data.weight}g, Height ${data.height}cm (ID: ${data.id})`}
                          secondary={data.notes}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
  
            {alerts.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                  Your Alerts
                </Typography>
                <List>
                  {alerts.map((alert) => (
                    <React.Fragment key={alert.id}>
                      <ListItem>
                        <Alert severity="warning" sx={alertStyle()}>
                          <ListItemText
                            primary={alert.alertMessage}
                            secondary={`Created: ${new Date(alert.createdAt).toLocaleString()}`}
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
          </Paper>
        </Box>
      </Box>
    );
  };
  
  export default UserGrowthAlert;