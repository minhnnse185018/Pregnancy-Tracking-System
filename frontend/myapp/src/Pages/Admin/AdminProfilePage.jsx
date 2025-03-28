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

const AdminProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "https://via.placeholder.com/150",
  });
  const accountID = sessionStorage.getItem("userID");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!accountID) {
        setSnackbar({
          open: true,
          message: "User ID not found. Please log in.",
          severity: "error",
        });
        return;
      }
      try {
        const { data } = await axios.get(
          `http://localhost:5254/api/Users/GetById/${accountID}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        const fullName =
          `${data.firstName || ""} ${data.lastName || ""}`.trim() || "No Name";
        setProfile({
          name: fullName,
          email: data.email || "No Email",
          phone: data.phone || "No Phone",
          avatar: data.avatar || "https://via.placeholder.com/150",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch profile data.",
          severity: "error",
        });
      }
    };
    fetchProfileData();
  }, [accountID]);

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

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
      const updatedData = {
        id: parseInt(accountID),
        firstName: firstName || "",
        lastName: lastName || "",
        email: profile.email,
        phone: values.phone,
        avatar: profile.avatar,
      };

      const { status } = await axios.put(
        `http://localhost:5254/api/Users/Update/${accountID}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (status === 200) {
        setProfile((prev) => ({
          ...prev,
          name: values.name,
          phone: values.phone,
        }));
        setSnackbar({
          open: true,
          message: "Profile updated successfully!",
          severity: "success",
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile.",
        severity: "error",
      });
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
        padding: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            borderRadius: "12px",
            textAlign: "center",
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
              borderBottom: "2px solid #f8bbd0",
            }}
          >
            Admin Profile
          </Typography>

          <Avatar
            src={profile.avatar}
            alt="Profile Avatar"
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mt: 2,
              border: "2px solid #f8bbd0",
            }}
          />

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
            >
              {({ isSubmitting }) => (
                <Form>
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
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    disabled
                    variant="outlined"
                    margin="dense"
                    sx={commonStyles.textField}
                  />
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
                      sx={commonStyles.button}
                      disabled={isSubmitting}
                    >
                      Save
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

export default AdminProfilePage;
