import EditIcon from "@mui/icons-material/Edit";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    specialty: "",
    gender: "", // Thêm trường gender
    dateOfBirth: "", // Thêm trường dateOfBirth
  });
  const accountID = sessionStorage.getItem("userID");

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (accountID) {
        try {
          const response = await axios.get(
            `http://localhost:5254/api/users/getById/${accountID}`
          );
          const { firstName, lastName, email, phone, specialty, gender, dateOfBirth } = response.data;
          const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "No Name Available";
          setProfile({
            name: fullName,
            email: email || "No Email Available",
            phone: phone || "No Phone Available",
            profileImage: "https://via.placeholder.com/150",
            specialty: specialty || "No Specialty Available",
            gender: gender || "Not Specified",
            dateOfBirth: dateOfBirth || "Not Specified",
          });
        } catch (error) {
          console.error("Error fetching profile data:", error);
          setSnackbarMessage("Failed to fetch profile data.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }
    };

    fetchProfileData();
  }, [accountID]);

  // Handle profile image upload
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

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
      .required("Name is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone must contain only numbers")
      .required("Phone is required"),
    specialty: Yup.string().required("Specialty is required"),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.string().required("Date of Birth is required"),
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      // Tách name thành firstName và lastName
      const nameParts = values.name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      // Chuẩn bị dữ liệu theo định dạng API yêu cầu
      const updatedData = {
        id: accountID,
        firstName,
        lastName,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        image: profile.profileImage || "", // Nếu không có ảnh mới, gửi chuỗi rỗng
        phone: values.phone,
      };

      // Gửi request PUT
      const response = await axios.put(
        `http://localhost:5254/api/users/updateInfo`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json-patch+json",
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("Profile updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setProfile((prev) => ({ ...prev, ...values }));
        setIsEditing(false);
      }
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

  // Styles
  const pageStyle = {
    backgroundColor: "#FFF5EE",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
  };

  const containerStyle = {
    position: "relative",
    zIndex: 2,
    maxWidth: "600px",
    width: "100%",
  };

  const paperStyle = {
    borderRadius: "8px",
    textAlign: "center",
    padding: "24px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  const avatarContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "16px",
  };

  const avatarStyle = {
    width: "150px",
    height: "150px",
    border: "4px solid #fff",
  };

  const titleStyle = {
    marginTop: "16px",
    fontWeight: "bold",
    color: "#D2691E",
  };

  const textStyle = {
    color: "#333",
    marginTop: "8px",
  };

  const buttonStyle = {
    marginTop: "16px",
    backgroundColor: "#D2691E",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#b35717",
    },
  };

  const cancelButtonStyle = {
    marginTop: "16px",
    marginLeft: "16px",
    color: "#F44336",
    borderColor: "#F44336",
  };

  const formFieldStyle = {
    marginTop: "16px",
  };

  const errorStyle = {
    color: "red",
    fontSize: "12px",
    marginTop: "4px",
  };

  return (
    <Box sx={pageStyle}>
      <Container sx={containerStyle}>
        <Paper sx={paperStyle}>
          <Box sx={avatarContainerStyle}>
            <Avatar src={profile.profileImage} alt="Profile Image" sx={avatarStyle} />
            <IconButton color="primary" component="label" aria-label="edit profile image">
              <EditIcon />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfileUpload}
              />
            </IconButton>
          </Box>

          <Typography variant="h5" component="h2" sx={titleStyle}>
            {profile.name}
          </Typography>

          {!isEditing ? (
            <>
              <Typography variant="body1" sx={textStyle}>
                Specialty: {profile.specialty}
              </Typography>
              <Typography variant="body1" sx={textStyle}>
                Gender: {profile.gender}
              </Typography>
              <Typography variant="body1" sx={textStyle}>
                Date of Birth: {profile.dateOfBirth}
              </Typography>
              <Typography variant="body1" sx={textStyle}>
                Phone: {profile.phone}
              </Typography>
              <Typography variant="body1" sx={textStyle}>
                Email: {profile.email}
              </Typography>
              <Button
                variant="contained"
                sx={buttonStyle}
                onClick={handleEditToggle}
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <Formik
              initialValues={{
                name: profile.name,
                phone: profile.phone,
                specialty: profile.specialty,
                gender: profile.gender,
                dateOfBirth: profile.dateOfBirth,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <Box sx={formFieldStyle}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="name"
                      label="Name"
                      variant="outlined"
                      margin="dense"
                    />
                    <ErrorMessage name="name" component="div" style={errorStyle} />
                  </Box>
                  <Box sx={formFieldStyle}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="phone"
                      label="Phone"
                      variant="outlined"
                      margin="dense"
                    />
                    <ErrorMessage name="phone" component="div" style={errorStyle} />
                  </Box>
                  <Box sx={formFieldStyle}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="specialty"
                      label="Specialty"
                      variant="outlined"
                      margin="dense"
                    />
                    <ErrorMessage name="specialty" component="div" style={errorStyle} />
                  </Box>
                  <Box sx={formFieldStyle}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="gender"
                      label="Gender"
                      variant="outlined"
                      margin="dense"
                    />
                    <ErrorMessage name="gender" component="div" style={errorStyle} />
                  </Box>
                  <Box sx={formFieldStyle}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="dateOfBirth"
                      label="Date of Birth (YYYY-MM-DD)"
                      variant="outlined"
                      margin="dense"
                    />
                    <ErrorMessage name="dateOfBirth" component="div" style={errorStyle} />
                  </Box>
                  <Box sx={formFieldStyle}>
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
                    sx={buttonStyle}
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    sx={cancelButtonStyle}
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

export default DoctorProfile;