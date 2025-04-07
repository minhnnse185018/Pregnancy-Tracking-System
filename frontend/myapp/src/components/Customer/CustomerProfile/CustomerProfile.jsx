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
      const datePattern = /^\d{4}\/\d{2}\/\d{2}$/;
      if (!datePattern.test(value)) {
        errorMsg = "Date must be in YYYY/MM/DD format";
      } else {
        const [year, month, day] = value.split('/');
        const inputDate = new Date(year, month - 1, day);
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0].replace(/-/g, '/');
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
          background: "linear-gradient(135deg, #fff0f5 0%, #fce4e8 100%)", // Gradient đồng nhất
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#FF8989", // Màu hồng chính
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
              backgroundColor: "#fff", // Luôn là trắng
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
              backgroundColor: "#fff", // Luôn là trắng
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
              backgroundColor: "#fff", // Luôn là trắng
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
          <input
            type="text"
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
              backgroundColor: "#fff", // Luôn là trắng
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
          <label style={{ fontSize: "16px", color: "#FF8989" }}>
            Date of Birth: (1954 - Present)
          </label>
          <input
            type="text"
            name="dateOfBirth"
            value={formatDate(user.dateOfBirth)}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="YYYY/MM/DD"
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
              backgroundColor: "#fff", // Luôn là trắng
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
            backgroundColor: "#FF8989", // Màu hồng chính
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