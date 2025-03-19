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

const AdminBlog = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [formData, setFormData] = useState({
    blogId: "",
    title: "",
    content: "",
    author: "",
    status: "true",
  });
  const [imageChanged, setImageChanged] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchBlogData();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Blog title is required")
      .matches(
        /^[A-Za-z0-9\s!?-]+$/,
        "Title can only contain letters, numbers, spaces, and !?.- characters"
      )
      .trim("Title should not have leading or trailing spaces")
      .max(100, "Title must be less than 100 characters"),
    content: Yup.string()
      .required("Content is required")
      .min(10, "Content must be at least 10 characters")
      .max(5000, "Content must be less than 5000 characters"),
    author: Yup.string()
      .required("Author is required")
      .matches(/^[A-Za-z\s]+$/, "Author name can only contain letters and spaces")
      .trim("Author should not have leading or trailing spaces")
      .max(50, "Author name must be less than 50 characters"),
    status: Yup.string()
      .oneOf(["true", "false"], "Status must be either 'true' or 'false'")
      .required("Status is required"),
  });

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5254/api/Post/GetAll");
      const updatedBlogs = response.data.map((blog) => ({
        ...blog,
        imageUrl: blog.imageName
          ? `http://localhost:5254/api/Post/image/${encodeURIComponent(
              blog.imageName
            )}`
          : null,
      }));
      setBlogList(updatedBlogs);
    } catch (err) {
      console.error("Fetch error:", err.response ? err.response.data : err.message);
      setError("Error fetching blog data: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenAddModal = () => {
    setFormData({
      blogId: "",
      title: "",
      content: "",
      author: "",
      status: "true",
    });
    setSelectedImage(null);
    setCurrentImageUrl("");
    setOpenAddModal(true);
  };

  const handleOpenEditModal = (blog) => {
    setFormData({
      blogId: blog.id,
      title: blog.title,
      content: blog.content,
      author: blog.author,
      status: blog.active ? "true" : "false",
    });
    setSelectedImage(null);
    setCurrentImageUrl(blog.imageUrl);
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenAddModal(false);
    setOpenEditModal(false);
    setSelectedImage(null);
    setCurrentImageUrl("");
    setImageChanged(false);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setImageChanged(true);
    setCurrentImageUrl("");
  };

  const handleSubmit = async (values) => {
    try {
      if (values.blogId) {
        // Update existing blog
        const updateResponse = await axios.put(
          `http://localhost:5254/api/Post/Update/${values.blogId}`,
          {
            title: values.title,
            content: values.content,
            author: values.author,
            status: values.status === "true",
          }
        );
        console.log("Update response:", updateResponse.data);

        // Upload image if a new one is selected
        if (selectedImage) {
          const formDataUpload = new FormData();
          formDataUpload.append("image", selectedImage);
          const uploadResponse = await axios.post(
            `http://localhost:5254/api/Post/image/upload/${values.blogId}`,
            formDataUpload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Image upload response:", uploadResponse.data);
        }
        setSnackbarMessage("Blog updated successfully!");
      } else {
        // Create new blog
        const createResponse = await axios.post(
          "http://localhost:5254/api/Post",
          {
            title: values.title,
            content: values.content,
            author: values.author,
            status: values.status === "true",
          }
        );
        console.log("Create response:", createResponse.data);

        // Upload image if provided
        if (selectedImage) {
          const formDataUpload = new FormData();
          formDataUpload.append("image", selectedImage);
          const uploadResponse = await axios.post(
            `http://localhost:5254/api/Post/image/upload/${createResponse.data.id}`,
            formDataUpload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Image upload response:", uploadResponse.data);
        }
        setSnackbarMessage("Blog added successfully!");
      }

      fetchBlogData();
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (err) {
      console.error("Submit error:", err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.message || "Failed to save blog due to an unknown error.";
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#fff3e6", // Soft peach background for warmth
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
          color: "#ab47bc", // Light purple for a nurturing feel
          textAlign: "center",
          textTransform: "uppercase",
          borderBottom: "2px solid #ab47bc",
          paddingBottom: "8px",
        }}
      >
        Blog Management for Moms
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f06292", // Pastel pink for buttons
            "&:hover": { backgroundColor: "#ec407a" },
            borderRadius: "20px",
            padding: "8px 20px",
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onClick={handleOpenAddModal}
        >
          Add New Blog
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
              border: "1px solid #e0e0e0",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#66bb6a", color: "#fff" }}> {/* Soft green header */}
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      No
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Title
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Author
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Image
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blogList.map((blog, index) => (
                    <TableRow
                      key={blog.id}
                      sx={{
                        "&:hover": { backgroundColor: "#f8faf8" }, // Light green hover
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{blog.title}</TableCell>
                      <TableCell>{blog.author}</TableCell>
                      <TableCell
                        sx={{
                          color: blog.active ? "#4caf50" : "#f44336",
                          fontWeight: "bold",
                        }}
                      >
                        {blog.active ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        {blog.imageUrl ? (
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "8px",
                              objectFit: "cover",
                              border: "2px solid #f06292",
                            }}
                          />
                        ) : (
                          "No image"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#f06292",
                            "&:hover": { backgroundColor: "#ec407a" },
                            borderRadius: "12px",
                            padding: "4px 12px",
                            textTransform: "none",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={() => handleOpenEditModal(blog)}
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

      {/* Modal for Add/Edit Blog */}
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
            border: "2px solid #ab47bc",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 3,
              color: "#ab47bc",
              fontWeight: "bold",
              textAlign: "center",
              borderBottom: "1px dashed #ab47bc",
              paddingBottom: "8px",
            }}
          >
            {openEditModal ? "Edit Blog" : "Add New Blog"}
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
                    label="Title"
                    name="title"
                    helperText={<ErrorMessage name="title" />}
                    error={touched.title && Boolean(errors.title)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&:hover fieldset": {
                          borderColor: "#f06292",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#f06292",
                        },
                      },
                    }}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    label="Content"
                    name="content"
                    multiline
                    rows={4}
                    helperText={<ErrorMessage name="content" />}
                    error={touched.content && Boolean(errors.content)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&:hover fieldset": {
                          borderColor: "#f06292",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#f06292",
                        },
                      },
                    }}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    label="Author"
                    name="author"
                    helperText={<ErrorMessage name="author" />}
                    error={touched.author && Boolean(errors.author)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&:hover fieldset": {
                          borderColor: "#f06292",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#f06292",
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
                          borderColor: "#f06292",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f06292",
                        },
                      }}
                    >
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                    </Field>
                    <ErrorMessage name="status" component="div" />
                  </FormControl>

                  {currentImageUrl && !selectedImage && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Typography sx={{ color: "#ab47bc" }}>
                        Current Image:
                      </Typography>
                      <img
                        src={currentImageUrl}
                        alt={formData.title}
                        style={{
                          width: "150px",
                          height: "100px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          marginTop: 8,
                          border: "2px solid #f06292",
                        }}
                      />
                    </Box>
                  )}

                  <Typography sx={{ color: "#ab47bc" }}>
                    Upload Image:
                  </Typography>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    style={{ padding: "8px 0" }}
                  />

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
                        backgroundColor: "#f06292",
                        "&:hover": { backgroundColor: "#ec407a" },
                        borderRadius: "12px",
                        padding: "8px 20px",
                        textTransform: "none",
                        fontWeight: "bold",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                      disabled={!isValid || (!dirty && !imageChanged)}
                    >
                      {openEditModal ? "Save Changes" : "Add Blog"}
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
          severity={snackbarMessage.includes("Failed") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminBlog;