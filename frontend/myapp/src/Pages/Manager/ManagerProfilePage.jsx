import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Paper,
  Container,
  Snackbar,
  Alert,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const ManagerProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  const accountID = sessionStorage.getItem("userID");
  useEffect(() => {
    const fetchProfileData = async () => {
      if (accountID) {
        try {
          const response = await axios.get(
            `http://localhost:8080/user/profile/${accountID}`
          );
          const { name, email, phone, profileImage } = response.data;
          setProfile({
            name: name || "No Name Available",
            email: email || "No Email Available",
            phone: phone || "No Phone Available",
            profileImage: profileImage || "https://via.placeholder.com/150",
          });
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          `http://localhost:8080/user/image/profile/${accountID}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const imageUrl = response.data.imageUrl;
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: imageUrl,
        }));
        setSnackbarMessage("Profile image uploaded successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error uploading profile image:", error);
        setSnackbarMessage("Failed to upload profile image.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
      .required("Name is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone must contain only numbers")
      .required("Phone is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const accountID = sessionStorage.getItem("userID");
      await axios.put(
        `http://localhost:8080/user/update-profile/${accountID}`,
        values
      );
      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setProfile((prev) => ({ ...prev, ...values }));
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbarMessage("Failed to update profile.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: 4,
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Paper
          elevation={3}
          sx={{ borderRadius: "8px", textAlign: "center", padding: 3, mt: -1 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Avatar
              src={profile.profileImage}
              alt="Profile Image"
              sx={{ width: 150, height: 150, border: "4px solid white" }}
            />
            <IconButton
              color="primary"
              component="label"
              aria-label="edit profile image"
            >
              <EditIcon />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfileUpload}
              />
            </IconButton>
          </Box>

          <Typography
            variant="h5"
            component="h2"
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            {profile.name}
          </Typography>

          {!isEditing ? (
            <>
              <Typography variant="body1" color="textSecondary">
                Phone: {profile.phone}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Email: {profile.email}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleEditToggle}
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <Formik
              initialValues={{ name: profile.name, phone: profile.phone }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <Box mt={2}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="name"
                      label="Name"
                      variant="outlined"
                      margin="dense"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Box>
                  <Box mt={2}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="phone"
                      label="Phone"
                      variant="outlined"
                      margin="dense"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Box>
                  <Box mt={2}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      variant="outlined"
                      margin="dense"
                      value={profile.email}
                      disabled
                    />
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 2, ml: 2 }}
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Paper>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

export default ManagerProfilePage;
