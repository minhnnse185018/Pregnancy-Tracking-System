import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

const AdminProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [fullUserData, setFullUserData] = useState(null); // Lưu toàn bộ dữ liệu từ API để sử dụng khi update

  const accountID = sessionStorage.getItem('userID');

  // Lấy dữ liệu profile từ API
  useEffect(() => {
    const fetchProfileData = async () => {
      if (accountID) {
        try {
          const response = await axios.get(
            `http://localhost:5254/api/Users/GetById/${accountID}`
          );
          const data = response.data;
          const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'No Name Available';
          setProfile({
            name: fullName,
            email: data.email || 'No Email Available',
            phone: data.phone || 'No Phone Available',
          });
          setFullUserData(data); // Lưu toàn bộ dữ liệu từ API
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setSnackbarMessage('Failed to fetch profile data.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarMessage('User ID not found in session storage.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchProfileData();
  }, [accountID]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
      .required('Name is required'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Phone must contain only numbers')
      .required('Phone is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const [firstName, ...lastNameArr] = values.name.split(' ');
      const lastName = lastNameArr.join(' ');

      // Tạo dữ liệu để gửi lên API, dựa trên cấu trúc bảng Users
      const updatedData = {
        id: parseInt(accountID), // Id là số nguyên
        email: profile.email, // Email không thay đổi
        password: fullUserData?.password, // Lấy từ dữ liệu gốc (bắt buộc)
        userType: fullUserData?.userType, // Lấy từ dữ liệu gốc (bắt buộc)
        firstName: firstName || '',
        lastName: lastName || '',
        gender: fullUserData?.gender || null,
        dateOfBirth: fullUserData?.dateOfBirth || null,
        phone: values.phone,
        status: fullUserData?.status || 'active', // Lấy từ dữ liệu gốc (bắt buộc)
        createdAt: fullUserData?.createdAt || new Date().toISOString(), // Lấy từ dữ liệu gốc (bắt buộc)
        resetToken: fullUserData?.resetToken || null,
        resetTokenExpiration: fullUserData?.resetTokenExpiration || null,
      };

      // Gọi API để cập nhật thông tin
      const response = await axios.put(
        `http://localhost:5254/api/Users/Update/${accountID}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setProfile((prev) => ({ ...prev, ...values }));
        setFullUserData({ ...fullUserData, ...updatedData });
        setIsEditing(false); // Exit edit mode after saving
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.log('Server response:', error.response.data);
        setSnackbarMessage(
          `Failed to update profile: ${error.response.data.message || 'Bad Request'}`
        );
      } else {
        setSnackbarMessage('Failed to update profile.');
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f7f7f7',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: 4,
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={3}
          sx={{ borderRadius: '8px', textAlign: 'center', padding: 3, mt: -1 }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ mt: 2, fontWeight: 'bold' }}
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
                      style={{ color: 'red' }}
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
                      style={{ color: 'red' }}
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProfilePage;