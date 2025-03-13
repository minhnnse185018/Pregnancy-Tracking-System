import {
  Box,
  Button,
  FormControl,
  Grid,
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
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const fullNamePattern = /^[a-zA-Z\s]+$/;

const validationSchema = Yup.object({
  name: Yup.string()
    .max(50, "Name must be 50 characters or less")
    .required("Name is required")
    .test(
      "is-valid-fullname",
      "Name can only contain letters and spaces",
      (value) => fullNamePattern.test(value)
    )
    .trim("Name should not have leading or trailing spaces"),

  email: Yup.string()
    .max(70, "Email must be 70 characters or less")
    .required("Email is required")
    .test("is-valid-email", "Invalid email format", (value) =>
      emailPattern.test(value)
    ),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must be 30 characters or less")
    .required("Password is required")
    .test(
      "is-valid-password",
      "Password should not contain spaces",
      (value) => value && value.length >= 6 && !/\s/.test(value)
    ),

  role: Yup.string().required("Role is required"),

  salonId: Yup.string().required("Salon selection is required"),
});

const AdminPersonnel = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [salons, setSalons] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      salonId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `http://localhost:8080/user/insert/${values.salonId}`,
          values
        );
        if (response.status === 201) {
          const newEmployee = response.data;

          const salon = salons.find((salon) => salon.id === values.salonId);
          if (salon) {
            newEmployee.salonName = salon.name;
          }

          setEmployees((prevEmployees) => [newEmployee, ...prevEmployees]);
          handleClose();
        }
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    },
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeResponse = await axios.get(
          "http://localhost:5254/api/Users/FilterRSts"
        );
        setEmployees(employeeResponse.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    const fetchSalons = async () => {
      try {
        const salonResponse = await axios.get(
          "http://localhost:5254/api/Users/FilterRSts"
        );
        setSalons(salonResponse.data);
        console.log("🚀 ~ salonResponse:", salonResponse.data);
      } catch (error) {
        console.error("Error fetching salon data:", error);
      }
    };

    fetchEmployees();
    fetchSalons();
  }, []);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleClose = () => {
    setOpenAddModal(false);
    setOpenEditModal(false);
    formik.resetForm();
  };

  const handleOpenEditModal = (employee) => {
    setSelectedEmployee(employee);
    setOpenEditModal(true);
  };

  const updateEmployeeStatus = async () => {
    if (!selectedEmployee) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/user/update-status/${selectedEmployee.id}`,
        null,
        {
          params: {
            status: !selectedEmployee.status,
          },
        }
      );
      if (response.status === 200) {
        const employeeResponse = await axios.get(
          "http://localhost:5254/api/Users/FilterRSts"
        );
        setEmployees(employeeResponse.data);
        handleClose();
      }
    } catch (error) {
      console.error("Error updating employee status:", error);
    }
  };

  const paginatedEmployees = employees
    .filter((employee) => {
      const matchesStatus =
        statusFilter === "All" || employee.status === (statusFilter === "true");
      const matchesRole =
        roleFilter === "All" || employee.role.toString() === roleFilter;
      return matchesStatus && matchesRole;
    })
    .slice(
      (currentPage - 1) * employeesPerPage,
      currentPage * employeesPerPage
    );
  const totalPages = Math.ceil(
    employees.filter((employee) => {
      const matchesStatus =
        statusFilter === "All" || employee.status === (statusFilter === "true");
      const matchesRole =
        roleFilter === "All" || employee.role.toString() === roleFilter;
      return matchesStatus && matchesRole;
    }).length / employeesPerPage
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
        Manage Personnel Account
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)} // Lưu trạng thái khi thay đổi
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)} // Lưu vai trò khi thay đổi
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="2">Stylist</MenuItem>
              <MenuItem value="3">Staff</MenuItem>
              <MenuItem value="4">Manager</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddModal}
          sx={{ backgroundColor: "#4CAF50" }}
        >
          Create Personnel Account
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: "#f5f5f5" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#4caf50", color: "#fff" }}>
              <TableCell sx={{ color: "#fff" }}>No</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Role</TableCell>
              <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              {/* <TableCell sx={{ color: "#fff" }}>Salon</TableCell> */}
              <TableCell sx={{ color: "#fff" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((employee, index) => (
              <TableRow key={employee.id}>
                <TableCell>
                  {(currentPage - 1) * employeesPerPage + index + 1}
                </TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  {employee.role === 2
                    ? "Stylist"
                    : employee.role === 3
                    ? "Staff"
                    : employee.role === 4
                    ? "Manager"
                    : "Unknown"}
                </TableCell>
                <TableCell
                  sx={{
                    color: employee.status ? "#4CAF50" : "#F44336",
                  }}
                >
                  {employee.status ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>{employee.salonName}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: employee.status ? "#F44336" : "#4CAF50",
                    }}
                    onClick={() => handleOpenEditModal(employee)}
                  >
                    {employee.status ? "Disable" : "Active"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>

      <Modal open={openAddModal} onClose={handleClose}>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
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
            Add New Employee
          </Typography>

          <TextField
            label="Name"
            fullWidth
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mb: 2 }}
          />
          <FormControl
            fullWidth
            sx={{ mb: 2 }}
            error={formik.touched.role && Boolean(formik.errors.role)}
          >
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="2">Stylist</MenuItem>
              <MenuItem value="3">Staff</MenuItem>
              <MenuItem value="4">Manager</MenuItem>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <Typography color="error" variant="caption">
                {formik.errors.role}
              </Typography>
            )}
          </FormControl>
          <FormControl
            fullWidth
            sx={{ mb: 2 }}
            error={formik.touched.salonId && Boolean(formik.errors.salonId)}
          >
            <InputLabel>Salon</InputLabel>
            <Select
              name="salonId"
              value={formik.values.salonId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {salons.map((salon) => (
                <MenuItem key={salon.id} value={salon.id}>
                  {salon.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.salonId && formik.errors.salonId && (
              <Typography color="error" variant="caption">
                {formik.errors.salonId}
              </Typography>
            )}
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ color: "#F44336", borderColor: "#F44336" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!formik.isValid || !formik.dirty}
            >
              Add Employee
            </Button>
          </Box>
        </Box>
      </Modal>

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
            {selectedEmployee?.status
              ? "Are you sure you want to disable this account?"
              : "Are you sure you want to activate this account?"}
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
              variant="contained"
              color="primary"
              sx={{ bgcolor: "#4CAF50" }}
              onClick={updateEmployeeStatus}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminPersonnel;
// XONG
