import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
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
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Modal,
  TextField,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
const ManagerPersonnel = () => {
  const [employees, setEmployees] = useState([]);
  const [roleFilter, setRoleFilter] = useState("3");
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const employeesPerPage = 5;
  const [editStaffModalOpen, setEditStaffModalOpen] = useState(false);
  const [editStylistModalOpen, setEditStylistModalOpen] = useState(false);
  const [tempSalary, setTempSalary] = useState("");
  const tempSalaryRef = useRef(selectedEmployee?.salary || "");
  const tempCommissionRef = useRef(selectedEmployee?.commission || "");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const accountID = sessionStorage.getItem("userID");
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeResponse = await axios.get(
          `http://localhost:8080/user/fetchEmployees/${accountID}`
        );
        console.log(employeeResponse.data);
        setEmployees(employeeResponse.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);
  const staffValidationSchema = Yup.object({
    salary: Yup.number()
      .required("Salary is required")
      .min(0, "Salary must be a positive number"),
  });
  const stylistValidationSchema = Yup.object({
    salary: Yup.number()
      .required("Salary is required")
      .min(0, "Salary must be a positive number"),
    commission: Yup.number()
      .required("Commission is required")
      .min(0.1, "Commission must be at least 0.1")
      .max(1, "Commission must be at most 1"),
  });

  // Đóng modal và đặt lại nhân viên được chọn

  // -----------------------------------------------------------------------------------------
  // Filter employees based on role
  const filteredEmployees = employees.filter((employee) => {
    return employee.role === parseInt(roleFilter);
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  // Get employees for the current page
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  // Handle edit button click
  // Xử lý khi nhấn nút Edit
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setTempSalary(employee.salary || ""); // Đặt giá trị cũ vào tempSalary
    if (employee.role === 2) {
      setEditStylistModalOpen(true);
    } else if (employee.role === 3) {
      setEditStaffModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    setEditStaffModalOpen(false);
    setEditStylistModalOpen(false);
    setSelectedEmployee(null);
  };
  // Làm mới dữ liệu sau khi cập nhật
  const refreshData = async () => {
    try {
      const employeeResponse = await axios.get(
        `http://localhost:8080/user/fetchEmployees/${accountID}`
      );
      setEmployees(employeeResponse.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  //----------------------------------------------------------------------------
  // const EditStaffModal = () => (
  //   <Modal open={editStaffModalOpen} onClose={handleCloseModal}>
  //     <Box
  //       sx={{
  //         position: "absolute",
  //         top: "50%",
  //         left: "50%",
  //         transform: "translate(-50%, -50%)",
  //         width: 400,
  //         bgcolor: "background.paper",
  //         border: "2px solid #000",
  //         boxShadow: 24,
  //         p: 4,
  //       }}
  //     >
  //       <Typography variant="h6" sx={{ mb: 2 }}>
  //         Edit Salary for Staff
  //       </Typography>
  //       <TextField
  //         fullWidth
  //         label="Salary"
  //         defaultValue={selectedEmployee?.salary || ""} // Giá trị ban đầu từ state chính
  //         onChange={(e) => {
  //           tempSalaryRef.current = e.target.value; // Lưu giá trị vào ref thay vì state
  //         }}
  //         sx={{ mb: 2 }}
  //       />
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         onClick={async () => {
  //           // Lấy giá trị từ ref và chuyển đổi thành số
  //           const updatedSalary = parseInt(tempSalaryRef.current, 10);

  //           // Kiểm tra tính hợp lệ
  //           if (isNaN(updatedSalary) || updatedSalary < 0) {
  //             setSnackbarMessage("Please enter a valid salary.");
  //             setSnackbarSeverity("error");
  //             setSnackbarOpen(true);
  //             return;
  //           }

  //           // Cập nhật state chính từ giá trị tạm trong ref
  //           setSelectedEmployee((prev) => ({
  //             ...prev,
  //             salary: updatedSalary,
  //           }));

  //           // Gửi yêu cầu API để cập nhật salary
  //           try {
  //             await axios.put(
  //               `http://localhost:8080/salary/staff/update/${selectedEmployee.id}`,
  //               { salary: updatedSalary }
  //             );
  //             setSnackbarMessage("Staff salary updated successfully");
  //             setSnackbarSeverity("success");
  //             setSnackbarOpen(true);
  //             handleCloseModal();
  //             refreshData();
  //           } catch (error) {
  //             console.error("Error updating staff salary:", error);
  //           }
  //         }}
  //         sx={{ mr: 2 }}
  //       >
  //         Save
  //       </Button>
  //     </Box>
  //   </Modal>
  // );
  const EditStaffModal = () => (
    <Modal open={editStaffModalOpen} onClose={handleCloseModal}>
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
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Edit Salary for Staff
        </Typography>

        <Formik
          initialValues={{ salary: selectedEmployee?.salary || "" }}
          validationSchema={staffValidationSchema}
          onSubmit={async (values) => {
            try {
              await axios.put(
                `http://localhost:8080/salary/staff/update/${selectedEmployee.id}`,
                { salary: values.salary }
              );
              setSnackbarMessage("Staff salary updated successfully");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
              handleCloseModal();
              refreshData();
            } catch (error) {
              setSnackbarMessage("Failed to update staff salary");
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            }
          }}
        >
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <Form>
              <TextField
                fullWidth
                label="Salary"
                name="salary"
                value={values.salary}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mb: 2 }}
                error={Boolean(errors.salary && touched.salary)}
                helperText={<ErrorMessage name="salary" />}
              />
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );

  // const EditStylistModal = () => (
  //   <Modal open={editStylistModalOpen} onClose={handleCloseModal}>
  //     <Box
  //       sx={{
  //         position: "absolute",
  //         top: "50%",
  //         left: "50%",
  //         transform: "translate(-50%, -50%)",
  //         width: 400,
  //         bgcolor: "background.paper",
  //         border: "2px solid #000",
  //         boxShadow: 24,
  //         p: 4,
  //       }}
  //     >
  //       <Typography variant="h6" sx={{ mb: 2 }}>
  //         Edit Salary and Commission for Stylist
  //       </Typography>

  //       {/* Sử dụng ref cho Salary */}
  //       <TextField
  //         fullWidth
  //         label="Salary"
  //         type="text"
  //         defaultValue={selectedEmployee?.salary || ""}
  //         onChange={(e) => {
  //           tempSalaryRef.current = e.target.value; // Lưu giá trị tạm thời vào ref
  //         }}
  //         inputProps={{ min: 0 }} // Giới hạn giá trị tối thiểu là 0
  //         sx={{ mb: 2 }}
  //       />

  //       {/* Sử dụng ref cho Commission */}
  //       <TextField
  //         fullWidth
  //         label="Commission"
  //         type="text"
  //         defaultValue={selectedEmployee?.commission || ""}
  //         onChange={(e) => {
  //           tempCommissionRef.current = e.target.value; // Lưu giá trị tạm thời vào ref
  //         }}
  //         inputProps={{ step: 0.1, min: 0.1, max: 1 }}
  //         sx={{ mb: 2 }}
  //       />

  //       <Button
  //         variant="contained"
  //         color="primary"
  //         onClick={async () => {
  //           const updatedSalary = parseFloat(tempSalaryRef.current);
  //           const updatedCommission = parseFloat(tempCommissionRef.current);

  //           // Kiểm tra tính hợp lệ của giá trị
  //           if (isNaN(updatedSalary) || updatedSalary < 0) {
  //             setSnackbarMessage("Please enter a valid salary.");
  //             setSnackbarSeverity("error");
  //             setSnackbarOpen(true);
  //             return;
  //           }

  //           if (
  //             isNaN(updatedCommission) ||
  //             updatedCommission < 0.1 ||
  //             updatedCommission > 1
  //           ) {
  //             setSnackbarMessage("Please enter a valid commission (0.1 to 1).");
  //             setSnackbarSeverity("error");
  //             setSnackbarOpen(true);
  //             return;
  //           }

  //           try {
  //             await axios.put(
  //               `http://localhost:8080/salary/stylist/update/${selectedEmployee.id}`,
  //               {
  //                 salary: updatedSalary,
  //                 commission: updatedCommission,
  //               }
  //             );
  //             setSnackbarMessage(
  //               "Stylist salary and commission updated successfully"
  //             );
  //             setSnackbarSeverity("success");
  //             setSnackbarOpen(true);
  //             handleCloseModal();
  //             refreshData();
  //           } catch (error) {
  //             console.error("Error updating stylist:", error);
  //             setSnackbarMessage(
  //               "Failed to update stylist salary and commission"
  //             );
  //             setSnackbarSeverity("error");
  //             setSnackbarOpen(true); // Mở Snackbar
  //           }
  //         }}
  //         sx={{ mr: 2 }}
  //       >
  //         Save
  //       </Button>

  //       <Button variant="outlined" onClick={handleCloseModal}>
  //         Cancel
  //       </Button>
  //     </Box>
  //   </Modal>
  // );
  const EditStylistModal = () => (
    <Modal open={editStylistModalOpen} onClose={handleCloseModal}>
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
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Edit Salary and Commission for Stylist
        </Typography>

        <Formik
          initialValues={{
            salary: selectedEmployee?.salary || "",
            commission: selectedEmployee?.commission || "",
          }}
          validationSchema={stylistValidationSchema}
          onSubmit={async (values) => {
            try {
              await axios.put(
                `http://localhost:8080/salary/stylist/update/${selectedEmployee.id}`,
                {
                  salary: values.salary,
                  commission: values.commission,
                }
              );
              setSnackbarMessage(
                "Stylist salary and commission updated successfully"
              );
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
              handleCloseModal();
              refreshData();
            } catch (error) {
              setSnackbarMessage(
                "Failed to update stylist salary and commission"
              );
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            }
          }}
        >
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <Form>
              <TextField
                fullWidth
                label="Salary"
                name="salary"
                value={values.salary}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mb: 2 }}
                error={Boolean(errors.salary && touched.salary)}
                helperText={<ErrorMessage name="salary" />}
              />
              <TextField
                fullWidth
                label="Commission"
                name="commission"
                value={values.commission}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mb: 2 }}
                error={Boolean(errors.commission && touched.commission)}
                helperText={<ErrorMessage name="commission" />}
              />
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
  // ---------------------------------------------------------------------
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
        Personnel
      </Typography>

      {/* Filter Section */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1); // Reset to page 1 after filter change
              }}
            >
              {/* ------------------------------------------------------------------------------------------ */}
              <MenuItem value="2">Stylist</MenuItem>
              <MenuItem value="3">Staff</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Personnel Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: "#f5f5f5" }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#4caf50",
                color: "#fff",
              }}
            >
              <TableCell sx={{ color: "#fff" }}>No</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Role</TableCell>
              <TableCell sx={{ color: "#fff" }}>Salary</TableCell>
              {roleFilter === "2" && (
                <TableCell sx={{ color: "#fff" }}>Commission</TableCell>
              )}
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
                <TableCell>
                  {employee.role === 2 ? "Stylist" : "Staff"}
                </TableCell>
                <TableCell>{employee.salary}</TableCell>
                {roleFilter === "2" && employee.role === 2 && (
                  <TableCell>{`${employee.commission * 100}%`}</TableCell>
                )}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ backgroundColor: "#4CAF50" }}
                    onClick={() => handleEditClick(employee)}
                  >
                    Edit
                  </Button>
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
      <EditStaffModal />
      <EditStylistModal />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1200}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerPersonnel;
// THÔNG BÁO CÒN LOCALHOST
