import {
  Alert,
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
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string()
    .max(50, "Name must be 50 characters or less")
    .required("Name is required")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .trim("Name should not have leading or trailing spaces"),
  email: Yup.string()
    .email("Invalid email format")
    .max(70, "Email must be 70 characters or less")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  gender: Yup.string().required("Gender is required"),
  dateOfBirth: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
});

const AdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const adminId = 2; // Hardcoded for now; in a real app, this would come from auth context

  // Fetch admin profile from API
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5254/api/Users/GetById/${adminId}`
        );
        setAdminProfile(response.data);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        setErrorMessage("Failed to fetch profile. Please try again later.");
      }
    };
    fetchAdminProfile();
  }, [adminId]);

  // Formik for editing profile
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setErrorMessage(""); // Clear previous errors
      try {
        const response = await axios.put(
          `http://localhost:5254/api/Users/Update/${adminId}`,
          {
            ...values,
            status: adminProfile.status === "active", // Convert status to boolean
          }
        );
        if (response.status === 200) {
          setAdminProfile({ ...adminProfile, ...values });
          handleClose();
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        if (error.response && error.response.status === 400) {
          setErrorMessage("Invalid data provided. Please check your inputs.");
        } else {
          setErrorMessage("Failed to update profile. Please try again later.");
        }
      }
    },
  });

  const handleOpenEditModal = () => {
    if (adminProfile) {
      formik.setValues({
        name: adminProfile.name || `${adminProfile.firstName} ${adminProfile.lastName}`,
        email: adminProfile.email,
        phone: adminProfile.phone,
        gender: adminProfile.gender || "",
        dateOfBirth: adminProfile.dateOfBirth
          ? adminProfile.dateOfBirth.split("T")[0]
          : "",
      });
      setOpenEditModal(true);
    }
  };

  const handleClose = () => {
    setOpenEditModal(false);
    setErrorMessage("");
    formik.resetForm();
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        color: "#333",
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Admin Profile
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Profile Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: "#fff" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Phone
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Gender
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Date of Birth
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminProfile ? (
              <TableRow>
                <TableCell>
                  {adminProfile.name ||
                    `${adminProfile.firstName} ${adminProfile.lastName}`}
                </TableCell>
                <TableCell>{adminProfile.email}</TableCell>
                <TableCell>{adminProfile.phone}</TableCell>
                <TableCell>{adminProfile.gender}</TableCell>
                <TableCell>
                  {adminProfile.dateOfBirth
                    ? adminProfile.dateOfBirth.split("T")[0]
                    : "N/A"}
                </TableCell>
                <TableCell
                  sx={{
                    color:
                      adminProfile.status === "active" ? "#4CAF50" : "#F44336",
                    fontWeight: "bold",
                  }}
                >
                  {adminProfile.status === "active" ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#1976d2",
                    }}
                    onClick={handleOpenEditModal}
                  >
                    Edit Profile
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading profile...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={handleClose}>
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
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Edit Profile
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

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
            label="Phone"
            fullWidth
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {formik.touched.gender && formik.errors.gender && (
              <Typography color="error" variant="caption">
                {formik.errors.gender}
              </Typography>
            )}
          </FormControl>
          <TextField
            label="Date of Birth"
            fullWidth
            type="date"
            name="dateOfBirth"
            value={formik.values.dateOfBirth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)
            }
            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

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
              sx={{ backgroundColor: "#1976d2" }}
              disabled={!formik.isValid || !formik.dirty}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminProfile;