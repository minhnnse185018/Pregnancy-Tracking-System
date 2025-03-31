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
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ManagerCustomer = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [selectedUser, setSelectedUser] = useState(null);

  // API base URL
  const API_BASE_URL = "http://localhost:5254";

  // Fetch users with userRole 1 (Customer) and 2 (Doctor)
  const fetchUsers = async () => {
    try {
      // Gọi API cho userRole 1 (Customer)
      const customerParams = {
        role: 1,
        status: statusFilter !== "All" ? statusFilter : undefined,
      };
      const customerResponse = await axios.get(
        `${API_BASE_URL}/api/Users/FilterRSTs`,
        { params: customerParams }
      );

      // Gọi API cho userRole 2 (Doctor)
      const doctorParams = {
        role: 2,
        status: statusFilter !== "All" ? statusFilter : undefined,
      };
      const doctorResponse = await axios.get(
        `${API_BASE_URL}/api/Users/FilterRSTs`,
        { params: doctorParams }
      );

      // Kết hợp danh sách Customer và Doctor
      const combinedUsers = [
        ...customerResponse.data.map((user) => ({ ...user, userRole: 1 })),
        ...doctorResponse.data.map((user) => ({ ...user, userRole: 2 })),
      ];

      // Log dữ liệu để kiểm tra
      console.log("Combined Users:", combinedUsers);

      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  // Update user status
  const updateUserStatus = async () => {
    if (!selectedUser) return;

    try {
      const newStatus =
        selectedUser.status === "active" ? "inactive" : "active";
      const response = await axios.put(
        `${API_BASE_URL}/api/Users/Update/${selectedUser.id}`,
        { ...selectedUser, status: newStatus }
      );
      if (response.status === 200) {
        fetchUsers(); // Refresh the list
        handleClose();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Open/close edit modal
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleClose = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
  };

  // Pagination and filtering logic
  const filteredUsers = users; // Đã lọc trực tiếp từ API

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#fce4ec", // Soft pink background
        minHeight: "100vh",
        color: "#333",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 3,
          color: "#f06292", // Darker pink for title
          textAlign: "center",
          textTransform: "uppercase",
          borderBottom: "2px solid #f8bbd0", // Light pink border
          paddingBottom: "8px",
        }}
      >
        Manage Customer & Doctor Accounts
      </Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: "#333" }}>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#f8bbd0",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#f8bbd0",
              },
              borderRadius: "8px",
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Paper
        sx={{
          padding: 3,
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid #f8bbd0", // Light pink border
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f48fb1" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  No
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Role
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Created At
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:hover": { backgroundColor: "#fce4ec" } }}
                >
                  <TableCell>
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </TableCell>
                  <TableCell>{`${user.firstName || "N/A"} ${
                    user.lastName || "N/A"
                  }`}</TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>
                    {user.userRole === 1 ? "Customer" : "Doctor"}
                  </TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: user.status === "active" ? "#4caf50" : "#f44336",
                      fontWeight: "bold",
                    }}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor:
                          user.status === "active" ? "#f44336" : "#f8bbd0",
                        "&:hover": {
                          backgroundColor:
                            user.status === "active" ? "#d32f2f" : "#f06292",
                        },
                        borderRadius: "12px",
                        padding: "4px 12px",
                        textTransform: "none",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        color: user.status === "active" ? "#fff" : "#333",
                      }}
                      onClick={() => handleOpenEditModal(user)}
                    >
                      {user.status === "active" ? "Disable" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#f06292",
              "&.Mui-selected": {
                backgroundColor: "#f8bbd0",
                color: "#333",
              },
            },
          }}
        />
      </Box>

      {/* Modal for enabling/disabling user */}
      <Modal open={openEditModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            p: 4,
            border: "2px solid #f8bbd0", // Light pink border
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 3,
              color: "#f06292", // Darker pink for title
              fontWeight: "bold",
              textAlign: "center",
              borderBottom: "1px dashed #f8bbd0", // Light pink dashed border
              paddingBottom: "8px",
            }}
          >
            {selectedUser?.status === "active"
              ? "Are you sure you want to disable this account?"
              : "Are you sure you want to activate this account?"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleClose}
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
              No
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#f8bbd0", // Light pink button
                "&:hover": { backgroundColor: "#f06292" }, // Darker pink on hover
                borderRadius: "12px",
                padding: "8px 20px",
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                color: "#333",
              }}
              onClick={updateUserStatus}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ManagerCustomer;
