import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./PregnancyProfile.css";

function PregnancyProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditProfile, setCurrentEditProfile] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  function fetchProfiles() {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      toast.error("Please log in first to view your profiles.");
      return;
    }

    console.log("Fetching profiles for user ID:", userId);

    fetch(
      `http://localhost:5254/api/PregnancyProfile/GetProfilesByUserId/${userId}`
    )
      .then((response) => {
        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(
            `API request failed with status code ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        setProfiles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error occurred:", err);
        setError(err.message);
        setLoading(false);
        console.error("Error fetching pregnancy profiles:", err);
      });
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function handleCreateProfile() {
    navigate("/create-pregnancy-profile");
  }

  function handleOpenEditModal(profile) {
    setCurrentEditProfile(profile);
    setIsEditModalOpen(true);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setCurrentEditProfile(null);
  }

  function handleOpenDeleteModal(profile) {
    setProfileToDelete(profile);
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
    setProfileToDelete(null);
  }

  async function handleDeleteProfile() {
    try {
      const response = await fetch(
        `http://localhost:5254/api/PregnancyProfile/DeleteProfile/${profileToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Profile deleted successfully!");
        fetchProfiles();
        handleCloseDeleteModal();
      } else {
        throw new Error("Failed to delete profile");
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      toast.error(err.message || "Failed to delete profile");
    }
  }

  async function handleSaveEdit(updatedData) {
    try {
      const userId = sessionStorage.getItem("userID");

      const dataToUpdate = {
        id: currentEditProfile.id,
        name: updatedData.name,
        conceptionDate: updatedData.conceptionDate,
        dueDate: updatedData.dueDate,
        pregnancyStatus:
          updatedData.pregnancyStatus || currentEditProfile.pregnancyStatus,
      };

      const response = await fetch(
        `http://localhost:5254/api/PregnancyProfile/UpdateProfile/${currentEditProfile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToUpdate),
        }
      );

      if (response.ok) {
        toast.success("Profile updated successfully!");
        fetchProfiles();
        handleCloseEditModal();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.message || "Failed to update profile");
    }
  }
  
  function renderProfileCard(profile) {
    return (
      <div key={profile.id} className="profile-card">
        <h2 className="profile-name">{profile.userName}</h2>
        <div className="profile-field">
          <span className="field-label">Baby Name: </span>{" "}
          {profile.name || "Not specified"}
        </div>
        <div className="profile-field">
          <span className="field-label">Pregnancy Date: </span>{" "}
          {formatDate(profile.conceptionDate)}
        </div>
        <div className="profile-field">
          <span className="field-label">Expected Date of birth: </span>{" "}
          {formatDate(profile.dueDate)}
        </div>
        <div className="profile-field">
          <span className="field-label">Profile Created At: </span>{" "}
          {formatDate(profile.createdAt)}
        </div>
        <div className="profile-field">
          <span className="field-label">Status: </span>
          <span
            className={
              profile.pregnancyStatus === "On Going"
                ? "status-ongoing"
                : "status-other"
            }
          >
            {profile.pregnancyStatus}
          </span>
        </div>
        <div className="profile-actions">
          <button
            className="edit-button"
            onClick={() => handleOpenEditModal(profile)}
          >
            Edit Profile
          </button>
          <button
            className="delete-button"
            onClick={() => handleOpenDeleteModal(profile)}
          >
            Delete Profile
          </button>
        </div>
      </div>
    );
  }

  if (loading)
    return <div className="loading-message">Loading profiles...</div>;

  if (error) return <div className="error-message">Error: {error}</div>;

  if (profiles.length === 0)
    return (
      <div className="pregnancy-container">
        <h1 className="pregnancy-title">Pregnancy Profiles</h1>
        <div className="empty-message">No pregnancy profiles found.</div>
        <button className="create-profile-button" onClick={handleCreateProfile}>
          Create New Pregnancy Profile
        </button>
      </div>
    );

  return (
    <div className="pregnancy-container">
      <h1 className="pregnancy-title">Pregnancy Profiles</h1>
      <button className="create-profile-button" onClick={handleCreateProfile}>
        Create New Pregnancy Profile
      </button>
      <div className="profiles-grid">
        {profiles.map((profile) => renderProfileCard(profile))}
      </div>

      {/* Edit Modal Popup */}
      {isEditModalOpen && (
        <div className="preg-modal-overlay">
          <div className="preg-modal-container">
            <div className="preg-modal-header">
              <h2>Edit Pregnancy Profile</h2>
              <button
                className="preg-close-button"
                onClick={handleCloseEditModal}
              >
                ×
              </button>
            </div>
            <div className="preg-modal-body">
              <EditProfileForm
                profile={currentEditProfile}
                onSave={handleSaveEdit}
                onCancel={handleCloseEditModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="preg-modal-overlay">
          <div className="preg-modal-container preg-delete-modal">
            <div className="preg-modal-header">
              <h2>Confirm Deletion</h2>
              <button
                className="preg-close-button"
                onClick={handleCloseDeleteModal}
              >
                ×
              </button>
            </div>
            <div className="preg-modal-body">
              <p className="delete-warning">
                Are you sure you want to delete this pregnancy profile? This
                action cannot be undone.
              </p>
              <div className="form-actions">
                <button
                  className="cancel-button"
                  onClick={handleCloseDeleteModal}
                >
                  Cancel
                </button>
                <button
                  className="delete-confirm-button"
                  onClick={handleDeleteProfile}
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditProfileForm({ profile, onSave, onCancel }) {
  const [conceptionDate, setConceptionDate] = useState(
    profile?.conceptionDate
      ? new Date(profile.conceptionDate).toISOString().split("T")[0]
      : ""
  );
  const [dueDate, setDueDate] = useState(
    profile?.dueDate
      ? new Date(profile.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [name, setName] = useState(profile?.name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      conceptionDate,
      dueDate,
      name,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Baby Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter baby name (optional)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="conceptionDate">Pregnancy Date:</label>
        <input
          type="date"
          id="conceptionDate"
          value={conceptionDate}
          onChange={(e) => setConceptionDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Expected Date of Birth:</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default PregnancyProfileList;
