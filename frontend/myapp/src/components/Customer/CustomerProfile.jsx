import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validatePhoneNumber = (phoneNumber) => {
  const phonePattern = /^(03|05|07|08|09)\d{8}$/;
  return phonePattern.test(phoneNumber);
};

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    fristName: "",
    lastName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    image: "",
    phone: "",
  });
  const [initialUser, setInitialUser] = useState(null);
  const [errors, setErrors] = useState({
    fristName: "",
    lastName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    image: "",
    phone: "",
  });

  //Get user by ID
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
  //handle input from user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value, // Dynamically updating the field being edited
    }));

    // Validation
    let errorMsg = "";

    // First Name & Last Name: Only letters and spaces allowed
    if (name === "firstName" || name === "lastName") {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        errorMsg = "Only letters and spaces are allowed.";
      }
    }
    // Phone Number: Must start with 03, 05, 07, 08, or 09 and contain 10 digits
    else if (name === "phone") {
      if (!/^(03|05|07|08|09)\d{8}$/.test(value)) {
        errorMsg = "Please enter a valid phone number.";
      }
    }
    // Email: Must be a valid Gmail address
    else if (name === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
        errorMsg = "Please enter a valid Gmail address (example@gmail.com).";
      }
    }
    // Gender: Must be 'Male', 'Female', or 'Other'
    else if (name === "gender") {
      const allowedGenders = ["Male", "Female", "Other"];
      if (!allowedGenders.includes(value)) {
        errorMsg = "Gender must be Male, Female, or Other.";
      }
    }
    // Date of Birth: Must be in YYYY-MM-DD format and a valid date
    else if (name === "dateOfBirth") {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(value)) {
        errorMsg = "Date of Birth must be in YYYY-MM-DD format.";
      } else {
        const enteredDate = new Date(value);
        const today = new Date();
        if (enteredDate > today) {
          errorMsg = "Date of Birth cannot be in the future.";
        }
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg, // Assign error message to the respective field
    }));
  };

                            //Edit user profile
  const toggleEditMode = async () => {
    if (isEditing) {
      if (JSON.stringify(user) !== JSON.stringify(initialUser)) {
        try {
          const userId = sessionStorage.getItem("userID");
          const response = await axios.put(
            `http://localhost:5254/api/Users/UpdateInfo`,
            {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,  
              gender: user.gender,
              dateOfBirth: user.dateOfBirth,
              image : user.image,
              phone: user.phone,
            }
          );
          if (response.status === 200) {
            toast.success("Profile updated successfully!");
            setInitialUser(user);
          }
        } catch (error) {
          toast.error("Failed to update profile!");
        }
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  //View user profile
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
          backgroundColor: "#f7f9fc",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          User Profile
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", color: "#555" }}>First Name:</label>
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
              border: errors.fullName ? "2px solid red" : "2px solid #ccc",
              backgroundColor: isEditing ? "#fff" : "#e9ecef",
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
          <label style={{ fontSize: "16px", color: "#555" }}>Last Name:</label>
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
              border: errors.fullName ? "2px solid red" : "2px solid #ccc",
              backgroundColor: isEditing ? "#fff" : "#e9ecef",
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
          <label style={{ fontSize: "16px", color: "#555" }}>Email :</label>
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
              backgroundColor:"#e9ecef",
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
          <label style={{ fontSize: "16px", color: "#555" }}>Gender:</label>
          <input
            type="generic"
            name="Gender"
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
              backgroundColor: isEditing ? "#fff" : "#e9ecef",
              outline: "none",
            }}
          />
          {errors.gender && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.gender}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", color: "#555" }}>
            dateOfBirth:
          </label>
          <input
            type="text"
            name="dateOfBirth"
            value={user.dateOfBirth}
            onChange={handleInputChange}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              margin: "8px 0",
              borderRadius: "8px",
              border: errors.dateOfBirth ? "2px solid red" : "2px solid #ccc",
              backgroundColor: isEditing ? "#fff" : "#e9ecef",
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
          <label style={{ fontSize: "16px", color: "#555" }}>Phone:</label>
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
              backgroundColor: isEditing ? "#fff" : "#e9ecef",
              outline: "none",
            }}
          />
          {errors.phone && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.phone}
            </span>
          )}
        </div>

        <button
          onClick={toggleEditMode}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#9BBAA36",
            backgroundColor: isEditing ? "#9BBAA3" : "#9BBAA36",
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
