// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Modal,
//   TextField,
//   FormControl,
//   Select,
//   MenuItem,
//   Stack,
//   InputLabel,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material";

// const AdminSalon = () => {
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [salonList, setSalonList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentImageUrl, setCurrentImageUrl] = useState(""); // URL của ảnh hiện tại
//   const [formData, setFormData] = useState({
//     salonId: "",
//     salonName: "",
//     salonAddress: "",
//     salonStatus: "true",
//   });
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   useEffect(() => {
//     fetchSalonData();
//   }, []);
//   const validationSchema = Yup.object().shape({
//     salonName: Yup.string()
//       .required("Salon name is required")
//       .max(50, "Salon name must be less than 50 characters"),
//     salonAddress: Yup.string()
//       .required("Address is required")
//       .max(70, "Address must be less than 100 characters"),
//     salonStatus: Yup.string()
//       .oneOf(["true", "false"], "Status must be either Active or Inactive")
//       .required("Status is required"),
//   });
//   const fetchSalonData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:8080/salon/salons");
//       const updatedSalons = response.data.map((salon) => ({
//         ...salon,
//         imageUrl: `http://localhost:8080/salon/image/${encodeURIComponent(
//           salon.imageName
//         )}`,
//       }));
//       setSalonList(updatedSalons);
//     } catch (err) {
//       setError("Error fetching salon data");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };
//   const handleOpenAddModal = () => {
//     setFormData({
//       salonId: "",
//       salonName: "",
//       salonAddress: "",
//       salonStatus: "true",
//     });
//     setSelectedImage(null);
//     setCurrentImageUrl("");
//     setOpenAddModal(true);
//   };

//   const handleOpenEditModal = (salon) => {
//     setFormData({
//       salonId: salon.id,
//       salonName: salon.name,
//       salonAddress: salon.address,
//       salonStatus: salon.active ? "true" : "false",
//     });
//     setSelectedImage(null);
//     setCurrentImageUrl(salon.imageUrl);
//     setOpenEditModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenAddModal(false);
//     setOpenEditModal(false);
//     setSelectedImage(null);
//     setCurrentImageUrl("");
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     setSelectedImage(e.target.files[0]);
//     setCurrentImageUrl("");
//   };
//   // CHỈNH SỬA 7/11/2024
//   const handleSubmit = async (values) => {
//     try {
//       if (values.salonId) {
//         // Cập nhật thông tin salon
//         await axios.put(
//           `http://localhost:8080/salon/update/${values.salonId}`,
//           {
//             salonName: values.salonName,
//             salonAddress: values.salonAddress,
//             salonStatus: values.salonStatus === "true",
//           }
//         );

//         // Upload ảnh nếu có ảnh mới
//         if (selectedImage) {
//           const formDataUpload = new FormData();
//           formDataUpload.append("image", selectedImage);
//           console.log(values.salonId);
//           const uploadResponse = await axios.post(
//             `http://localhost:8080/salon/image/upload/${values.salonId}`,
//             formDataUpload,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           console.log(uploadResponse);
//         }
//         setSnackbarMessage("Salon updated successfully!");
//       } else {
//         // Thêm salon mới
//         const createResponse = await axios.post(
//           "http://localhost:8080/salon/create",
//           {
//             salonName: values.salonName,
//             salonAddress: values.salonAddress,
//             salonStatus: values.salonStatus === "true",
//           }
//         );

//         // Upload ảnh nếu có
//         if (selectedImage) {
//           const formDataUpload = new FormData();
//           formDataUpload.append("image", selectedImage);

//           await axios.post(
//             `http://localhost:8080/salon/image/upload/${createResponse.data.salonId}`,
//             formDataUpload,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//         }
//         setSnackbarMessage("Salon added successfully!");
//       }

//       fetchSalonData();
//       setSnackbarOpen(true);
//       handleCloseModal();
//     } catch (err) {
//       console.error("Error saving salon:", err);
//       setError("Failed to save salon.");
//       setSnackbarMessage("Failed to save salon.");
//       setSnackbarOpen(true);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         padding: 4,
//         backgroundColor: "#fff",
//         minHeight: "100vh",
//         color: "#333",
//       }}
//     >
//       <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
//         Salon Management
//       </Typography>

//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ backgroundColor: "#4CAF50" }}
//           onClick={handleOpenAddModal}
//         >
//           Add Salon
//         </Button>
//       </Box>
//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <Paper
//               sx={{
//                 padding: 2,
//                 backgroundColor: "#f5f5f5",
//                 borderRadius: "8px",
//               }}
//             >
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow
//                       sx={{ backgroundColor: "#4caf50", color: "#fff" }}
//                     >
//                       <TableCell sx={{ color: "#fff" }}>No</TableCell>
//                       <TableCell sx={{ color: "#fff" }}>Salon Name</TableCell>
//                       <TableCell sx={{ color: "#fff" }}>Address</TableCell>
//                       <TableCell sx={{ color: "#fff" }}>Status</TableCell>
//                       <TableCell sx={{ color: "#fff" }}>Image</TableCell>
//                       <TableCell sx={{ color: "#fff" }}>Action</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {salonList.length > 0 ? (
//                       salonList.map((salon, index) => (
//                         <TableRow key={salon.id}>
//                           <TableCell>{index + 1}</TableCell>
//                           <TableCell>{salon.name}</TableCell>
//                           <TableCell>{salon.address}</TableCell>
//                           <TableCell
//                             sx={{ color: salon.active ? "#4CAF50" : "#F44336" }}
//                           >
//                             {salon.active ? "Active" : "Inactive"}
//                           </TableCell>
//                           <TableCell>
//                             {salon.imageUrl ? (
//                               <img
//                                 src={salon.imageUrl}
//                                 alt={salon.name}
//                                 style={{ width: "50px", height: "50px" }}
//                               />
//                             ) : (
//                               "No image"
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               sx={{ backgroundColor: "#4CAF50" }}
//                               onClick={() => handleOpenEditModal(salon)}
//                             >
//                               Edit
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={6} align="center">
//                           <Typography variant="body1" color="textSecondary">
//                             No data available
//                           </Typography>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </Grid>
//         </Grid>
//       )}
//       {/* Modal for Add/Edit Salon */}
//       <Modal
//         open={openAddModal || openEditModal}
//         onClose={handleCloseModal}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             borderRadius: 2,
//             boxShadow: 24,
//             p: 4,
//           }}
//         >
//           <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
//             {openEditModal ? "Edit Salon" : "Add New Salon"}
//           </Typography>
//           <Formik
//             initialValues={formData}
//             validationSchema={validationSchema}
//             onSubmit={async (values) => {
//               setFormData(values);
//               handleSubmit(values);
//             }}
//             enableReinitialize
//           >
//             {({ handleSubmit, errors, touched, isValid, dirty }) => (
//               <form onSubmit={handleSubmit}>
//                 <Stack spacing={3}>
//                   <Field
//                     as={TextField}
//                     fullWidth
//                     label="Salon Name"
//                     name="salonName"
//                     helperText={<ErrorMessage name="salonName" />}
//                     error={touched.salonName && Boolean(errors.salonName)}
//                     required
//                   />
//                   <Field
//                     as={TextField}
//                     fullWidth
//                     label="Address"
//                     name="salonAddress"
//                     helperText={<ErrorMessage name="salonAddress" />}
//                     error={touched.salonAddress && Boolean(errors.salonAddress)}
//                     required
//                   />
//                   <FormControl
//                     fullWidth
//                     error={touched.salonStatus && Boolean(errors.salonStatus)}
//                   >
//                     <InputLabel>Status</InputLabel>
//                     <Field as={Select} name="salonStatus">
//                       <MenuItem value="true">Active</MenuItem>
//                       <MenuItem value="false">Inactive</MenuItem>
//                     </Field>
//                     <ErrorMessage name="salonStatus" component="div" />
//                   </FormControl>

//                   {currentImageUrl && !selectedImage && (
//                     <Box sx={{ mt: 2 }}>
//                       <Typography>Current Image:</Typography>
//                       <img
//                         src={currentImageUrl}
//                         alt={formData.salonName}
//                         style={{ width: "100%", height: "auto", marginTop: 8 }}
//                       />
//                     </Box>
//                   )}

//                   <Typography>Upload Image:</Typography>
//                   <input type="file" onChange={handleImageChange} />

//                   <Box
//                     sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
//                   >
//                     <Button
//                       variant="outlined"
//                       onClick={handleCloseModal}
//                       sx={{ color: "#F44336", borderColor: "#F44336" }}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       sx={{ bgcolor: "#4CAF50" }}
//                       disabled={!isValid || !dirty || !selectedImage}
//                     >
//                       {openEditModal ? "Save Changes" : "Add Salon"}
//                     </Button>
//                   </Box>
//                 </Stack>
//               </form>
//             )}
//           </Formik>
//         </Box>
//       </Modal>
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={1500}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity="success"
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default AdminSalon;
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

const AdminSalon = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [salonList, setSalonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // URL của ảnh hiện tại
  const [formData, setFormData] = useState({
    salonId: "",
    salonName: "",
    salonAddress: "",
    salonStatus: "true",
  });
  const [imageChanged, setImageChanged] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchSalonData();
  }, []);
  // const validationSchema = Yup.object().shape({
  //   salonName: Yup.string()
  //     .required("Salon name is required")
  //     .max(50, "Salon name must be less than 50 characters"),
  //   salonAddress: Yup.string()
  //     .required("Address is required")
  //     .max(70, "Address must be less than 100 characters"),
  //   salonStatus: Yup.string()
  //     .oneOf(["true", "false"], "Status must be either Active or Inactive")
  //     .required("Status is required"),
  // });
  const validationSchema = Yup.object().shape({
    salonName: Yup.string()
      .required("Salon name is required")
      .matches(
        /^[A-Za-z0-9\s]+$/,
        "Salon name can only contain letters, numbers, and spaces"
      ) // Allows letters, numbers, and spaces
      .trim("Salon name should not have leading or trailing spaces")
      .max(50, "Salon name must be less than 50 characters"),

    salonAddress: Yup.string()
      .required("Address is required")
      .matches(
        /^[A-Za-z0-9\s,.-]+$/,
        "Address can only contain letters, numbers, spaces, and , . - characters"
      ) // Allows letters, numbers, spaces, and certain special characters
      .trim("Address should not have leading or trailing spaces")
      .max(70, "Address must be less than 70 characters"),

    salonStatus: Yup.string()
      .oneOf(
        ["true", "false"],
        "Status must be either 'true' (Active) or 'false' (Inactive)"
      )
      .required("Status is required"),
  });

  const fetchSalonData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/salon/salons"
        // "http://localhost:8080/salons"
      );
      const updatedSalons = response.data.map((salon) => ({
        ...salon,
        imageUrl: `http://localhost:8080/salon/image/${encodeURIComponent(
          salon.imageName
        )}`,
      }));
      setSalonList(updatedSalons);
    } catch (err) {
      setError("Error fetching salon data");
    } finally {
      setLoading(false);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleOpenAddModal = () => {
    setFormData({
      salonId: "",
      salonName: "",
      salonAddress: "",
      salonStatus: "true",
    });
    setSelectedImage(null);
    setCurrentImageUrl("");
    setOpenAddModal(true);
  };

  const handleOpenEditModal = (salon) => {
    setFormData({
      salonId: salon.id,
      salonName: salon.name,
      salonAddress: salon.address,
      salonStatus: salon.active ? "true" : "false",
    });
    setSelectedImage(null);
    setCurrentImageUrl(salon.imageUrl);
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenAddModal(false);
    setOpenEditModal(false);
    setSelectedImage(null);
    setCurrentImageUrl("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setImageChanged(true);
    setCurrentImageUrl("");
  };
  // CHỈNH SỬA 7/11/2024
  const handleSubmit = async (values) => {
    try {
      if (values.salonId) {
        // Cập nhật thông tin salon
        await axios.put(
          `http://localhost:8080/salon/update/${values.salonId}`,
          {
            salonName: values.salonName,
            salonAddress: values.salonAddress,
            salonStatus: values.salonStatus === "true",
          }
        );

        // Upload ảnh nếu có ảnh mới
        if (selectedImage) {
          const formDataUpload = new FormData();
          formDataUpload.append("image", selectedImage);
          console.log(values.salonId);
          const uploadResponse = await axios.post(
            `http://localhost:8080/salon/image/upload/${values.salonId}`,
            formDataUpload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(uploadResponse);
        }
        setSnackbarMessage("Salon updated successfully!");
      } else {
        // Thêm salon mới
        const createResponse = await axios.post(
          "http://localhost:8080/salon/create",
          // "http://localhost:8080/salons",
          {
            salonName: values.salonName,
            salonAddress: values.salonAddress,
            salonStatus: values.salonStatus === "true",
          }
        );

        // Upload ảnh nếu có
        if (selectedImage) {
          const formDataUpload = new FormData();
          formDataUpload.append("image", selectedImage);

          await axios.post(
            `http://localhost:8080/salon/image/upload/${createResponse.data.salonId}`,
            formDataUpload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }
        setSnackbarMessage("Salon added successfully!");
      }

      fetchSalonData();
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (err) {
      console.error("Error saving salon:", err);
      setError("Failed to save salon.");
      setSnackbarMessage("Failed to save salon.");
      setSnackbarOpen(true);
    }
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
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        BabyCenter Management
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#4CAF50" }}
          onClick={handleOpenAddModal}
        >
          Add Function
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            sx={{ padding: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#4caf50", color: "#fff" }}>
                    <TableCell sx={{ color: "#fff" }}>No</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Function Name</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Address</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Image</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salonList.map((salon, index) => (
                    <TableRow key={salon.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{salon.name}</TableCell>
                      <TableCell>{salon.address}</TableCell>
                      <TableCell
                        sx={{ color: salon.active ? "#4CAF50" : "#F44336" }}
                      >
                        {salon.active ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        {salon.imageUrl ? (
                          <img
                            src={salon.imageUrl}
                            alt={salon.name}
                            style={{ width: "50px", height: "50px" }}
                          />
                        ) : (
                          "No image"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ backgroundColor: "#4CAF50" }}
                          onClick={() => handleOpenEditModal(salon)}
                        >
                          Edit
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

      {/* Modal for Add/Edit Salon */}
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
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            {openEditModal ? "Edit Salon" : "Add New Salon"}
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
                    label="Salon Name"
                    name="salonName"
                    helperText={<ErrorMessage name="salonName" />}
                    error={touched.salonName && Boolean(errors.salonName)}
                    required
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    label="Address"
                    name="salonAddress"
                    helperText={<ErrorMessage name="salonAddress" />}
                    error={touched.salonAddress && Boolean(errors.salonAddress)}
                    required
                  />
                  <FormControl
                    fullWidth
                    error={touched.salonStatus && Boolean(errors.salonStatus)}
                  >
                    <InputLabel>Status</InputLabel>
                    <Field
                      as={Select}
                      name="salonStatus"
                      onChange={(e) =>
                        setFieldValue("salonStatus", e.target.value)
                      }
                    >
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                    </Field>
                    <ErrorMessage name="salonStatus" component="div" />
                  </FormControl>

                  {currentImageUrl && !selectedImage && (
                    <Box sx={{ mt: 2 }}>
                      <Typography>Current Image:</Typography>
                      <img
                        src={currentImageUrl}
                        alt={formData.salonName}
                        style={{ width: "100%", height: "auto", marginTop: 8 }}
                      />
                    </Box>
                  )}

                  <Typography>Upload Image:</Typography>
                  <input type="file" onChange={handleImageChange} />

                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleCloseModal}
                      sx={{ color: "#F44336", borderColor: "#F44336" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ bgcolor: "#4CAF50" }}
                      disabled={!isValid || (!dirty && !imageChanged)}
                    >
                      {openEditModal ? "Save Changes" : "Add Salon"}
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
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSalon;
// XONG
