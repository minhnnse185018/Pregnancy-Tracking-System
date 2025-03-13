import CloseIcon from "@mui/icons-material/Close";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const ManagerBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const accountID = sessionStorage.getItem("userID"); // Fetch userID from sessionStorage
  const [newBlog, setNewBlog] = useState({
    userId: accountID || "",
    title: "",
    content: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [creating, setCreating] = useState(false);
  const [likesCount, setLikesCount] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [newComment, setNewComment] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [currentImage, setCurrentImage] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleDetailModalClose = () => setDetailModalOpen(false);

  const openEditModal = (comment) => {
    if (comment.accountId === accountID) {
      setCommentToEdit(comment);
      setEditedComment(comment.content);
    } else {
      showSnackbar("You can only edit your own comments.", "warning");
    }
  };

  const closeEditModal = () => {
    setCommentToEdit(null);
    setEditedComment("");
  };

  const handleEditComment = async () => {
    if (!editedComment.trim()) {
      showSnackbar("Please enter a comment.", "warning");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5254/api/Post/comments/${commentToEdit.commentId}`,
        { content: editedComment }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentToEdit.commentId
            ? { ...comment, content: editedComment }
            : comment
        )
      );
      closeEditModal();
      showSnackbar("Comment edited successfully!", "success");
    } catch (error) {
      console.error("Error editing comment:", error);
      showSnackbar("Failed to edit comment.", "error");
    }
  };

  const openDeleteConfirm = (commentId) => {
    setCommentToDelete(commentId);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setCommentToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      await axios.delete(
        `http://localhost:5254/api/Post/comments/${commentToDelete}`
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.commentId !== commentToDelete)
      );
      closeDeleteConfirm();
      showSnackbar("Comment deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showSnackbar("Failed to delete comment.", "error");
    }
  };

  const BlogSchema = Yup.object().shape({
    title: Yup.string()
      .required("Please enter a title.")
      .min(5, "Title must be at least 5 characters long.")
      .max(100, "Title must be less than 100 characters."),
    content: Yup.string()
      .required("Please enter content.")
      .min(20, "Content must be at least 20 characters long.")
      .max(5000, "Content must be less than 5000 characters."),
    image: Yup.string().notRequired(),
  });

  const resetForm = () => {
    setNewBlog({ userId: accountID || "", title: "", content: "", image: "" });
    setCurrentBlog(null);
    setSelectedImage(null);
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5254/api/Post/GetAll");
      const sortedDate = response.data.sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      );
      console.log("Fetched blogs:", sortedDate);
      setBlogs(sortedDate);
      response.data.forEach((blog) => {
        fetchLikeCount(blog.id);
        fetchCommentCount(blog.id);
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showSnackbar("Failed to fetch blogs.", "error");
    }
  };

  const fetchLikeCount = async (blogId) => {
    try {
      const response = await axios.get(
        `http://localhost:5254/api/Post/like/${blogId}`
      );
      setLikesCount((prev) => ({ ...prev, [blogId]: response.data }));
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  const fetchCommentCount = async (blogId) => {
    try {
      const response = await axios.get(
        `http://localhost:5254/api/Post/comments/count/${blogId}`
      );
      setCommentsCount((prev) => ({ ...prev, [blogId]: response.data }));
    } catch (error) {
      console.error("Error fetching comment count:", error);
    }
  };

  const fetchComments = async (blogId) => {
    try {
      // Thay vì gọi /api/Post/comments/{blogId}, gọi API chi tiết bài viết
      const response = await axios.get(`http://localhost:5254/api/Post/${blogId}`);
      const postData = response.data;
      console.log("Fetched post with comments:", postData);

      // Giả sử comment nằm trong postData.comments
      const sortedComments = (postData.comments || []).sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      );
      setComments(sortedComments);
    } catch (error) {
      console.error("Error fetching comments:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      showSnackbar("Failed to fetch comments. Check console for details.", "error");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSaveBlog = async (values) => {
    setCreating(true);
    const { title, content } = values;

    if (!title || !content) {
      showSnackbar("Please fill in title and content fields.", "error");
      setCreating(false);
      return;
    }

    if (!accountID && !currentBlog) {
      showSnackbar("User not authenticated. Please log in.", "error");
      setCreating(false);
      return;
    }

    try {
      let blogId = null;

      if (currentBlog) {
        const blogIdToUpdate = parseInt(currentBlog.id, 10);
        if (!blogIdToUpdate || blogIdToUpdate <= 0) {
          throw new Error("Invalid blog ID for update. Value received: " + currentBlog.id);
        }

        console.log("Updating blog with ID:", blogIdToUpdate, "Payload:", {
          title,
          content,
          image: selectedImage ? selectedImage.name : currentBlog.image || "",
          status: "Published",
        });
        const response = await axios.put(
          `http://localhost:5254/api/Post/Update/${blogIdToUpdate}`,
          {
            title,
            content,
            image: selectedImage ? selectedImage.name : currentBlog.image || "",
            status: "Published",
          }
        );
        blogId = response.data.id || currentBlog.id;

        if (selectedImage instanceof File) {
          const formData = new FormData();
          formData.append("image", selectedImage);
          await axios.put(
            `http://localhost:5254/api/Post/image/upload/${blogId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }
      } else {
        console.log("Creating new blog with payload:", {
          userId: accountID,
          title,
          content,
          image: selectedImage ? selectedImage.name : "",
        });
        const response = await axios.post("http://localhost:5254/api/Post", {
          userId: accountID,
          title,
          content,
          image: selectedImage ? selectedImage.name : "",
        });
        blogId = response.data;

        if (selectedImage instanceof File) {
          const formData = new FormData();
          formData.append("image", selectedImage);
          await axios.put(
            `http://localhost:5254/api/Post/image/upload/${blogId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }
      }

      fetchBlogs();
      handleClose();
      showSnackbar("Blog saved successfully!", "success");
    } catch (error) {
      console.error("Error saving blog:", error.response?.data || error.message);
      if (error.response?.status === 400) {
        showSnackbar(
          "Invalid request. Please check the data and try again.",
          "error"
        );
      } else if (error.response?.status === 404) {
        showSnackbar("Blog not found. It may have been deleted.", "error");
      } else {
        showSnackbar("Failed to save blog. Check console for details.", "error");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleEditBlog = (blog) => {
    setCurrentBlog(blog);
    setNewBlog({
      userId: blog.userId,
      title: blog.title,
      content: blog.content,
      image: blog.image || "",
    });
    setCurrentImage(
      blog.imageName
        ? `http://localhost:5254/api/Post/image/${blog.imageName}`
        : null
    );
    setSelectedImage(null);
    setOpen(true);
  };

  const handleCardClick = (blog) => {
    setSelectedBlog(blog);
    fetchComments(blog.id);
    setDetailModalOpen(true);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      showSnackbar("Please enter a comment.", "warning");
      return;
    }

    const userId = accountID || "manager";
    if (!userId) {
      showSnackbar("You are not logged in. Please log in first!", "warning");
      return;
    }

    const commentData = {
      postId: parseInt(selectedBlog.id, 10),
      userId: userId,
      content: newComment,
    };

    console.log("Submitting comment with data:", JSON.stringify(commentData, null, 2));

    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      // Thử endpoint /api/Comments (thêm "s" vì /api/Comment không hoạt động)
      const response = await axios.post(
        "http://localhost:5254/api/Comments", // Thay đổi endpoint
        commentData,
        config
      );
      console.log("Comment creation response:", response.data);
      setNewComment("");
      fetchComments(selectedBlog.id);
      showSnackbar("Comment added successfully!", "success");
    } catch (error) {
      console.error("Error adding comment:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        request: error.request,
      });
      if (error.response) {
        switch (error.response.status) {
          case 400:
            showSnackbar("Bad request. Check the comment data or contact support.", "error");
            break;
          case 401:
            showSnackbar("Unauthorized. Please log in and try again.", "error");
            break;
          case 404:
            showSnackbar("Endpoint not found. Please verify the API with the backend team.", "error");
            break;
          default:
            showSnackbar("Failed to add comment. Check console for details.", "error");
        }
      } else if (error.request) {
        showSnackbar("No response from server. Check your network connection.", "error");
      } else {
        showSnackbar("Error setting up the request. See console for details.", "error");
      }
    }
  };

  const openDeleteModal = (blog) => {
    console.log("Blog object for deletion:", blog);
    if (!blog || !blog.id || isNaN(parseInt(blog.id, 10))) {
      showSnackbar("Invalid blog selected for deletion.", "error");
      return;
    }
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setBlogToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      console.log("blogToDelete object:", blogToDelete);
      const blogIdToDelete = parseInt(blogToDelete.id, 10);
      if (!blogIdToDelete || blogIdToDelete <= 0) {
        throw new Error("Invalid blog ID for deletion. Value received: " + blogToDelete.id);
      }

      console.log("Deleting blog with ID:", blogIdToDelete);
      const response = await axios.delete(`http://localhost:5254/api/Post/${blogIdToDelete}`);
      if (response.status === 200) {
        setDeleteModalOpen(false);
        setBlogToDelete(null);
        fetchBlogs();
        showSnackbar("Blog deleted successfully!", "success");
      }
    } catch (error) {
      console.error("Error deleting blog:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        showSnackbar("Blog not found. It may have been deleted.", "error");
      } else if (error.response?.status === 400) {
        showSnackbar("Invalid request. Please check the blog ID and try again.", "error");
      } else {
        showSnackbar("Failed to delete blog. Check console for details.", "error");
      }
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5254/api/Post/search?keyword=${searchKeyword}`
      );
      setBlogs(response.data);
    } catch (error) {
      console.error("Error searching blogs:", error);
      showSnackbar("Failed to search blogs.", "error");
    }
  };

  const filterBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchKeyword.toLowerCase())
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
        Add Blog
      </Button>
      <TextField
        fullWidth
        label="Search By Title"
        variant="outlined"
        value={searchKeyword}
        onChange={handleSearchChange}
        onKeyPress={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2}>
        {filterBlogs.map((blog) => (
          <Grid item xs={12} md={4} key={blog.id}>
            <Card
              sx={{
                height: 350,
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
              onClick={() => handleCardClick(blog)}
            >
              {blog.imageName && (
                <CardMedia
                  component="img"
                  height="190"
                  image={`http://localhost:5254/api/Post/image/${blog.imageName}`}
                  alt={blog.title}
                  sx={{ objectFit: "cover" }}
                />
              )}
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
                  {blog.title}
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
                  {blog.content}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {blog.createDate}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <ThumbUpAltIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {likesCount[blog.id] || 0}
                  </Typography>
                  <CommentIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {commentsCount[blog.id] || 0}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 1.5 }}
                >
                  {blog.managerName}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBlog(blog);
                    }}
                  >
                    Edit
                  </Button>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(blog);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal Chi tiết Blog */}
      <Modal open={detailModalOpen} onClose={handleDetailModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleDetailModalClose}
          >
            <CloseIcon />
          </IconButton>
          {selectedBlog && (
            <>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: "35px",
                  textAlign: "center",
                }}
              >
                {selectedBlog.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: "15px",
                  textAlign: "right",
                }}
              >
                {`${selectedBlog.managerName}, ${selectedBlog.createDate}`}
              </Typography>

              {selectedBlog.imageName && (
                <CardMedia
                  component="img"
                  height="500"
                  image={`http://localhost:5254/api/Post/image/${selectedBlog.imageName}`}
                  alt={selectedBlog.title}
                  sx={{ objectFit: "contain", mb: 2, borderRadius: 2 }}
                />
              )}

              <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                {selectedBlog.content}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" alignItems="center" mt={1}>
                <ThumbUpAltIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {likesCount[selectedBlog.id] || 0}
                </Typography>
                <CommentIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  {commentsCount[selectedBlog.id] || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Comments:
              </Typography>
              <TextField
                fullWidth
                label="Add a comment..."
                variant="outlined"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4CAF50",
                  mb: 2,
                  "&:hover": { backgroundColor: "#388E3C" },
                }}
                onClick={handleCommentSubmit}
              >
                Submit Comment
              </Button>

              <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <ListItem
                      key={comment.id} // Thay commentId thành id để khớp với schema từ backend
                      alignItems="flex-start"
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <ListItemText
                        primary={`${
                          comment.userId === accountID
                            ? "Me"
                            : comment.userName || "Unknown"
                        } (${comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Unknown date"})`}
                        secondary={
                          <Box sx={{ maxHeight: 60, overflowY: "auto" }}>
                            {comment.content}
                          </Box>
                        }
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {comment.userId === accountID && (
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(comment);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirm(comment.id); // Thay commentId thành id
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No comments available.
                  </Typography>
                )}
              </List>

              <Dialog
                open={deleteConfirmOpen}
                onClose={closeDeleteConfirm}
              >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete this comment?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeDeleteConfirm} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteComment} color="error">
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>

              {commentToEdit && commentToEdit.userId === accountID && (
                <Dialog open={Boolean(commentToEdit)} onClose={closeEditModal}>
                  <DialogTitle>Edit Comment</DialogTitle>
                  <DialogContent>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      autoFocus
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={closeEditModal} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleEditComment} color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            </>
          )}
        </Box>
      </Modal>

      <Modal open={open} onClose={handleClose}>
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
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            {currentBlog ? "Edit Blog" : "Add New Blog"}
          </Typography>
          <Formik
            initialValues={{
              title: newBlog.title || "",
              content: newBlog.content || "",
              image: newBlog.image || "",
            }}
            validationSchema={BlogSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              await handleSaveBlog(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, dirty, isValid }) => (
              <Form>
                <Field
                  as={TextField}
                  fullWidth
                  name="title"
                  label="Title"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  style={{ color: "red" }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  name="content"
                  label="Content"
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  style={{ color: "red" }}
                />

                {currentImage && (
                  <img
                    src={currentImage}
                    alt="Current blog"
                    style={{ width: "100%", marginBottom: "1rem" }}
                  />
                )}
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFieldValue("image", file ? file.name : "");
                    setSelectedImage(file);
                  }}
                  placeholder="Optional image"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  style={{ color: "red" }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: "#4CAF50" }}
                  disabled={isSubmitting || (!dirty && !currentBlog) || !isValid}
                >
                  {creating ? <CircularProgress size={24} /> : "Save"}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Dialog open={deleteModalOpen} onClose={closeDeleteModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this blog?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteBlog} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default ManagerBlogs;