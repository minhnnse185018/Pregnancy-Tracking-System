import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Modal,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const ManageCustomer = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [customers, setCustomers] = useState([]); // Đảm bảo là mảng
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;
  const [newCustomer, setNewCustomer] = useState({
    id: "",
    status: "",
  });
  const [startDate, setStartDate] = useState(null); // Ngày bắt đầu cho lọc
  const [endDate, setEndDate] = useState(null); // Ngày kết thúc cho lọc

  // Fetch dữ liệu khách hàng
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerResponse = await axios.get(
          "http://localhost:8080/user/customers"
        );
        // Kiểm tra kết quả trả về có phải là một mảng hay không
        if (Array.isArray(customerResponse.data)) {
          setCustomers(customerResponse.data);
        } else {
          setCustomers([]); // Nếu không phải mảng, đặt thành mảng rỗng
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setCustomers([]); // Đặt thành mảng rỗng nếu có lỗi
      }
    };

    fetchCustomers();
  }, []);

  // Cập nhật trạng thái khách hàng
  const updateCustomer = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/user/update-status/${newCustomer.id}`,
        null,
        {
          params: {
            status: newCustomer.status,
          },
        }
      );
      if (response.status === 200) {
        const customerResponse = await axios.get(
          "http://localhost:8080/user/customers"
        );
        setCustomers(customerResponse.data);
        handleClose();
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleClose = () => {
    setOpenEditModal(false);
    setNewCustomer({
      id: "",
      status: "",
    });
  };

  // Tính tổng số trang sau khi lọc
  const totalPages = Math.ceil(
    customers.filter((customer) => {
      const customerDate = new Date(customer.registerDate);
      const isStatusMatch =
        statusFilter === "All" || String(customer.status) === statusFilter;
      const isDateInRange =
        (!startDate || customerDate >= startDate) &&
        (!endDate || customerDate <= endDate);

      return isStatusMatch && isDateInRange;
    }).length / customersPerPage
  );

  // Lọc và phân trang danh sách khách hàng
  const paginatedCustomers = customers
    .filter((customer) => {
      const customerDate = new Date(customer.registerDate);
      const isStatusMatch =
        statusFilter === "All" || String(customer.status) === statusFilter;
      const isDateInRange =
        (!startDate || customerDate >= startDate) &&
        (!endDate || customerDate <= endDate);

      return isStatusMatch && isDateInRange;
    })
    .slice(
      (currentPage - 1) * customersPerPage,
      currentPage * customersPerPage
    );

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#fff",
        minHeight: "100vh",
        color: "#333",
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Manage Customer Account
      </Typography>

      {/* Phần lọc */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Bộ lọc thời gian đăng ký */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>

      {/* Bảng khách hàng */}
      <TableContainer component={Paper} sx={{ backgroundColor: "#f5f5f5" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#4caf50", color: "#fff" }}>
              <TableCell sx={{ color: "#fff" }}>No</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Register Date</TableCell>
              <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((customer, index) => (
              <TableRow key={customer.id}>
                <TableCell>
                  {(currentPage - 1) * customersPerPage + index + 1}
                </TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  {new Date(customer.registerDate).toLocaleDateString()}
                </TableCell>
                <TableCell
                  sx={{
                    color: customer.status ? "#4CAF50" : "#F44336",
                  }}
                >
                  {customer.status ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  {customer.status ? (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ backgroundColor: "#F44336" }}
                      onClick={() => {
                        setNewCustomer({
                          id: customer.id,
                          status: false,
                        });
                        handleOpenEditModal();
                      }}
                    >
                      Disable
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ backgroundColor: "#4CAF50" }}
                      onClick={() => {
                        setNewCustomer({
                          id: customer.id,
                          status: true,
                        });
                        handleOpenEditModal();
                      }}
                    >
                      Active
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>

      {/* Modal chỉnh sửa */}
      <Modal open={openEditModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            {newCustomer.status
              ? "Activate this account?"
              : "Deactivate this account?"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ color: "#F44336", borderColor: "#F44336" }}
            >
              No
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: "#4CAF50" }}
              onClick={updateCustomer}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ManageCustomer;
