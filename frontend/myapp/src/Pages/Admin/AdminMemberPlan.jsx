import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Snackbar,
  Stack,
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
import { ErrorMessage, Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

// Helper function to format price with thousand separators
const formatPrice = (price) => {
  if (isNaN(price) || price === "") return "";
  return (
    parseFloat(price)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
  );
};

const AdminMemberPlan = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [memberPlanList, setMemberPlanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    planId: "",
    planName: "",
    price: "",
    duration: "",
    description: "",
    status: "true",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchMemberPlanData();
  }, []);

  const validationSchema = Yup.object().shape({
    planName: Yup.string()
      .required("Plan name is required")
      .matches(
        /^[A-Za-z0-9\s!?-]+$/,
        "Plan name can only contain letters, numbers, spaces, and !?.- characters"
      )
      .trim("Plan name should not have leading or trailing spaces")
      .max(100, "Plan name must be less than 100 characters"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be a positive number")
      .typeError("Price must be a valid number"),
    duration: Yup.number()
      .required("Duration is required")
      .min(1, "Duration must be at least 1 month")
      .max(9, "Duration must be less than 9 months")
      .typeError("Duration must be a valid number"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must be less than 1000 characters"),
    status: Yup.string()
      .oneOf(["true", "false"], "Status must be either 'true' or 'false'")
      .required("Status is required"),
  });

  const fetchMemberPlanData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5254/api/MemberShipPlan/GetAllPlans"
      );
      setMemberPlanList(response.data);
    } catch (err) {
      console.error(
        "Fetch error:",
        err.response ? err.response.data : err.message
      );
      setError(
        "Error fetching member plan data: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(
        `http://localhost:5254/api/MemberShipPlan/DeletePlan/${planId}`
      );
      setSnackbarMessage("Plan deleted successfully!");
      fetchMemberPlanData();
      setSnackbarOpen(true);
    } catch (err) {
      console.error(
        "Delete error:",
        err.response ? err.response.data : err.message
      );
      if (err.response?.data?.message?.includes("REFERENCE constraint")) {
        setSnackbarMessage(
          "Cannot delete this plan because it is currently in use by active memberships."
        );
      } else {
        setSnackbarMessage(
          "Failed to delete plan: " +
            (err.response?.data?.message || err.message)
        );
      }
      setError(err.response?.data?.message || "Failed to delete plan.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenAddModal = () => {
    setFormData({
      planId: "",
      planName: "",
      price: "",
      duration: "",
      description: "",
      status: "true",
    });
    setOpenAddModal(true);
  };

  const handleOpenEditModal = (plan) => {
    setFormData({
      planId: plan.id,
      planName: plan.planName,
      price: plan.price,
      duration: plan.duration,
      description: plan.description,
      status: plan.active ? "true" : "false",
    });
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenAddModal(false);
    setOpenEditModal(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (values.planId) {
        await axios.put(
          `http://localhost:5254/api/MemberShipPlan/UpdatePlan/${values.planId}`,
          {
            planName: values.planName,
            price: parseFloat(values.price),
            duration: values.duration,
            description: values.description,
            active: values.status === "true",
          }
        );
        setSnackbarMessage("Plan updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5254/api/MemberShipPlan/CreatePlan",
          {
            planName: values.planName,
            price: parseFloat(values.price),
            duration: values.duration,
            description: values.description,
            active: values.status === "true",
          }
        );
        setSnackbarMessage("Plan added successfully!");
      }

      fetchMemberPlanData();
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (err) {
      console.error(
        "Submit error:",
        err.response ? err.response.data : err.message
      );
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save plan due to an unknown error.";
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

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
        Membership Plan Management
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f8bbd0", // Light pink button
            "&:hover": { backgroundColor: "#f06292" }, // Darker pink on hover
            borderRadius: "20px",
            padding: "8px 20px",
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            color: "#333", // Darker text for contrast
          }}
          onClick={handleOpenAddModal}
        >
          Add New Plan
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
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
                      Plan Name
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Price
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Duration (Months)
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {memberPlanList.map((plan, index) => (
                    <TableRow
                      key={plan.id}
                      sx={{
                        "&:hover": { backgroundColor: "#fce4ec" }, // Soft pink hover
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{plan.planName}</TableCell>
                      <TableCell>{formatPrice(plan.price)}</TableCell>
                      <TableCell>{plan.duration}</TableCell>
                      <TableCell>{plan.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#f8bbd0", // Light pink button
                            "&:hover": { backgroundColor: "#f06292" }, // Darker pink on hover
                            borderRadius: "12px",
                            padding: "4px 12px",
                            textTransform: "none",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            mr: 1,
                            color: "#333",
                          }}
                          onClick={() => handleOpenEditModal(plan)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#f44336",
                            "&:hover": { backgroundColor: "#d32f2f" },
                            borderRadius: "12px",
                            padding: "4px 12px",
                            textTransform: "none",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal for Add/Edit Member Plan */}
      <Modal
        open={openAddModal || openEditModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
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
            {openEditModal ? "Edit Member Plan" : "Add New Member Plan"}
          </Typography>
          <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              setFormData(values);
              handleSubmit(values);
            }}
            enableReinitialize
          >
            {({
              handleSubmit,
              errors,
              touched,
              isValid,
              dirty,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Plan Name"
                    name="planName"
                    helperText={<ErrorMessage name="planName" />}
                    error={touched.planName && Boolean(errors.planName)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&:hover fieldset": {
                          borderColor: "#f8bbd0", // Light pink on hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#f8bbd0", // Light pink when focused
                        },
                      },
                    }}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    label="Price (VND)"
                    name="price"
                    type="number"
                    step="1"
                    helperText={<ErrorMessage name="price" />}
                    error={touched.price && Boolean(errors.price)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&:hover fieldset": {
                          borderColor: "#f8bbd0",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#f8bbd0",
                        },
                      },
                    }}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    label="Duration (Months)"
                    name="duration"
                    type="number"
                    helperText={<ErrorMessage name="duration" />}
                    error={touched.duration && Boolean(errors.duration)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&:hover fieldset": {
                          borderColor: "#f8bbd0",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#f8bbd0",
                        },
                      },
                    }}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    helperText={<ErrorMessage name="description" />}
                    error={touched.description && Boolean(errors.description)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&:hover fieldset": {
                          borderColor: "#f8bbd0",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#f8bbd0",
                        },
                      },
                    }}
                  />
                  <FormControl
                    fullWidth
                    error={touched.status && Boolean(errors.status)}
                  >
                    <InputLabel>Status</InputLabel>
                    <Field
                      as={Select}
                      name="status"
                      onChange={(e) => setFieldValue("status", e.target.value)}
                      sx={{
                        borderRadius: "8px",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f8bbd0",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f8bbd0",
                        },
                      }}
                    >
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                    </Field>
                    <ErrorMessage name="status" component="div" />
                  </FormControl>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleCloseModal}
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
                      Cancel
                    </Button>
                    <Button
                      type="submit"
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
                      disabled={!isValid || !dirty}
                    >
                      {openEditModal ? "Save Changes" : "Add Plan"}
                    </Button>
                  </Box>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbarMessage.includes("Failed") ||
            snackbarMessage.includes("Cannot")
              ? "error"
              : "success"
          }
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminMemberPlan;
