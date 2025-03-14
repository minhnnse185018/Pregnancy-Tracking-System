import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
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
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";

const validationSchema = Yup.object().shape({
  serviceName: Yup.string()
    .required("Service Name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "Service Name can only contain letters and spaces"
    )
    .min(3, "Service Name must be at least 3 characters long")
    .max(50, "Service Name must be less than 50 characters"),

  serviceDescription: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description must be less than 500 characters"),

  servicePrice: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .max(10000, "Price must be less than 10000 USD")
    .typeError("Price must be a valid number in USD"),

  maxTime: Yup.number()
    .required("Max Time is required")
    .positive("Max Time must be a positive number")
    .integer("Max Time must be a whole number")
    .min(1, "Max Time must be at least 1 hour")
    .max(8, "Max Time must be less than or equal to 8 hours")
    .typeError("Max Time must be a valid number representing hours"),

  category: Yup.string().required("Category is required"),
});

const ManagerServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [category, setCategory] = useState("");
  const [serviceId, setServiceId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  const handleSnackbarOpen = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const resetForm = () => {
    setServiceName("");
    setServiceDescription("");
    setServicePrice("");
    setMaxTime("");
    setCategory("");
    setServiceId(null);
    setSelectedImage(null);
    setCurrentImageUrl("");
    setEditing(false);
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/services/fetchAll"
      );
      const updatedServices = response.data.map((service) => ({
        ...service,
        imageUrl: `http://localhost:8080/services/image/${encodeURIComponent(
          service.imageName
        )}`,
      }));
      setServices(updatedServices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateService = async (values) => {
    setCreating(true);
    try {
      const response = await axios.post("http://localhost:8080/services/add", {
        serviceName: values.serviceName,
        serviceDescription: values.serviceDescription,
        servicePrice: parseFloat(values.servicePrice),
        maxTime: parseInt(values.maxTime),
        category: values.category,
      });

      const newServiceId = response.data.serviceId;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadResponse = await axios.post(
          `http://localhost:8080/services/image/upload/${newServiceId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload response:", uploadResponse);
      }

      setCreating(false);
      fetchServices();
      handleClose();
      handleSnackbarOpen("Service created successfully", "success");
    } catch (error) {
      console.error("Error creating service:", error);
      setCreating(false);
      handleSnackbarOpen("Failed to create service", "error");
    }
  };

  // const handleUpdateService = async (values) => {
  //   try {
  //     if (selectedImage) {
  //       const formData = new FormData();
  //       formData.append("image", selectedImage);

  //       await axios.put(
  //         `http://localhost:8080/services/image/upload/${serviceId}`,
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //     }

  //     fetchServices();
  //     handleClose();
  //     handleSnackbarOpen("Service updated successfully", "success");
  //   } catch (error) {
  //     console.error("Error updating service:", error);
  //     handleSnackbarOpen("Failed to update service", "error");
  //   }
  // };
  const handleUpdateService = async (values) => {
    try {
      // Cập nhật thông tin dịch vụ trước, sử dụng `values`
      await axios.put(`http://localhost:8080/services/${serviceId}`, {
        serviceName: values.serviceName,
        serviceDescription: values.serviceDescription,
        servicePrice: parseFloat(values.servicePrice),
        maxTime: parseInt(values.maxTime),
        category: values.category,
      });

      // Nếu có hình ảnh mới, tải lên hình ảnh
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        await axios.post(
          `http://localhost:8080/services/image/upload/${serviceId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // Hiển thị thông báo thành công và làm mới danh sách
      fetchServices();
      handleClose();
      handleSnackbarOpen("Service updated successfully", "success");
    } catch (error) {
      console.error("Error updating service:", error);
      handleSnackbarOpen("Failed to update service", "error");
    }
  };

  const handleEditService = (service) => {
    setServiceId(service.serviceId);
    setServiceName(service.serviceName);
    setServiceDescription(service.serviceDescription);
    setServicePrice(service.servicePrice);
    setMaxTime(service.maxTime);
    setCategory(service.category);
    setCurrentImageUrl(service.imageUrl);
    setEditing(true);
    handleOpen();
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setCurrentImageUrl("");
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
        Services
      </Typography>

      <Button
        variant="contained"
        sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
        onClick={handleOpen}
      >
        Add Service
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: 400,
            margin: "auto",
            marginTop: "10%",
            backgroundColor: "#fff",
            padding: 4,
            maxHeight: "65vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {editing ? "Edit Service" : "Add New Service"}
          </Typography>

          <Formik
            initialValues={{
              serviceName: editing ? serviceName : "",
              serviceDescription: editing ? serviceDescription : "",
              servicePrice: editing ? servicePrice : "",
              maxTime: editing ? maxTime : "",
              category: editing ? category : "",
            }}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values) => {
              if (editing) {
                handleUpdateService(values);
              } else {
                handleCreateService(values);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Service Name"
                  name="serviceName"
                  value={values.serviceName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.serviceName && Boolean(errors.serviceName)}
                  helperText={touched.serviceName && errors.serviceName}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="serviceDescription"
                  value={values.serviceDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.serviceDescription &&
                    Boolean(errors.serviceDescription)
                  }
                  helperText={
                    touched.serviceDescription && errors.serviceDescription
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Price"
                  name="servicePrice"
                  value={values.servicePrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.servicePrice && Boolean(errors.servicePrice)}
                  helperText={touched.servicePrice && errors.servicePrice}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Max Time (minutes)"
                  name="maxTime"
                  value={values.maxTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.maxTime && Boolean(errors.maxTime)}
                  helperText={touched.maxTime && errors.maxTime}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Category"
                    error={touched.category && Boolean(errors.category)}
                  >
                    <MenuItem value="Hair Styling">Hair Styling</MenuItem>
                    <MenuItem value="Hair Coloring">Hair Coloring</MenuItem>
                    <MenuItem value="Hair Treatment">Hair Treatment</MenuItem>
                    <MenuItem value="Spa Skin Treatment">
                      Spa Skin Treatment
                    </MenuItem>
                  </Select>
                  {touched.category && errors.category && (
                    <Typography color="error" variant="body2">
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>

                {currentImageUrl && !selectedImage && (
                  <Box sx={{ mt: 2 }}>
                    <Typography>Current Image:</Typography>
                    <img
                      src={currentImageUrl}
                      alt="Service"
                      style={{ width: "100%", height: "auto", marginTop: 8 }}
                    />
                  </Box>
                )}

                <Typography sx={{ mt: 2 }}>Upload Image:</Typography>
                <input
                  type="file"
                  onChange={handleImageChange}
                  style={{ marginBottom: "16px" }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!isValid}
                  sx={{ mt: 2 }}
                >
                  {editing ? (
                    "Update"
                  ) : creating ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Add"
                  )}
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>

      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "#f5f5f5", mt: 4 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#4CAF50" }}>
                <TableCell sx={{ color: "#fff" }}>ID</TableCell>
                <TableCell sx={{ color: "#fff" }}>Image</TableCell>
                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Description</TableCell>
                <TableCell sx={{ color: "#fff" }}>Category</TableCell>
                <TableCell sx={{ color: "#fff" }}>Price</TableCell>
                <TableCell sx={{ color: "#fff" }}>Max Time</TableCell>
                <TableCell sx={{ color: "#fff" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.serviceId}>
                  <TableCell>{service.serviceId}</TableCell>
                  <TableCell>
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.serviceName}
                        style={{ width: "100px", height: "100px" }}
                      />
                    ) : (
                      "Loading..."
                    )}
                  </TableCell>
                  <TableCell>{service.serviceName}</TableCell>
                  <TableCell>{service.serviceDescription}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.servicePrice}</TableCell>
                  <TableCell>{service.maxTime} Hours</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ backgroundColor: "#4CAF50" }}
                      onClick={() => handleEditService(service)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1200}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerServices;
// XONG
