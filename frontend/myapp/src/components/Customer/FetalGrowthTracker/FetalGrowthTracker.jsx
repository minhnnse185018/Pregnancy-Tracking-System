import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const navigate = useNavigate();
  const chartRef = useRef(null);

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

  async function fetchUserProfiles() {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      toast.error("Please log in to view your profiles.");
      navigate("/customer-login");
      return;
    }

    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:5254/api/PregnancyProfile/GetProfilesByUserId/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setUserProfiles(response.data);
      if (response.data.length > 0) {
        setSelectedProfile(response.data[0]);
        fetchFetalData(response.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
      toast.error("Failed to load profiles.");
    }
  }

  async function fetchFetalData(profileId) {
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:5254/api/FetalMeasurement/GetGrowthByProfile/${profileId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const profile = userProfiles.find((p) => p.id === profileId);
      const conceptionDate = profile ? new Date(profile.conceptionDate) : null;
      const mappedData = (response.data || []).map((item) => {
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
          biparietalDiameter: item.biparietalDiameterCm || 0,
          femoralLength: item.femoralLengthCm || 0,
          headCircumference: item.headCircumferenceCm || 0,
          abdominalCircumference: item.abdominalCircumferenceCm || 0,
          notes: item.notes || "N/A",
          measureDate: item.measureDate || item.createdAt,
        };
      });
      const sortedData = mappedData.sort((a, b) => {
        const weekA = parseInt(a.weeks) || 0;
        const weekB = parseInt(b.weeks) || 0;
        return weekA - weekB;
      });
      setFetalData(sortedData);
    } catch (err) {
      console.error("Error fetching fetal data:", err);
      toast.error("Failed to load fetal growth data.");
      setFetalData([]);
    }
  }

  function calculateGuestFetalData(weeks) {
    const data = [
      {
        weeks,
        length: (weeks * 0.5).toFixed(1),
        weight: (weeks * 10).toFixed(0),
        biparietalDiameter: (weeks * 0.2).toFixed(1),
        femoralLength: (weeks * 0.1).toFixed(1),
        headCircumference: (weeks * 0.8).toFixed(1),
        abdominalCircumference: (weeks * 0.7).toFixed(1),
        notes: `At ${weeks} weeks, the fetus is developing rapidly!`,
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
    const requiredFields = [
      "weeks",
      "length",
      "weight",
      "biparietalDiameter",
      "femoralLength",
      "headCircumference",
      "abdominalCircumference",
    ];
    for (const field of requiredFields) {
      if (
        updatedData[field] === undefined ||
        updatedData[field] === null ||
        isNaN(updatedData[field])
      ) {
        toast.error(`Please provide a valid value for ${field}.`);
        return;
      }
    }

    if (!selectedProfile?.id) {
      toast.error("No pregnancy profile selected.");
      return;
    }

    const payload = {
      profileId: selectedProfile.id,
      weightGrams: parseFloat(updatedData.weight),
      heightCm: parseFloat(updatedData.length),
      biparietalDiameterCm: parseFloat(updatedData.biparietalDiameter),
      femoralLengthCm: parseFloat(updatedData.femoralLength),
      headCircumferenceCm: parseFloat(updatedData.headCircumference),
      abdominalCircumferenceCm: parseFloat(updatedData.abdominalCircumference),
      notes: updatedData.notes || "",
      week: parseInt(updatedData.weeks, 10),
      measureDate: new Date().toISOString(),
    };

    const url = currentEditData
      ? `http://localhost:5254/api/FetalMeasurement/UpdateGrowth/${currentEditData.id}`
      : `http://localhost:5254/api/FetalMeasurement/CreateGrowth`;
    const method = currentEditData ? "put" : "post";

    const token = sessionStorage.getItem("token");

    try {
      const response = await axios({
        method,
        url,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      toast.success(currentEditData ? "Data updated!" : "Data created!");
      fetchFetalData(selectedProfile.id);
      handleCloseModal();
    } catch (err) {
      console.error(
        "Error saving fetal data:",
        err.response?.data || err.message
      );
      toast.error(
        `Failed to save data: ${err.response?.data?.message || err.message}`
      );
    }
  }

  function handleDeleteClick(data) {
    setDataToDelete(data);
    setShowDeleteModal(true);
  }

  async function handleDeleteConfirm() {
    if (!dataToDelete?.id) return;

    const token = sessionStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5254/api/FetalMeasurement/DeleteGrowth/${dataToDelete.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      toast.success("Data deleted!");
      fetchFetalData(selectedProfile.id);
      setShowDeleteModal(false);
      setDataToDelete(null);
    } catch (err) {
      console.error(
        "Error deleting fetal data:",
        err.response?.data || err.message
      );
      toast.error(
        `Failed to delete data: ${err.response?.data?.message || err.message}`
      );
    }
  }

  function handleDeleteCancel() {
    setShowDeleteModal(false);
    setDataToDelete(null);
  }

  const downloadChart = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement("a");
      link.download = `Fetal_Growth_Chart_${selectedProfile?.id || "Guest"}_${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = chart.toBase64Image();
      link.click();
      toast.success("Chart downloaded successfully!");
    } else {
      toast.error("Chart not available for download.");
    }
  };

  const chartData = {
    labels:
      fetalData.length > 0
        ? fetalData.map((data) => `Week ${data.weeks || "N/A"}`)
        : [],
    datasets: [
      {
        label: "Length (cm)",
        data: fetalData.map((data) => data.length || 0),
        backgroundColor: "rgba(255, 140, 148, 0.6)",
        borderColor: "rgba(255, 140, 148, 1)",
        borderWidth: 1,
        barThickness: 15,
      },
      {
        label: "Weight (g)",
        data: fetalData.map((data) => data.weight || 0),
        backgroundColor: "rgba(180, 147, 211, 0.6)",
        borderColor: "rgba(180, 147, 211, 1)",
        borderWidth: 1,
        barThickness: 15,
      },
      {
        label: "Biparietal Diameter (cm)",
        data: fetalData.map((data) => data.biparietalDiameter || 0),
        backgroundColor: "rgba(100, 200, 150, 0.6)",
        borderColor: "rgba(100, 200, 150, 1)",
        borderWidth: 1,
        barThickness: 15,
      },
      {
        label: "Femoral Length (cm)",
        data: fetalData.map((data) => data.femoralLength || 0),
        backgroundColor: "rgba(255, 200, 100, 0.6)",
        borderColor: "rgba(255, 200, 100, 1)",
        borderWidth: 1,
        barThickness: 15,
      },
      {
        label: "Head Circumference (cm)",
        data: fetalData.map((data) => data.headCircumference || 0),
        backgroundColor: "rgba(150, 150, 255, 0.6)",
        borderColor: "rgba(150, 150, 255, 1)",
        borderWidth: 1,
        barThickness: 15,
      },
      {
        label: "Abdominal Circumference (cm)",
        data: fetalData.map((data) => data.abdominalCircumference || 0),
        backgroundColor: "rgba(200, 100, 200, 0.6)",
        borderColor: "rgba(200, 100, 200, 1)",
        borderWidth: 1,
        barThickness: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: { family: "'Georgia', serif", size: 12 },
          color: "#f06292",
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      y: {
        display: true,
        grid: { display: false },
        ticks: { color: "#f06292", font: { family: "'Georgia', serif" } },
      },
      x: {
        ticks: { color: "#f06292", font: { family: "'Georgia', serif" } },
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
        <p className="guest-note">
          Enter gestational age to preview growth (not saved).
        </p>
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
              <Bar data={chartData} options={chartOptions} ref={chartRef} />
              <div className="chart-description">
                <p className="trend">Trending up this month</p>
                <p className="details">
                  Showing growth data for the entered gestational age
                </p>
                <button className="download-button" onClick={downloadChart}>
                  Download Chart
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>
            No fetal growth data available. Enter a gestational age to preview.
          </p>
        )}
        <p className="login-prompt">
          <button onClick={() => navigate("/login")}>Log in</button> to save and
          manage data!
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
              <Bar data={chartData} options={chartOptions} ref={chartRef} />
              <div className="chart-description">
                <p className="trend">Trending up this month</p>
                <p className="details">
                  Showing growth data for the selected profile
                </p>
                <button className="download-button" onClick={downloadChart}>
                  Download Chart
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>
            No fetal growth data available for this profile. Add data to get
            started.
          </p>
        )}
        {isModalOpen && (
          <FetalDataForm
            data={currentEditData}
            onSave={handleSaveFetalData}
            onCancel={handleCloseModal}
            isModal={true}
          />
        )}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="delete-modal-content">
              <p>Are you sure you want to delete this data?</p>
              <div className="delete-modal-actions">
                <button onClick={handleDeleteConfirm}>Delete</button>
                <button onClick={handleDeleteCancel}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderFetalDataTable() {
    if (fetalData.length === 0) {
      return <p>No data to display.</p>;
    }

    return (
      <div className="table-wrapper">
        <table className="fetal-data-table">
          <thead>
            <tr>
              <th>Weeks</th>
              <th>Length (cm)</th>
              <th>Weight (g)</th>
              <th>Biparietal Diameter (cm)</th>
              <th>Femoral Length (cm)</th>
              <th>Head Circumference (cm)</th>
              <th>Abdominal Circumference (cm)</th>
              <th>Notes</th>
              {isAuthenticated && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {fetalData.map((data) => (
              <tr key={data.id || data.weeks || Math.random()}>
                <td>{data.weeks || "N/A"}</td>
                <td>{data.length || "N/A"}</td>
                <td>{data.weight || "N/A"}</td>
                <td>{data.biparietalDiameter || "N/A"}</td>
                <td>{data.femoralLength || "N/A"}</td>
                <td>{data.headCircumference || "N/A"}</td>
                <td>{data.abdominalCircumference || "N/A"}</td>
                <td>{data.notes || "N/A"}</td>
                {isAuthenticated && (
                  <td>
                    <button onClick={() => handleOpenModal(data)}>Edit</button>
                    <button onClick={() => handleDeleteClick(data)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <ToastContainer autoClose={1300} />
      <header className="app-header">
        <div className="logo">
          <span role="img" aria-label="mom-and-baby">
            🤰
          </span>{" "}
          MOM & BABY
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
  const [biparietalDiameter, setBiparietalDiameter] = useState(
    data?.biparietalDiameter || ""
  );
  const [femoralLength, setFemoralLength] = useState(data?.femoralLength || "");
  const [headCircumference, setHeadCircumference] = useState(
    data?.headCircumference || ""
  );
  const [abdominalCircumference, setAbdominalCircumference] = useState(
    data?.abdominalCircumference || ""
  );
  const [notes, setNotes] = useState(data?.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      weeks: parseInt(weeks),
      length: parseFloat(length),
      weight: parseFloat(weight),
      biparietalDiameter: parseFloat(biparietalDiameter),
      femoralLength: parseFloat(femoralLength),
      headCircumference: parseFloat(headCircumference),
      abdominalCircumference: parseFloat(abdominalCircumference),
      notes,
    });
    if (!isModal) {
      setWeeks("");
      setLength("");
      setWeight("");
      setBiparietalDiameter("");
      setFemoralLength("");
      setHeadCircumference("");
      setAbdominalCircumference("");
      setNotes("");
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
        <label>Biparietal Diameter (cm):</label>
        <input
          type="number"
          value={biparietalDiameter}
          onChange={(e) => setBiparietalDiameter(e.target.value)}
          step="0.1"
          required
        />
      </div>
      <div className="form-group">
        <label>Femoral Length (cm):</label>
        <input
          type="number"
          value={femoralLength}
          onChange={(e) => setFemoralLength(e.target.value)}
          step="0.1"
          required
        />
      </div>
      <div className="form-group">
        <label>Head Circumference (cm):</label>
        <input
          type="number"
          value={headCircumference}
          onChange={(e) => setHeadCircumference(e.target.value)}
          step="0.1"
          required
        />
      </div>
      <div className="form-group">
        <label>Abdominal Circumference (cm):</label>
        <input
          type="number"
          value={abdominalCircumference}
          onChange={(e) => setAbdominalCircumference(e.target.value)}
          step="0.1"
          required
        />
      </div>
      <div className="form-group">
        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter notes (optional)"
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
