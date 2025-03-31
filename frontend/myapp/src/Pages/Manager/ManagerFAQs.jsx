import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const ManagerFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Danh sách danh mục FAQ (giả định)
  const categories = ["General", "Pregnancy", "Health", "Nutrition"];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCurrentFAQ(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const FAQSchema = Yup.object().shape({
    question: Yup.string()
      .required("Please enter a question.")
      .min(5, "Question must be at least 5 characters long.")
      .max(200, "Question must be less than 200 characters."),
    category: Yup.string().required("Please select a category."),
    answer: Yup.string()
      .required("Please enter an answer.")
      .min(10, "Answer must be at least 10 characters long.")
      .max(1000, "Answer must be less than 1000 characters."),
    displayOrder: Yup.number()
      .required("Please enter a display order.")
      .min(0, "Display order must be a positive number."),
  });

  // Lấy danh sách FAQ
  const fetchFAQs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5254/api/FAQ/GetAllFAQs"
      );
      const sortedFAQs = response.data.sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
      setFaqs(sortedFAQs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      showSnackbar("Failed to fetch FAQs.", "error");
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Tìm kiếm FAQ
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = async () => {
    try {
      if (searchKeyword.trim()) {
        const response = await axios.get(
          `http://localhost:5254/api/FAQ/GetFAQsByCategory/${searchKeyword}`
        );
        setFaqs(response.data);
      } else {
        fetchFAQs();
      }
    } catch (error) {
      console.error("Error searching FAQs:", error);
      showSnackbar("Failed to search FAQs.", "error");
    }
  };

  // Lưu FAQ (Thêm hoặc Cập nhật)
  const handleSaveFAQ = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const { question, category, answer, displayOrder } = values;

    try {
      if (currentFAQ) {
        const faqId = parseInt(currentFAQ.id, 10);
        await axios.put(`http://localhost:5254/api/FAQ/UpdateFAQ/${faqId}`, {
          question,
          category,
          answer,
          displayOrder,
        });
        showSnackbar("FAQ updated successfully!", "success");
      } else {
        await axios.post("http://localhost:5254/api/FAQ/CreateFAQ", {
          question,
          category,
          answer,
          displayOrder,
        });
        showSnackbar("FAQ created successfully!", "success");
      }
      fetchFAQs();
      handleClose();
    } catch (error) {
      console.error("Error saving FAQ:", error.response?.data || error.message);
      if (error.response?.status === 400) {
        showSnackbar("Invalid request. Please check the data.", "error");
      } else if (error.response?.status === 404) {
        showSnackbar("FAQ not found.", "error");
      } else {
        showSnackbar("Failed to save FAQ. Check console for details.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Chỉnh sửa FAQ
  const handleEditFAQ = (faq) => {
    setCurrentFAQ(faq);
    setOpen(true);
  };

  // Xóa FAQ
  const openDeleteModal = (faq) => {
    setFaqToDelete(faq);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setFaqToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteFAQ = async () => {
    if (!faqToDelete) return;

    try {
      const faqId = parseInt(faqToDelete.id, 10);
      await axios.delete(`http://localhost:5254/api/FAQ/DeleteFAQ/${faqId}`);
      fetchFAQs();
      closeDeleteModal();
      showSnackbar("FAQ deleted successfully!", "success");
    } catch (error) {
      console.error(
        "Error deleting FAQ:",
        error.response?.data || error.message
      );
      showSnackbar("Failed to delete FAQ.", "error");
    }
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const commonStyles = {
    button: {
      backgroundColor: "#f8bbd0",
      "&:hover": { backgroundColor: "#f06292" },
      borderRadius: "12px",
      padding: "8px 20px",
      textTransform: "none",
      fontWeight: "bold",
      color: "#fff",
    },
    card: {
      height: 250,
      position: "relative",
      overflow: "hidden",
      borderRadius: "12px",
      boxShadow: 2,
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: 5,
        cursor: "pointer",
        backgroundColor: "#ffebee", // Hover effect similar to table row
      },
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 2,
      backgroundColor: "#fce4ec", // Match table row background
      height: "100%",
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "transparent", // Let global gradient show through
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
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              fontWeight: "bold",
              color: "#f06292",
              textAlign: "center",
              borderBottom: "2px solid #f8bbd0",
              paddingBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            Manage FAQs
          </Typography>

          <Button
            variant="contained"
            sx={{
              ...commonStyles.button,
              mt: 2,
              mb: 2,
            }}
            onClick={handleOpen}
          >
            Add FAQ
          </Button>

          <TextField
            fullWidth
            label="Search FAQs by Question or Category"
            variant="outlined"
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: "#f8bbd0",
                },
                "&:hover fieldset": {
                  borderColor: "#f06292",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f06292",
                },
              },
            }}
          />

          <Grid container spacing={2} sx={{ mt: 3 }}>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <Grid item xs={12} md={4} key={faq.id}>
                  <Card sx={commonStyles.card}>
                    <CardContent sx={commonStyles.cardContent}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#f06292", // Match title color
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {faq.question}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          mb: 1,
                        }}
                      >
                        {faq.answer}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Category: {faq.category}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Display Order: {faq.displayOrder}
                      </Typography>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            ...commonStyles.button,
                            fontSize: "0.75rem",
                            padding: "4px 10px",
                          }}
                          onClick={() => handleEditFAQ(faq)}
                        >
                          Edit
                        </Button>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteModal(faq)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography textAlign="center">No FAQs found.</Typography>
              </Grid>
            )}
          </Grid>

          {/* Modal Thêm/Chỉnh sửa FAQ */}
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "#fce4ec", // Match background color
                boxShadow: 24,
                p: 4,
                borderRadius: "12px", // Match rounded corners
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: "#f06292",
                  textAlign: "center",
                }}
              >
                {currentFAQ ? "Edit FAQ" : "Add New FAQ"}
              </Typography>
              <Formik
                initialValues={{
                  question: currentFAQ?.question || "",
                  category: currentFAQ?.category || "",
                  answer: currentFAQ?.answer || "",
                  displayOrder: currentFAQ?.displayOrder || 0,
                }}
                validationSchema={FAQSchema}
                onSubmit={handleSaveFAQ}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    <Field
                      as={TextField}
                      fullWidth
                      name="question"
                      label="Question"
                      variant="outlined"
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "& fieldset": {
                            borderColor: "#f8bbd0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#f06292",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#f06292",
                          },
                        },
                      }}
                    />
                    <ErrorMessage
                      name="question"
                      component="div"
                      style={{ color: "red", fontSize: "0.875rem" }}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: "#f06292" }}>
                        Category
                      </InputLabel>
                      <Field
                        as={Select}
                        name="category"
                        label="Category"
                        onChange={(e) =>
                          setFieldValue("category", e.target.value)
                        }
                        sx={{
                          borderRadius: "12px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#f8bbd0",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#f06292",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#f06292",
                          },
                        }}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category"
                        component="div"
                        style={{ color: "red", fontSize: "0.875rem" }}
                      />
                    </FormControl>

                    <Field
                      as={TextField}
                      fullWidth
                      name="answer"
                      label="Answer"
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "& fieldset": {
                            borderColor: "#f8bbd0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#f06292",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#f06292",
                          },
                        },
                      }}
                    />
                    <ErrorMessage
                      name="answer"
                      component="div"
                      style={{ color: "red", fontSize: "0.875rem" }}
                    />

                    <Field
                      as={TextField}
                      fullWidth
                      name="displayOrder"
                      label="Display Order"
                      type="number"
                      variant="outlined"
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "& fieldset": {
                            borderColor: "#f8bbd0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#f06292",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#f06292",
                          },
                        },
                      }}
                    />
                    <ErrorMessage
                      name="displayOrder"
                      component="div"
                      style={{ color: "red", fontSize: "0.875rem" }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        ...commonStyles.button,
                        mt: 2,
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
          </Modal>

          {/* Dialog Xác nhận Xóa */}
          <Dialog open={deleteModalOpen} onClose={closeDeleteModal}>
            <DialogTitle sx={{ color: "#f06292", textAlign: "center" }}>
              Confirm Delete
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ color: "#333" }}>
                Are you sure you want to delete this FAQ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={closeDeleteModal}
                sx={{
                  ...commonStyles.button,
                  backgroundColor: "#e0dede",
                  color: "#333",
                  "&:hover": { backgroundColor: "#d0caca" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteFAQ}
                sx={{
                  ...commonStyles.button,
                  backgroundColor: "#ff6f7a",
                  "&:hover": { backgroundColor: "#ff4f5a" },
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar Thông báo */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
};

export default ManagerFAQs;
