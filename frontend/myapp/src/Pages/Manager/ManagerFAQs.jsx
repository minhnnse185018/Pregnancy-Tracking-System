import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
      const response = await axios.get("http://localhost:5254/api/FAQ/GetAllFAQs");
      const sortedFAQs = response.data.sort((a, b) => a.displayOrder - b.displayOrder);
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
        // Tìm kiếm theo câu hỏi hoặc danh mục
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
        // Cập nhật FAQ
        const faqId = parseInt(currentFAQ.id, 10);
        await axios.put(`http://localhost:5254/api/FAQ/UpdateFAQ/${faqId}`, {
          question,
          category,
          answer,
          displayOrder,
        });
        showSnackbar("FAQ updated successfully!", "success");
      } else {
        // Thêm FAQ mới
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
      console.error("Error deleting FAQ:", error.response?.data || error.message);
      showSnackbar("Failed to delete FAQ.", "error");
    }
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4, backgroundColor: "#fff", minHeight: "100vh" }}>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#4CAF50",
          mb: 2,
          "&:hover": { backgroundColor: "#388E3C" },
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
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2}>
        {filteredFAQs.map((faq) => (
          <Grid item xs={12} md={4} key={faq.id}>
            <Card
              sx={{
                height: 250,
                position: "relative",
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 2,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 5,
                  cursor: "pointer",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#4CAF50",
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
                    whiteSpace: "nowrap",
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
                      backgroundColor: "#4CAF50",
                      "&:hover": { backgroundColor: "#388E3C" },
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
        ))}
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
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
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
                  sx={{ mb: 2 }}
                />
                <ErrorMessage
                  name="question"
                  component="div"
                  style={{ color: "red" }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Field
                    as={Select}
                    name="category"
                    label="Category"
                    onChange={(e) => setFieldValue("category", e.target.value)}
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
                    style={{ color: "red" }}
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
                  sx={{ mb: 2 }}
                />
                <ErrorMessage
                  name="answer"
                  component="div"
                  style={{ color: "red" }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  name="displayOrder"
                  label="Display Order"
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <ErrorMessage
                  name="displayOrder"
                  component="div"
                  style={{ color: "red" }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: "#4CAF50" }}
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
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this FAQ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteFAQ} color="error" autoFocus>
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
    </Box>
  );
};

export default ManagerFAQs;