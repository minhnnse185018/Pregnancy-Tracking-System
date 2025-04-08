import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [img, setImg] = useState(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    image: "",
    phone: "",
  });
  const [initialUser, setInitialUser] = useState(null);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    image: "",
    phone: "",
  });

  useEffect(() => {
    const userId = sessionStorage.getItem("userID");
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5254/api/Users/GetById/${userId}`
          );
          if (response.status === 200) {
            const {
              firstName,
              lastName,
              email,
              gender,
              dateOfBirth,
              image,
              phone,
            } = response.data;
            const userData = {
              firstName: firstName,
              lastName: lastName,
              email: email,
              gender: gender,
              dateOfBirth: dateOfBirth,
              image: image,
              phone: phone,
            };
            setUser(userData);
            setInitialUser(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    let errorMsg = "";
    if (name === "firstName" || name === "lastName") {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        errorMsg = "Only letters and spaces are allowed.";
      }
    } else if (name === "phone") {
      if (!/^(03|05|07|08|09)\d{8}$/.test(value)) {
        errorMsg = "Please enter a valid phone number.";
      }
    } else if (name === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
        errorMsg = "Please enter a valid Gmail address (example@gmail.com).";
      }
    } else if (name === "gender") {
      const allowedGenders = ["Male", "Female", "Other"];
      if (!allowedGenders.includes(value)) {
        errorMsg = "Gender must be Male, Female, or Other.";
      }
    } else if (name === "dateOfBirth") {
      if (!value) {
        errorMsg = "Date of Birth is required";
      } else {
        const inputDate = new Date(value);
        const today = new Date();
        const minDate = new Date('1954-01-01');

        if (inputDate > today) {
          errorMsg = "Date of Birth cannot be in the future";
        } else if (inputDate < minDate) {
          errorMsg = "Date of Birth cannot be earlier than 1954";
        } else if (isNaN(inputDate.getTime())) {
          errorMsg = "Please enter a valid date";
        }
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImg(file);
    }
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      if (!validateForm()) {
        showToast("Please fix the errors in the form", "error");
        return;
      }
      
      if (JSON.stringify(user) !== JSON.stringify(initialUser)) {
        try {
          const userId = sessionStorage.getItem("userID");
          const updatedUser = {
            id: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            image: user.image,
            phone: user.phone,
            userType: "1",
            status: "active",
          };

          const response = await axios.put(
            `http://localhost:5254/api/Users/Update/${userId}`,
            updatedUser,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            toast.success("Profile updated successfully!");
            setInitialUser(user);
          }
        } catch (error) {
          console.error("Update failed:", error.response?.data || error.message);
          toast.error(
            "Failed to update profile! " + (error.response?.data?.message || "")
          );
        }
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}/${month}/${day}`;
  };
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!user.firstName || user.firstName.trim() === '') {
      newErrors.firstName = 'First Name is required';
    }
    
    if (!user.lastName || user.lastName.trim() === '') {
      newErrors.lastName = 'Last Name is required';
    }
    
    if (!user.email || !user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!user.phone || !user.phone.match(/^\d{10,11}$/)) {
      newErrors.phone = 'Valid phone number is required (10-11 digits)';
    }
    
    if (!user.gender || user.gender.trim() === '') {
      newErrors.gender = 'Gender selection is required';
    }
    
    if (!user.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const showToast = (message, type = "success", icon = "✅") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else if (type === "warning") {
      toast.warning(message);
    } else {
      toast.info(message);
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }
    
    // ... existing save changes code ...
  };

  return (
    <div>
      <ToastContainer autoClose={1300} />
      <div
        style={{
          padding: "30px",
          border: "2px solid #ddd",
          borderRadius: "12px",
          maxWidth: "500px",
          margin: "auto",
          marginTop: "150px",
          marginBottom: "150px",
          background: "linear-gradient(135deg, #fff0f5 0%, #fce4e8 100%)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#FF8989",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          User Profile
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", color: "#FF8989" }}>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              margin: "8px 0",
              borderRadius: "8px",
              border: errors.firstName ? "2px solid red" : "2px solid #ccc",
              backgroundColor: "#fff",
              outline: "none",
            }}
          />
          {errors.firstName && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.firstName}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", color: "#FF8989" }}>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              margin: "8px 0",
              borderRadius: "8px",
              border: errors.lastName ? "2px solid red" : "2px solid #ccc",
              backgroundColor: "#fff",
              outline: "none",
            }}
          />
          {errors.lastName && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.lastName}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", color: "#FF8989" }}>Email:</label>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            disabled
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              margin: "8px 0",
              borderRadius: "8px",
              border: errors.email ? "2px solid red" : "2px solid #ccc",
              backgroundColor: "#fff",
              outline: "none",
            }}
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.email}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", color: "#FF8989" }}>Gender:</label>
          <select
            name="gender"
            value={user.gender}
            onChange={handleInputChange}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              margin: "8px 0",
              borderRadius: "8px",
              border: errors.gender ? "2px solid red" : "2px solid #ccc",
              backgroundColor: "#fff",
              outline: "none",
            }}
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.gender}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", color: "#FF8989" }}>
            Date of Birth: (1954 - Present)
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formatDateForInput(user.dateOfBirth)}
            onChange={handleInputChange}
            disabled={!isEditing}
            min="1954-01-01"
            max={new Date().toISOString().split('T')[0]}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              margin: "8px 0",
              borderRadius: "8px",
              border: errors.dateOfBirth ? "2px solid red" : "2px solid #ccc",
              backgroundColor: "#fff",
              outline: "none",
            }}
          />
          {errors.dateOfBirth && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.dateOfBirth}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", color: "#FF8989" }}>Phone:</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              margin: "8px 0",
              borderRadius: "8px",
              border: errors.phone ? "2px solid red" : "2px solid #ccc",
              backgroundColor: "#fff",
              outline: "none",
            }}
          />
          {errors.phone && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.phone}
            </span>
          )}
        </div>

        <br />
        <button
          onClick={toggleEditMode}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#FF8989",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
            transition: "background-color 0.3s ease",
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;