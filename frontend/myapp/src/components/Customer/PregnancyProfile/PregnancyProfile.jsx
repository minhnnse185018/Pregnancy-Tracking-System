import React, { useState, useEffect } from 'react';
import './PregnancyProfile.css'; // Import the CSS file

function PregnancyProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  function fetchProfiles() {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      alert("Người dùng chưa đăng nhập. Vui lòng đăng nhập trước.");
      return;
    }
  
    console.log("Đang lấy danh sách hồ sơ cho user ID:", userId);
  
    fetch(`http://localhost:5254/api/PregnancyProfile/GetProfilesByUserId/${userId}`)
      .then(response => {
        console.log("Phản hồi nhận được:", response);
        if (!response.ok) {
          throw new Error(`Yêu cầu API thất bại với mã trạng thái ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Dữ liệu nhận được:", data);
        setProfiles(data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Lỗi xảy ra:", err);
        setError(err.message);
        setLoading(false);
        console.error('Lỗi khi lấy danh sách hồ sơ thai kỳ:', err);
      });
  }
  

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function renderProfileCard(profile) {
    return (
      <div key={profile.id} className="profile-card">
        <h2 className="profile-name">{profile.userName}</h2>
        <div className="profile-field">
          <span className="field-label">Pregnancy Date: </span> {formatDate(profile.conceptionDate)}
        </div>
        <div className="profile-field">
          <span className="field-label">Expected Date of birth: </span> {formatDate(profile.dueDate)}
        </div>
        <div className="profile-field">
          <span className="field-label">Created At: </span> {formatDate(profile.createdAt)}
        </div>
        <div className="profile-field">
          <span className="field-label">Status: </span>
          <span className={profile.pregnancyStatus === 'On Going' ? 'status-ongoing' : 'status-other'}>
            {profile.pregnancyStatus}
          </span>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading-message">Loading profiles...</div>;
  
  if (error) return <div className="error-message">Error: {error}</div>;
  
  if (profiles.length === 0) return <div className="empty-message">No pregnancy profiles found.</div>;

  return (
    <div className="pregnancy-container">
      <h1 className="pregnancy-title">Pregnancy Profiles</h1>
      <div className="profiles-grid">
        {profiles.map(profile => renderProfileCard(profile))}
      </div>
    </div>
  );
}

export default PregnancyProfileList;