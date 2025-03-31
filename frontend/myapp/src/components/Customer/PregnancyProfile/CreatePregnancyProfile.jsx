import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePregnancyProfile.css";
import { toast } from "react-toastify";

function CreatePregnancyProfile() {
  const [babyName, setBabyName] = useState(""); // New state for baby name
  const [weekOfPregnancy, setWeekOfPregnancy] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const imageData = {
    resources: [
      {
        asset_folder: "Girl",
        secure_url:
          "https://res.cloudinary.com/dwct6sfin/image/upload/v1742069748/wuyoohq3wvj9wcrbvzr8.png",
      },
      {
        asset_folder: "Boy",
        secure_url:
          "https://res.cloudinary.com/dwct6sfin/image/upload/v1742069707/rwpcypk6qfe1iyivlpi1.png",
      },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      setError("Người dùng chưa đăng nhập. Vui lòng đăng nhập trước.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5254/api/PregnancyProfile/CreateProfile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: parseInt(userId),
            name: babyName, // Add the baby name to the request
            weekOfPregnancy: parseInt(weekOfPregnancy),
            dueDate: dueDate,
          }),
        }
      );
      if (response.status === 200) {
        // Display success toast
        toast.success("🎉 Your Baby profile is readyyy now!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setSuccessMessage("🎉 Your Baby profile is readyyy now!");
        setTimeout(() => navigate("/profilePregnancy"), 2000);
      } else {
        throw new Error("😢 Error creating profile. Please try again.");
      }
    } catch (err) {
      console.error("Error creating pregnancy profile:", err);
      setError(err.message);

      // Display error toast
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDueDate = (e) => {
    const weeks = parseInt(e.target.value);
    if (!isNaN(weeks) && weeks >= 0 && weeks <= 42) {
      setWeekOfPregnancy(weeks);

      // Calculate due date based on current week of pregnancy
      const today = new Date();
      const remainingWeeks = 40 - weeks; // Full term is typically 40 weeks
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + remainingWeeks * 7);

      // Format date for input field (YYYY-MM-DD)
      const formattedDate = dueDate.toISOString().split("T")[0];
      setDueDate(formattedDate);
    }
  };

  return (
    <div className="create-profile-container">
      <h1 className="create-profile-title">Create New Pregnancy Profile</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="pregnancy-form">
          <div className="form-illustration">
            <div className="mom-illustration">👩‍🍼</div>
            <div className="baby-illustration">👶</div>
          </div>

          {/* New Baby Name Field */}
          <div className="form-group">
            <label htmlFor="babyName">Baby Name (optional)</label>
            <input
              type="text"
              id="name"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="Enter your baby's name or nickname"
              className="form-control"
            />
            <div className="name-info">
              Choose a name or nickname for your baby profile
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="weekOfPregnancy">Current Week of Pregnancy</label>
            <input
              type="number"
              id="weekOfPregnancy"
              value={weekOfPregnancy}
              onChange={calculateDueDate}
              min="0"
              max="42"
              required
              className="form-control"
            />
            <div className="week-indicator">
              <div
                className="week-progress"
                style={{ width: `${(weekOfPregnancy / 42) * 100}%` }}
              ></div>
              <span className="week-label">{weekOfPregnancy} / 42 weeks</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Expected Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="form-control"
            />
            <div className="date-info">
              Your baby is expected to arrive on this date
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/profilePregnancy")}
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Creating..." : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePregnancyProfile;