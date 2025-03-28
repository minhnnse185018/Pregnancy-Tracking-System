import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const ManagerProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "https://via.placeholder.com/150", // Default image
  });
  const [fullUserData, setFullUserData] = useState(null); // Store full user data for update
  const accountID = sessionStorage.getItem("userID");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!accountID) {
        setSnackbarMessage("User ID not found in session storage.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5254/api/Users/GetById/${accountID}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        const fullName =
          `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
          "No Name Available";
        setProfile({
          name: fullName,
          email: data.email || "No Email Available",
          phone: data.phone || "No Phone Available",
          profileImage: data.avatar || "https://via.placeholder.com/150",
        });
        setFullUserData(data); // Store full user data for update
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setSnackbarMessage("Failed to fetch profile data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchProfileData();
  }, [accountID]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
      .required("Name is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone must contain only numbers")
      .required("Phone is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const [firstName, ...lastNameArr] = values.name.split(" ");
      const lastName = lastNameArr.join(" ");

      // Construct the updated data object based on the API's expected structure
      const updatedData = {
        id: parseInt(accountID),
        firstName: firstName || "",
        lastName: lastName || "",
        email: profile.email,
        phone: values.phone,
        avatar: profile.profileImage,
        password: fullUserData?.password || "",
        userType: fullUserData?.userType || "Manager",
        gender: fullUserData?.gender || null,
        dateOfBirth: fullUserData?.dateOfBirth || null,
        status: fullUserData?.status || "active",
        createdAt: fullUserData?.createdAt || new Date().toISOString(),
        resetToken: fullUserData?.resetToken || null,
        resetTokenExpiration: fullUserData?.resetTokenExpiration || null,
      };

      const response = await axios.put(
        `http://localhost:5254/api/Users/Update/${accountID}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setProfile((prev) => ({
          ...prev,
          name: values.name,
          phone: values.phone,
        }));
        setFullUserData((prev) => ({
          ...prev,
          firstName,
          lastName,
          phone: values.phone,
        }));
        setSnackbarMessage("Profile updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbarMessage(
        error.response?.data?.message || "Failed to update profile."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const commonStyles = {
    textField: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "&:hover fieldset": { borderColor: "#f8bbd0" },
        "&.Mui-focused fieldset": { borderColor: "#f8bbd0" },
      },
    },
    button: {
      backgroundColor: "#f8bbd0",
      "&:hover": { backgroundColor: "#f06292" },
      borderRadius: "12px",
      padding: "8px 20px",
      textTransform: "none",
      fontWeight: "bold",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      color: "#333",
    },
    cancelButton: {
      color: "#f44336",
      borderColor: "#f44336",
      borderRadius: "12px",
      "&:hover": { borderColor: "#d32f2f", backgroundColor: "#ffebee" },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fce4ec",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            borderRadius: "12px",
            textAlign: "center",
            padding: 3,
            backgroundColor: "#fff",
            border: "1px solid #f8bbd0",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              fontWeight: "bold",
              color: "#f06292",
              textAlign: "center",
              textTransform: "uppercase",
              borderBottom: "2px solid #f8bbd0",
              paddingBottom: "8px",
            }}
          >
            Manager Profile
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Avatar
              src={profile.profileImage}
              alt="Profile Avatar"
              sx={{ width: 100, height: 100, border: "2px solid #f8bbd0" }}
            />
          </Box>

          {!isEditing ? (
            <>
              <Typography variant="h6" sx={{ mt: 2, color: "#333" }}>
                {profile.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Phone: {profile.phone}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Email: {profile.email}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, ...commonStyles.button }}
                onClick={() => setIsEditing(true)}
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
                      sx={commonStyles.textField}
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
                      sx={commonStyles.textField}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Box>
                  <Box mt={2}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="email"
                      label="Email"
                      variant="outlined"
                      margin="dense"
                      value={profile.email}
                      disabled
                      sx={commonStyles.textField}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ ...commonStyles.button }}
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      sx={commonStyles.cancelButton}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
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

export default ManagerProfilePage;
