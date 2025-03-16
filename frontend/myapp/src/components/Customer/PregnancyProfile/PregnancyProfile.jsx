import React, { useState, useEffect } from "react";
import "./PregnancyProfile.css"; // Import the CSS file
import { useNavigate } from "react-router-dom"; // Import to handle navigation
import { toast } from "react-toastify"; // Import toast (you'll need to install react-toastify)

function PregnancyProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  
  // State for the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditProfile, setCurrentEditProfile] = useState(null);
  
  // State for the delete confirmation modal
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
    // Navigate to the create profile page
    navigate("/create-pregnancy-profile");
  }
  
  // Function to open the edit modal
  function handleOpenEditModal(profile) {
    setCurrentEditProfile(profile);
    setIsEditModalOpen(true);
  }
  
  // Function to close the edit modal
  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setCurrentEditProfile(null);
  }
  
  // Function to open the delete confirmation modal
  function handleOpenDeleteModal(profile) {
    setProfileToDelete(profile);
    setIsDeleteModalOpen(true);
  }
  
  // Function to close the delete confirmation modal
  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
    setProfileToDelete(null);
  }
  
  // Function to handle deleting the profile
  async function handleDeleteProfile() {
    try {
      const response = await fetch(
        `http://localhost:5254/api/PregnancyProfile/DeleteProfile/${profileToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      
      if (response.ok) {
        // Show success toast
        toast.success("Profile deleted successfully!");
        // Refresh profiles
        fetchProfiles();
        // Close modal
        handleCloseDeleteModal();
      } else {
        throw new Error("Failed to delete profile");
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      toast.error(err.message || "Failed to delete profile");
    }
  }
  
  // Function to handle saving the edited profile
  async function handleSaveEdit(updatedData) {
    try {
      const userId = sessionStorage.getItem("userID");
      
      // Prepare the data to be sent to the API
      const dataToUpdate = {
        id: currentEditProfile.id,
        userId: parseInt(userId),
        conceptionDate: updatedData.conceptionDate,
        dueDate: updatedData.dueDate,
        pregnancyStatus: updatedData.pregnancyStatus || currentEditProfile.pregnancyStatus
        // Add any other fields that need to be updated
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
        // Show success toast
        toast.success("Profile updated successfully!");
        // Refresh profiles
        fetchProfiles();
        // Close modal
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
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit Pregnancy Profile</h2>
              <button 
                className="close-button"
                onClick={handleCloseEditModal}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
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
        <div className="modal-overlay">
          <div className="modal-container delete-modal">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button 
                className="close-button"
                onClick={handleCloseDeleteModal}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="delete-warning">
                Are you sure you want to delete this pregnancy profile? This action cannot be undone.
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

// EditProfileForm component
function EditProfileForm({ profile, onSave, onCancel }) {
  // Initialize with current profile values or defaults
  const [conceptionDate, setConceptionDate] = useState(
    profile?.conceptionDate ? new Date(profile.conceptionDate).toISOString().split('T')[0] : ""
  );
  const [dueDate, setDueDate] = useState(
    profile?.dueDate ? new Date(profile.dueDate).toISOString().split('T')[0] : ""
  );
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      conceptionDate,
      dueDate,
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
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