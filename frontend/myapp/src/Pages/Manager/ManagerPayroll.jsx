import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { format, subMonths } from "date-fns";
import * as XLSX from "xlsx";

const accountID = sessionStorage.getItem("userID");
const API_URL = `http://localhost:8080/api/payroll/salon/${accountID}`;

const ManagerPayroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayrollId, setSelectedPayrollId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new(); // Tạo một workbook mới
    const ws = XLSX.utils.json_to_sheet(filteredData); // Chuyển đổi filteredData thành sheet Excel
    XLSX.utils.book_append_sheet(wb, ws, "Payroll"); // Thêm sheet vào workbook

    // Tải xuống file Excel
    XLSX.writeFile(wb, "payroll_data.xlsx");
  };
  const fetchPayrollData = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;
      console.log("🚀 ~ data:", data);
      setPayrollData(data);
      filterPayrollByMonth(data, selectedMonth);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchPayrollData();
  }, [fetchPayrollData]);

  const filterPayrollByMonth = (data, month) => {
    const filtered = data.filter(
      (item) => format(new Date(item.payrollDate), "yyyy-MM") === month
    );
    setFilteredData(filtered);
  };

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    filterPayrollByMonth(payrollData, month);
  };

  const updateStatus = async (payrollId) => {
    try {
      await axios.put(`http://localhost:8080/api/payroll/${payrollId}/true`);
      toast.success("Paid Successfully!");
      closeModal();
      fetchPayrollData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleOpenModal = (payrollId) => {
    setSelectedPayrollId(payrollId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPayrollId(null);
  };

  // Generate last 6 months for dropdown
  const getLastSixMonths = () => {
    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = subMonths(new Date(), i);
      months.push({
        value: format(date, "yyyy-MM"),
        label: format(date, "MMMM yyyy"),
      });
    }
    return months;
  };

  const styles = {
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      zIndex: 1001,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
    },
    confirmButton: {
      backgroundColor: "#4caf50",
      color: "white",
      minWidth: "80px",
    },
    cancelButton: {
      backgroundColor: "gray",
      color: "white",
      marginRight: "10px",
    },
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
        Payments Details
      </Typography>

      {/* Month Filter Dropdown */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter by Month</InputLabel>
        <Select
          value={selectedMonth}
          onChange={handleMonthChange}
          label="Filter by Month"
        >
          {getLastSixMonths().map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#4caf50", color: "#fff" }}>
              <TableCell sx={{ color: "#fff" }}>No</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
              <TableCell sx={{ color: "#fff" }}>Role</TableCell>
              <TableCell sx={{ color: "#fff" }}>Date</TableCell>
              <TableCell sx={{ color: "#fff" }}>Earnings</TableCell>
              <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={row.payrollId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.role === 2 ? "Stylist" : "Other"}</TableCell>
                  <TableCell>
                    {format(new Date(row.payrollDate), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{row.earning.toLocaleString()} VNĐ</TableCell>
                  <TableCell
                    sx={{
                      color: row.status ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {row.status ? "Paid" : "Not Yet"}
                  </TableCell>

                  <TableCell>
                    {!row.status && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleOpenModal(row.payrollId)}
                        sx={{ minWidth: "100px" }}
                      >
                        Set Paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={exportToExcel}
        sx={{ mt: 3 }}
      >
        Export to Excel
      </Button>
      {/* Confirmation Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box sx={styles.modal}>
          <Typography variant="h6" component="h2" gutterBottom>
            Are you sure you want to set this payroll as paid?
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="outlined"
              sx={styles.cancelButton}
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={styles.confirmButton}
              onClick={() => updateStatus(selectedPayrollId)}
              style={{ marginLeft: "10px" }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ManagerPayroll;
// ĐÃ XONG HẾT TẤT CẢ
