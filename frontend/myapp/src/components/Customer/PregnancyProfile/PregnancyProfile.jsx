import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PregnancyProfile.css";

function PregnancyProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the ID from the URL

  useEffect(() => {
    fetchPregnancyProfile();
  }, []);

  const fetchPregnancyProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5254/api/PregnancyProfile/GetAllProfiles`
      );
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching pregnancy profile:", err);
      setError("Failed to load pregnancy profile. Please try again.");
      setLoading(false);
    }
  };

  // Calculate weeks of pregnancy
  const calculateWeeksOfPregnancy = (conceptionDate) => {
    if (!conceptionDate) return 0;
    
    const conception = new Date(conceptionDate);
    const today = new Date();
    const diffTime = Math.abs(today - conception);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  };
  
  // Calculate time remaining until due date
  const calculateTimeRemaining = (dueDate) => {
    if (!dueDate) return { weeks: 0, days: 0 };
    
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = Math.abs(due - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    
    return { weeks, days };
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div className="not-found">Pregnancy profile not found</div>;

  const weeksOfPregnancy = calculateWeeksOfPregnancy(profile.conceptionDate);
  const timeRemaining = calculateTimeRemaining(profile.dueDate);

  return (
    <div className="pregnancy-profile-container">
      <div className="profile-header">
        <h1>Pregnancy Profile</h1>
        <span className="profile-status">{profile.pregnancyStatus}</span>
      </div>

      <div className="profile-card">
        <div className="profile-info-section">
          <h2>Basic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Conception Date:</span>
              <span className="info-value">{new Date(profile.conceptionDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Due Date:</span>
              <span className="info-value">{new Date(profile.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Created On:</span>
              <span className="info-value">{new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="pregnancy-progress-section">
          <h2>Pregnancy Progress</h2>
          <div className="progress-info">
            <div className="progress-item">
              <div className="progress-value">{weeksOfPregnancy}</div>
              <div className="progress-label">Weeks of Pregnancy</div>
            </div>
            <div className="progress-item">
              <div className="progress-value">{timeRemaining.weeks}w {timeRemaining.days}d</div>
              <div className="progress-label">Time Remaining</div>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-label">Overall Progress</div>
            <div className="progress-bar-outer">
              <div 
                className="progress-bar-inner" 
                style={{ width: `${Math.min((weeksOfPregnancy / 40) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="progress-percentage">{Math.min(Math.round((weeksOfPregnancy / 40) * 100), 100)}%</div>
          </div>
        </div>

        {profile.fetalMeasurements && profile.fetalMeasurements.length > 0 ? (
          <div className="fetal-measurements-section">
            <h2>Fetal Measurements</h2>
            <div className="measurements-list">
              {profile.fetalMeasurements.map((measurement, index) => (
                <div key={index} className="measurement-item">
                  <div className="measurement-date">
                    {new Date(measurement.date).toLocaleDateString()}
                  </div>
                  <div className="measurement-details">
                    <div className="measurement-detail">
                      <span className="detail-label">Weight:</span>
                      <span className="detail-value">{measurement.weight} g</span>
                    </div>
                    <div className="measurement-detail">
                      <span className="detail-label">Length:</span>
                      <span className="detail-value">{measurement.length} cm</span>
                    </div>
                    <div className="measurement-detail">
                      <span className="detail-label">Head Circumference:</span>
                      <span className="detail-value">{measurement.headCircumference} cm</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-measurements">
            <h2>Fetal Measurements</h2>
            <p>No fetal measurements recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PregnancyProfileView;