import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
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
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

// Common styles for the component
const commonStyles = {
  button: {
    backgroundColor: "#f8bbd0",
    "&:hover": { backgroundColor: "#f06292" },
    borderRadius: "12px",
    padding: "8px 20px",
    textTransform: "none",
    fontWeight: "bold",
  },
  tableHeader: {
    backgroundColor: "#f8bbd0",
    color: "#333",
    fontWeight: "bold",
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#fce4ec",
    },
    "&:hover": {
      backgroundColor: "#ffebee",
    },
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "&:hover fieldset": { borderColor: "#f8bbd0" },
      "&.Mui-focused fieldset": { borderColor: "#f8bbd0" },
    },
  },
};

const ManagerFetalStandard = () => {
  const [standards, setStandards] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editStandard, setEditStandard] = useState(null);
  const accountID = sessionStorage.getItem("userID");

  // Fetch all fetal growth standards
  const fetchStandards = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5254/api/FetalGrowthStandard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setStandards(response.data);
      }
    } catch (error) {
      console.error("Error fetching fetal growth standards:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to fetch fetal growth standards.",
        severity: "error",
      });
    }
  };

  // Fetch standards on component mount
  useEffect(() => {
    if (!accountID) {
      setSnackbar({
        open: true,
        message: "User ID not found. Please log in.",
        severity: "error",
      });
      return;
    }

    fetchStandards();
  }, [accountID]);

  // Handle creating a new fetal growth standard
  const handleCreateStandard = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        `http://localhost:5254/api/FetalGrowthStandard`,
        values,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSnackbar({
          open: true,
          message: "Fetal growth standard created successfully!",
          severity: "success",
        });
        setOpenDialog(false);
        resetForm();
        await fetchStandards(); // Fetch the updated list after creating
      }
    } catch (error) {
      console.error("Error creating fetal growth standard:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to create fetal growth standard.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle updating a fetal growth standard
  const handleUpdateStandard = async (values, { setSubmitting }) => {
    try {
      const response = await axios.put(
        `http://localhost:5254/api/FetalGrowthStandard/${values.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSnackbar({
          open: true,
          message: "Fetal growth standard updated successfully!",
          severity: "success",
        });
        setOpenDialog(false);
        setEditStandard(null);
        await fetchStandards(); // Fetch the updated list after updating
      }
    } catch (error) {
      console.error("Error updating fetal growth standard:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to update fetal growth standard.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle deleting a fetal growth standard
  const handleDeleteStandard = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5254/api/FetalGrowthStandard/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setSnackbar({
          open: true,
          message: "Fetal growth standard deleted successfully!",
          severity: "success",
        });
        await fetchStandards(); // Fetch the updated list after deleting
      }
    } catch (error) {
      console.error("Error deleting fetal growth standard:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to delete fetal growth standard.",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenDialog = (standard = null) => {
    setEditStandard(standard);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditStandard(null);
  };

  // Validation schema for the form
  const validationSchema = Yup.object({
    weekNumber: Yup.number()
      .required("Week number is required")
      .min(1, "Week number must be at least 1")
      .max(40, "Week number cannot exceed 40"),
    weightGrams: Yup.number()
      .required("Weight is required")
      .min(0, "Weight must be a positive number"),
    heightCm: Yup.number()
      .required("Height is required")
      .min(0, "Height must be a positive number"),
    headCircumferenceCm: Yup.number()
      .required("Head circumference is required")
      .min(0, "Head circumference must be a positive number"),
    abdominalCircumferenceCm: Yup.number()
      .required("Abdominal circumference is required")
      .min(0, "Abdominal circumference must be a positive number"),
  });

  return (
    <Box
      sx={{
        backgroundColor: "#fce4ec",
        minHeight: "100vh",
        display: "flex",
        padding: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          sx={{
            borderRadius: "12px",
            padding: 3,
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#f06292",
                textAlign: "center",
                borderBottom: "2px solid #f8bbd0",
                paddingBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              Manage Fetal Growth Standards
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={commonStyles.button}
              onClick={() => handleOpenDialog()}
            >
              Add Standard
            </Button>
          </Box>

          <TableContainer sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={commonStyles.tableHeader}>ID</TableCell>
                  <TableCell sx={commonStyles.tableHeader}>
                    Week Number
                  </TableCell>
                  <TableCell sx={commonStyles.tableHeader}>
                    Weight (grams)
                  </TableCell>
                  <TableCell sx={commonStyles.tableHeader}>
                    Height (cm)
                  </TableCell>
                  <TableCell sx={commonStyles.tableHeader}>
                    Biparietal Diameter (cm)
                  </TableCell>
                  <TableCell sx={commonStyles.tableHeader}>
                    Femoral Length (cm)
                  </TableCell>
                  <TableCell sx={commonStyles.tableHeader}>
                    Head Circumference (cm)
                  </TableCell>
                  <TableCell sx={commonStyles.tableHeader}>
                    Abdominal Circumference (cm)
                  </TableCell>
                  <TableCell sx={commonStyles.tableHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {standards.length > 0 ? (
                  standards.map((standard) => (
                    <TableRow key={standard.id} sx={commonStyles.tableRow}>
                      <TableCell>{standard.id}</TableCell>
                      <TableCell>{standard.weekNumber}</TableCell>
                      <TableCell>{standard.weightGrams}</TableCell>
                      <TableCell>{standard.heightCm}</TableCell>
                      <TableCell>{standard.biparietalDiameterCm}</TableCell>
                      <TableCell>{standard.femoralLengthCm}</TableCell>
                      <TableCell>{standard.headCircumferenceCm}</TableCell>
                      <TableCell>{standard.abdominalCircumferenceCm}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(standard)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteStandard(standard.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography>No fetal growth standards found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Dialog for creating/editing fetal growth standards */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editStandard
            ? "Edit Fetal Growth Standard"
            : "Create Fetal Growth Standard"}
        </DialogTitle>
        <Formik
          initialValues={
            editStandard || {
              weekNumber: "",
              weightGrams: "",
              heightCm: "",
              biparietalDiameterCm: "",
              femoralLengthCm: "",
              headCircumferenceCm: "",
              abdominalCircumferenceCm: "",
            }
          }
          validationSchema={validationSchema}
          onSubmit={editStandard ? handleUpdateStandard : handleCreateStandard}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  fullWidth
                  name="weekNumber"
                  label="Week Number"
                  type="number"
                  variant="outlined"
                  margin="dense"
                  sx={commonStyles.textField}
                />
                <ErrorMessage
                  name="weekNumber"
                  component="div"
                  style={{ color: "red" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="weightGrams"
                  label="Weight (grams)"
                  type="number"
                  variant="outlined"
                  margin="dense"
                  sx={commonStyles.textField}
                />
                <ErrorMessage
                  name="weightGrams"
                  component="div"
                  style={{ color: "red" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="heightCm"
                  label="Height (cm)"
                  type="number"
                  variant="outlined"
                  margin="dense"
                  sx={commonStyles.textField}
                />
                <ErrorMessage
                  name="heightCm"
                  component="div"
                  style={{ color: "red" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="biparietalDiameterCm"
                  label="Biparietal Diameter (cm)"
                  type="number"
                  variant="outlined"
                  margin="dense"
                  sx={commonStyles.textField}
                />
                <ErrorMessage
                  name="biparietalDiameterCm"
                  component="div"
                  style={{ color: "red" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="femoralLengthCm"
                  label="Femoral Length (cm)"
                  type="number"
                  variant="outlined"
                  margin="dense"
                  sx={commonStyles.textField}
                />
                <ErrorMessage
                  name="femoralLengthCm"
                  component="div"
                  style={{ color: "red" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="headCircumferenceCm"
                  label="Head Circumference (cm)"
                  type="number"
                  variant="outlined"
                  margin="dense"
                  sx={commonStyles.textField}
                />
                <ErrorMessage
                  name="headCircumferenceCm"
                  component="div"
                  style={{ color: "red" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="abdominalCircumferenceCm"
                  label="Abdominal Circumference (cm)"
                  type="number"
                  variant="outlined"
                  margin="dense"
                  sx={commonStyles.textField}
                />
                <ErrorMessage
                  name="abdominalCircumferenceCm"
                  component="div"
                  style={{ color: "red" }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDialog}
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
                  disabled={isSubmitting}
                  sx={commonStyles.button}
                >
                  {editStandard ? "Update" : "Create"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerFetalStandard;
