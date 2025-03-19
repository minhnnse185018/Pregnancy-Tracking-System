import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ManageCustomer = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [customers, setCustomers] = useState([]); // Store the list of customers
  const [statusFilter, setStatusFilter] = useState("All"); // Filter for status
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const customersPerPage = 5; // Number of customers per page
  const [selectedCustomer, setSelectedCustomer] = useState({
    id: "",
    status: "",
  }); // Store the customer being edited
  const [startDate, setStartDate] = useState(null); // Start date for filtering
  const [endDate, setEndDate] = useState(null); // End date for filtering
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages

  // Fetch all customers using the GET /api/Users/GetAll endpoint
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5254/api/Users/GetAll");
        if (Array.isArray(response.data)) {
          setCustomers(response.data);
        } else {
          setCustomers([]); // Set to empty array if response is not an array
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([]); // Set to empty array on error
        setErrorMessage("Failed to fetch customers. Please try again.");
      }
    };

    fetchCustomers();
  }, []);

  // Update customer status using the PUT /api/Users/UpdateStatus endpoint
  const updateCustomerStatus = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5254/api/Users/UpdateStatus",
        {
          id: selectedCustomer.id,
          status: selectedCustomer.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Fetch updated customer list after status change
        const customerResponse = await axios.get("http://localhost:5254/api/Users/GetAll");
        if (Array.isArray(customerResponse.data)) {
          setCustomers(customerResponse.data);
        }
        setErrorMessage(""); // Clear any previous error messages
        handleClose();
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      setErrorMessage("Failed to update customer status. Please try again.");
    }
  };

  const handleOpenEditModal = (customerId, newStatus) => {
    setSelectedCustomer({
      id: customerId,
      status: newStatus,
    });
    setOpenEditModal(true);
  };

  const handleClose = () => {
    setOpenEditModal(false);
    setSelectedCustomer({
      id: "",
      status: "",
    });
    setErrorMessage(""); // Clear error message on modal close
  };

  // Calculate total pages after filtering
  const totalPages = Math.ceil(
    customers.filter((customer) => {
      const customerDate = new Date(customer.createdAt);
      const isStatusMatch =
        statusFilter === "All" || customer.status.toLowerCase() === statusFilter.toLowerCase();
      const isDateInRange =
        (!startDate || customerDate >= startDate) &&
        (!endDate || customerDate <= endDate);

      return isStatusMatch && isDateInRange;
    }).length / customersPerPage
  );

  // Filter and paginate the customer list
  const paginatedCustomers = customers
    .filter((customer) => {
      const customerDate = new Date(customer.createdAt);
      const isStatusMatch =
        statusFilter === "All" || customer.status.toLowerCase() === statusFilter.toLowerCase();
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

      {/* Filter Section */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Date Filter */}
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

      {/* Display Error Message */}
      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {/* Customer Table */}
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
                <TableCell>
                  {customer.firstName || customer.lastName
                    ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                    : "N/A"}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell
                  sx={{
                    color: customer.status.toLowerCase() === "active" ? "#4CAF50" : "#F44336",
                  }}
                >
                  {customer.status.toLowerCase() === "active" ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  {customer.status.toLowerCase() === "active" ? (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#F44336" }}
                      onClick={() =>
                        handleOpenEditModal(customer.id, "inactive")
                      }
                    >
                      Disable
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#4CAF50" }}
                      onClick={() => handleOpenEditModal(customer.id, "active")}
                    >
                      Enable
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>

      {/* Edit Modal */}
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
            {selectedCustomer.status === "active"
              ? "Activate this account?"
              : "Deactivate this account?"}
          </Typography>
          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}
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
              onClick={updateCustomerStatus}
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