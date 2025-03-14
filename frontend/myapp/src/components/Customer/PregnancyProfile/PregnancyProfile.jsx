import React, { useState, useEffect } from "react";
import "./PregnancyProfile.css";
import { FcPlus } from "react-icons/fc";
import axios from "axios";

function PregnancyProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conceptionDate, setConceptionDate] = useState("");
  const [creating, setCreating] = useState(false); // Track form visibility
  const [previewImage, setPreviewImage] = useState(null);
  const [img, setImg] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  function fetchProfiles() {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      alert("Người dùng chưa đăng nhập. Vui lòng đăng nhập trước.");
      return;
    }

    fetch(`http://localhost:5254/api/PregnancyProfile/GetProfilesByUserId/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setProfiles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  function calculateDueDate(conception) {
    if (!conception) return "";
    const dueDate = new Date(conception);
    dueDate.setDate(dueDate.getDate() + 280); // 280 days after conception
    return dueDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
  }

  const handleUploadFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileType = file.type;
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (validTypes.includes(fileType)) {
        setPreviewImage(URL.createObjectURL(file));
        setImg(file);
      } else {
        alert('Định dạng file không hợp lệ! Vui lòng tải lên ảnh JPG hoặc PNG.');
        e.target.value = "";
      }
    } else {
      setPreviewImage(null);
    }
  };

  async function handleCreateProfile(e) {
    e.preventDefault();
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      alert("Người dùng chưa đăng nhập.");
      return;
    }
    if (!conceptionDate) {
      alert("Vui lòng chọn ngày thụ thai.");
      return;
    }

    try {
      // 1. Tạo hồ sơ thai kỳ trước
      const newProfile = {
        userId: parseInt(userId, 10),
        conceptionDate: new Date(conceptionDate).toISOString(),
        dueDate: new Date(calculateDueDate(conceptionDate)).toISOString(),
      };

      const response = await fetch("http://localhost:5254/api/PregnancyProfile/CreateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfile),
      });

      if (!response.ok) throw new Error(`Lỗi: ${response.status}`);
      const createdProfile = await response.json();

      // 2. Nếu có ảnh, upload ảnh cho profile vừa tạo
      if (img) {
        const formData = new FormData();
        formData.append('file', img);

        await axios.post(
          `http://localhost:5254/api/PregnancyProfile/${createdProfile.id}/upload-image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
          }
        );
      }

      alert("Hồ sơ thai kỳ đã được tạo!");
      fetchProfiles();
      setCreating(false);
      setPreviewImage(null);
      setImg(null);
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  }

  return (
    <div className="pregnancy-container">
      <h1 className="pregnancy-title">Pregnancy Profiles</h1>

      {/* Toggle Create Profile Form */}
      <button className="toggle-create-button" onClick={() => setCreating(!creating)}>
        {creating ? "Cancel" : "Create Pregnancy Profile"}
      </button>

      {creating && (
        <form className="profile-form" onSubmit={handleCreateProfile}>
          <label>Conception Date:</label>
          <input
            type="date"
            value={conceptionDate}
            onChange={(e) => setConceptionDate(e.target.value)}
            required
          />
          <label>Due Date:</label>
          <input type="text" value={calculateDueDate(conceptionDate)} disabled />
          
          <div className="upload-section">
            <label className="form-label label-upload" htmlFor="labelUpload">
              <FcPlus /> Upload File Image
            </label>
            <input
              type="file"
              id="labelUpload"
              hidden
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleUploadFile}
            />
          </div>

          <div className="img-preview">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Uploaded preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "8px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              />
            ) : (
              <span>Preview Image</span>
            )}
          </div>

          <button type="submit" className="submit-button">Create</button>
        </form>
      )}

      {loading ? (
        <div className="loading-message">Loading profiles...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : profiles.length === 0 ? (
        <div className="empty-message">No pregnancy profiles found.</div>
      ) : (
        <div className="profiles-grid">
          {profiles.map((profile) => (
            <div key={profile.id} className="profile-card">
              <h2>{profile.userName}</h2>
              <p>Profile ID: {profile.id}</p>
              <p>User ID: {profile.userId}</p>
              <p>Conception Date: {new Date(profile.conceptionDate).toLocaleDateString()}</p>
              <p>Due Date: {new Date(profile.dueDate).toLocaleDateString()}</p>
              <p>Status: <span className={profile.pregnancyStatus === "On Going" ? "status-ongoing" : "status-other"}>{profile.pregnancyStatus}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PregnancyProfileList;
