import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./FetalGrowthTracker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function FetalGrowthTracker() {
  const [gestationalAge, setGestationalAge] = useState("");
  const [fetalData, setFetalData] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
    if (isAuthenticated) {
      fetchUserProfiles();
    }
  }, [isAuthenticated]);

  function checkAuthentication() {
    const userId = sessionStorage.getItem("userID");
    setIsAuthenticated(!!userId);
  }

  function fetchUserProfiles() {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      toast.error("Please log in to view your profiles.");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5254/api/PregnancyProfile/GetProfilesByUserId/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch profiles");
        return response.json();
      })
      .then((data) => {
        setUserProfiles(data);
        if (data.length > 0) {
          setSelectedProfile(data[0]);
          fetchFetalData(data[0].id);
        }
      })
      .catch((err) => {
        console.error("Error fetching profiles:", err);
        toast.error("Failed to load profiles.");
      });
  }

  function fetchFetalData(profileId) {
    fetch(`http://localhost:5254/api/FetalMeasurement/GetGrowthByProfile/${profileId}`)
      .then((response) => {
        if (!response.ok) return [];
        return response.json();
      })
      .then((data) => {
        const profile = userProfiles.find((p) => p.id === profileId);
        const conceptionDate = profile ? new Date(profile.conceptionDate) : null;
        const mappedData = (data || []).map((item) => {
          let weeks = item.week || "N/A";
          if (weeks === "N/A" && conceptionDate && item.measureDate) {
            const measureDate = new Date(item.measureDate);
            const diffTime = Math.abs(measureDate - conceptionDate);
            const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
            weeks = diffWeeks;
          }
          return {
            id: item.id,
            profileId: item.profileId,
            weeks: weeks,
            length: item.heightCm || 0,
            weight: item.weightGrams || 0,
            notes: item.notes || "N/A", // Thay "milestones" thành "notes"
            measureDate: item.measureDate || item.createdAt,
          };
        });
        const sortedData = mappedData.sort((a, b) => {
          const weekA = parseInt(a.weeks) || 0;
          const weekB = parseInt(b.weeks) || 0;
          return weekA - weekB;
        });
        setFetalData(sortedData);
      })
      .catch((err) => {
        console.error("Error fetching fetal data:", err);
        toast.error("Failed to load fetal growth data.");
        setFetalData([]);
      });
  }

  function calculateGuestFetalData(weeks) {
    const data = [
      {
        weeks,
        length: (weeks * 0.5).toFixed(1),
        weight: (weeks * 10).toFixed(0),
        notes: `At ${weeks} weeks, the fetus is developing rapidly!`, // Thay "milestones" thành "notes"
      },
    ];
    setFetalData(data);
  }

  function handleGestationalAgeChange(e) {
    const weeks = e.target.value;
    setGestationalAge(weeks);
    if (weeks && !isAuthenticated) {
      calculateGuestFetalData(weeks);
    }
  }

  function handleProfileChange(e) {
    const profileId = e.target.value;
    const profile = userProfiles.find((p) => p.id === profileId);
    setSelectedProfile(profile);
    fetchFetalData(profileId);
  }

  function handleOpenModal(data = null) {
    setCurrentEditData(data);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setCurrentEditData(null);
  }

  async function handleSaveFetalData(updatedData) {
    const payload = {
      profileId: selectedProfile.id,
      weightGrams: updatedData.weight,
      heightCm: updatedData.length,
      notes: updatedData.notes, // Thay "milestones" thành "notes"
      week: updatedData.weeks,
      measureDate: new Date().toISOString(),
    };

    const url = currentEditData
      ? `http://localhost:5254/api/FetalMeasurement/UpdateGrowth/${currentEditData.id}`
      : `http://localhost:5254/api/FetalMeasurement/CreateGrowth`;
    const method = currentEditData ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(currentEditData ? "Data updated!" : "Data created!");
        fetchFetalData(selectedProfile.id);
        handleCloseModal();
      } else {
        throw new Error(`Failed to save data: ${response.status}`);
      }
    } catch (err) {
      console.error("Error saving fetal data:", err);
      toast.error(`Failed to save data: ${err.message}`);
    }
  }

  async function handleDeleteFetalData(id) {
    try {
      const response = await fetch(
        `http://localhost:5254/api/FetalMeasurement/DeleteGrowth/${id}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );

      if (response.ok) {
        toast.success("Data deleted!");
        fetchFetalData(selectedProfile.id);
      } else {
        throw new Error(`Failed to delete data: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deleting fetal data:", err);
      toast.error(`Failed to delete data: ${err.message}`);
    }
  }

  const chartData = {
    labels: fetalData.length > 0 ? fetalData.map((data) => `Week ${data.weeks || "N/A"}`) : [],
    datasets: [
      {
        label: "Length (cm)",
        data: fetalData.map((data) => data.length || 0),
        backgroundColor: "rgba(255, 140, 148, 0.6)",
        borderColor: "rgba(255, 140, 148, 1)",
        borderWidth: 1,
        barThickness: 30,
      },
      {
        label: "Weight (g)",
        data: fetalData.map((data) => data.weight || 0),
        backgroundColor: "rgba(180, 147, 211, 0.6)",
        borderColor: "rgba(180, 147, 211, 1)",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      y: { display: false, grid: { display: false } },
      x: {
        ticks: { color: "#5c4b7d", font: { family: "'Poppins', sans-serif" } },
        grid: { display: false },
      },
    },
    categoryPercentage: 0.8,
    barPercentage: 0.6,
  };

  function renderGuestView() {
    return (
      <div className="tracker-container">
        <h1 className="tracker-title">Fetal Growth Tracker</h1>
        <p className="guest-note">Enter gestational age to preview growth (not saved).</p>
        <div className="input-group">
          <label htmlFor="gestationalAge">Gestational Age (weeks):</label>
          <input
            type="number"
            id="gestationalAge"
            value={gestationalAge}
            onChange={handleGestationalAgeChange}
            min="1"
            max="40"
          />
        </div>
        {fetalData.length > 0 ? (
          <>
            {renderFetalDataTable()}
            <div className="chart-wrapper">
              <Bar data={chartData} options={chartOptions} />
              <div className="chart-description">
                <p className="trend">Trending up this month</p>
                <p className="details">Showing growth data for the entered gestational age</p>
              </div>
            </div>
          </>
        ) : (
          <p>No fetal growth data available. Enter a gestational age to preview.</p>
        )}
        <p className="login-prompt">
          <button onClick={() => navigate("/login")}>Log in</button> to save and manage data!
        </p>
      </div>
    );
  }

  function renderAuthenticatedView() {
    if (userProfiles.length === 0) {
      return (
        <div className="tracker-container">
          <h1 className="tracker-title">Fetal Growth Tracker</h1>
          <p>No pregnancy profiles found.</p>
          <button
            className="create-profile-button"
            onClick={() => navigate("/create-pregnancy-profile")}
          >
            Create a Pregnancy Profile
          </button>
        </div>
      );
    }

    return (
      <div className="tracker-container">
        <h1 className="tracker-title">Fetal Growth Tracker</h1>
        <div className="input-group">
          <label htmlFor="profileSelect">Select Pregnancy Profile:</label>
          <select
            id="profileSelect"
            value={selectedProfile?.id || ""}
            onChange={handleProfileChange}
          >
            {userProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name || `Profile ${profile.id}`} -{" "}
                {new Date(profile.conceptionDate).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <FetalDataForm onSave={handleSaveFetalData} />
        {fetalData.length > 0 ? (
          <>
            {renderFetalDataTable()}
            <div className="chart-wrapper">
              <Bar data={chartData} options={chartOptions} />
              <div className="chart-description">
                <p className="trend">Trending up this month</p>
                <p className="details">Showing growth data for the selected profile</p>
              </div>
            </div>
          </>
        ) : (
          <p>No fetal growth data available for this profile. Add data to get started.</p>
        )}
        {isModalOpen && (
          <FetalDataForm
            data={currentEditData}
            onSave={handleSaveFetalData}
            onCancel={handleCloseModal}
            isModal={true}
          />
        )}
      </div>
    );
  }

  function renderFetalDataTable() {
    if (fetalData.length === 0) {
      return <p>No data to display.</p>;
    }

    return (
      <table className="fetal-data-table">
        <thead>
          <tr>
            <th>Weeks</th>
            <th>Length (cm)</th>
            <th>Weight (g)</th>
            <th>Notes</th> {/* Thay "Milestones" thành "Notes" */}
            {isAuthenticated && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {fetalData.map((data) => (
            <tr key={data.id || data.weeks || Math.random()}>
              <td>{data.weeks || "N/A"}</td>
              <td>{data.length || "N/A"}</td>
              <td>{data.weight || "N/A"}</td>
              <td>{data.notes || "N/A"}</td> {/* Thay "milestones" thành "notes" */}
              {isAuthenticated && (
                <td>
                  <button onClick={() => handleOpenModal(data)}>Edit</button>
                  <button onClick={() => handleDeleteFetalData(data.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="logo">
          <span role="img" aria-label="mom-and-baby">🤰</span> MOM & BABY
        </div>
        <nav className="nav-menu">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/services">Service</a>
          <a href="/member">Member</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <main>
        {isAuthenticated ? renderAuthenticatedView() : renderGuestView()}
      </main>
    </div>
  );
}

function FetalDataForm({ data, onSave, onCancel, isModal = false }) {
  const [weeks, setWeeks] = useState(data?.weeks || "");
  const [length, setLength] = useState(data?.length || "");
  const [weight, setWeight] = useState(data?.weight || "");
  const [notes, setNotes] = useState(data?.notes || ""); // Thay "milestones" thành "notes"

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      weeks: parseInt(weeks),
      length: parseFloat(length),
      weight: parseFloat(weight),
      notes, // Thay "milestones" thành "notes"
    });
    if (!isModal) {
      setWeeks("");
      setLength("");
      setWeight("");
      setNotes(""); // Thay "milestones" thành "notes"
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Weeks:</label>
        <input
          type="number"
          value={weeks}
          onChange={(e) => setWeeks(e.target.value)}
          min="1"
          max="40"
          required
        />
      </div>
      <div className="form-group">
        <label>Length (cm):</label>
        <input
          type="number"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          step="0.1"
          required
        />
      </div>
      <div className="form-group">
        <label>Weight (g):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Notes:</label> {/* Thay "Milestones" thành "Notes" */}
        <textarea
          value={notes} // Thay "milestones" thành "notes"
          onChange={(e) => setNotes(e.target.value)} // Thay "milestones" thành "notes"
          placeholder="Enter notes (optional)" // Thay "milestones" thành "notes"
        />
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        )}
        <button type="submit" className="save-button">
          Save
        </button>
      </div>
    </form>
  );

  return isModal ? (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Edit Fetal Growth Data</h2>
        {formContent}
      </div>
    </div>
  ) : (
    <div className="form-container">
      <h2>Add Fetal Growth Data</h2>
      {formContent}
    </div>
  );
}

export default FetalGrowthTracker;