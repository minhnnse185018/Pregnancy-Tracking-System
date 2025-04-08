import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useRef, useState } from "react"; // Added useRef
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./FetalGrowthTracker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TOTAL_WEEKS = 40; // Maximum weeks for pregnancy tracking

function FetalGrowthTracker() {
  const [gestationalAge, setGestationalAge] = useState("");
  const [fetalData, setFetalData] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, id: null });
  const navigate = useNavigate();
  const chartRef = useRef(null); // Ref to access the chart instance

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

    fetch(
      `http://localhost:5254/api/PregnancyProfile/GetProfilesByUserId/${userId}`
    )
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
    fetch(
      `http://localhost:5254/api/FetalMeasurement/GetGrowthByProfile/${profileId}`
    )
      .then((response) => {
        if (!response.ok) return [];
        return response.json();
      })
      .then((data) => {
        const profile = userProfiles.find((p) => p.id === profileId);
        const conceptionDate = profile
          ? new Date(profile.conceptionDate)
          : null;
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
            height: item.heightCm || 0,
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
        height: (weeks * 0.5).toFixed(1),
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
    console.log("Selected profile ID:", profileId); // Add logging for debugging
    
    // Find the selected profile from userProfiles
    const profile = userProfiles.find((p) => p.id === parseInt(profileId));
    
    if (profile) {
      console.log("Found profile:", profile); // Add logging for debugging
      setSelectedProfile(profile);
      fetchFetalData(parseInt(profileId));
    } else {
      console.error("Profile not found for ID:", profileId);
    }
  }

  function handleOpenModal(data = null) {
    setCurrentEditData(data);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setCurrentEditData(null);
  }

  function handleDeleteClick(id) {
    setDeleteConfirmation({ show: true, id });
  }

  async function handleDeleteConfirm() {
    const id = deleteConfirmation.id;
    try {
      const response = await fetch(
        `http://localhost:5254/api/FetalMeasurement/DeleteGrowth/${id}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );

      if (response.ok) {
        toast.success("Data deleted successfully!");
        fetchFetalData(selectedProfile.id);
      } else {
        throw new Error(`Failed to delete data: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deleting fetal data:", err);
      toast.error(`Failed to delete data: ${err.message}`);
    } finally {
      setDeleteConfirmation({ show: false, id: null });
    }
  }

  async function handleSaveFetalData(updatedData) {
    const payload = {
      profileId: selectedProfile.id,
      weightGrams: updatedData.weight,
      heightCm: updatedData.height,
      biparietalDiameterCm: updatedData.biparietalDiameter,
      femoralLengthCm: updatedData.femoralLength,
      headCircumferenceCm: updatedData.headCircumference,
      abdominalCircumferenceCm: updatedData.abdominalCircumference,
      notes: updatedData.notes,
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

  // Function to download the chart as an image
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
    labels: fetalData.map((data) => `Week ${data.weeks || "N/A"}`),
    datasets: [
      {
        label: "Height (cm)",
        data: fetalData.map((data) => data.height || 0),
        borderColor: "rgba(255, 140, 148, 1)",
        backgroundColor: "rgba(255, 140, 148, 0.2)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: "Weight (g)",
        data: fetalData.map((data) => data.weight || 0),
        borderColor: "rgba(180, 147, 211, 1)",
        backgroundColor: "rgba(180, 147, 211, 0.2)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: "Biparietal Diameter (cm)",
        data: fetalData.map((data) => data.biparietalDiameter || 0),
        borderColor: "rgba(100, 200, 150, 1)",
        backgroundColor: "rgba(100, 200, 150, 0.2)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: "Femoral Length (cm)",
        data: fetalData.map((data) => data.femoralLength || 0),
        borderColor: "rgba(255, 200, 100, 1)",
        backgroundColor: "rgba(255, 200, 100, 0.2)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: "Head Circumference (cm)",
        data: fetalData.map((data) => data.headCircumference || 0),
        borderColor: "rgba(150, 150, 255, 1)",
        backgroundColor: "rgba(150, 150, 255, 0.2)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: "Abdominal Circumference (cm)",
        data: fetalData.map((data) => data.abdominalCircumference || 0),
        borderColor: "rgba(200, 100, 200, 1)",
        backgroundColor: "rgba(200, 100, 200, 0.2)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
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
          font: { family: "'Poppins', sans-serif", size: 12 },
          color: "#5c4b7d",
          usePointStyle: true,
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            let value = context.parsed.y;
            
            if (label) {
              if (label.includes('Weight')) {
                label += `: ${value.toFixed(1)}g`;
              } else {
                label += `: ${value.toFixed(1)}cm`;
              }
            }
            return label;
          }
        },
        padding: 10,
        displayColors: true,
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Measurements (cm)',
          color: "#5c4b7d",
        },
        grid: { 
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: { 
          color: "#5c4b7d", 
          font: { family: "'Poppins', sans-serif" } 
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Weight (g)',
          color: "rgba(180, 147, 211, 1)",
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: { 
          color: "rgba(180, 147, 211, 1)", 
          font: { family: "'Poppins', sans-serif" } 
        },
      },
      x: {
        ticks: { 
          color: "#5c4b7d", 
          font: { family: "'Poppins', sans-serif" } 
        },
        grid: { 
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      }
    }
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
            max={TOTAL_WEEKS}
            required
          />
        </div>
        {fetalData.length > 0 ? (
          <>
            {renderFetalDataTable()}
            <div className="chart-container">
              <div className="chart-wrapper">
                <Line data={chartData} options={chartOptions} ref={chartRef} />
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
            <div className="chart-container">
              <div className="chart-wrapper">
                <Line data={chartData} options={chartOptions} ref={chartRef} />
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
        {deleteConfirmation.show && (
          <div className="modal-overlay">
            <div className="modal-container" style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this measurement? This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => setDeleteConfirmation({ show: false, id: null })}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f8bbd0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
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
              <th>Height (cm)</th>
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
                <td>{data.height || "N/A"}</td>
                <td>{data.weight || "N/A"}</td>
                <td>{data.biparietalDiameter || "N/A"}</td>
                <td>{data.femoralLength || "N/A"}</td>
                <td>{data.headCircumference || "N/A"}</td>
                <td>{data.abdominalCircumference || "N/A"}</td>
                <td>{data.notes || "N/A"}</td>
                {isAuthenticated && (
                  <td>
                    <button onClick={() => handleOpenModal(data)}>Edit</button>
                    <button onClick={() => handleDeleteClick(data.id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const ProfileSelector = () => (
    <div className="profile-selector">
      <label htmlFor="profileSelect">Select Pregnancy Profile:</label>
      <select
        id="profileSelect"
        value={selectedProfile?.id || ""}
        onChange={handleProfileChange}
        className="profile-select"
      >
        {userProfiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name || `Profile ${profile.id}`} -{" "}
            {new Date(profile.conceptionDate).toLocaleDateString()}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="app-wrapper">
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
  const [height, setHeight] = useState(data?.height || "");
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

  const handleNumberInput = (value, setter) => {
    const numValue = parseFloat(value);
    if (numValue < 0) {
      toast.error("Value cannot be negative");
      setter("0");
    } else {
      setter(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add validation for negative values
    if (parseFloat(height) < 0 || 
        parseFloat(weight) < 0 || 
        parseFloat(biparietalDiameter) < 0 || 
        parseFloat(femoralLength) < 0 || 
        parseFloat(headCircumference) < 0 || 
        parseFloat(abdominalCircumference) < 0) {
      toast.error("Measurements cannot be negative!");
      return;
    }

    onSave({
      weeks: parseInt(weeks),
      height: parseFloat(height),
      weight: parseFloat(weight),
      biparietalDiameter: parseFloat(biparietalDiameter),
      femoralLength: parseFloat(femoralLength),
      headCircumference: parseFloat(headCircumference),
      abdominalCircumference: parseFloat(abdominalCircumference),
      notes,
    });
    if (!isModal) {
      setWeeks("");
      setHeight("");
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
          onChange={(e) => handleNumberInput(e.target.value, setWeeks)}
          min="1"
          max={TOTAL_WEEKS}
          required
        />
      </div>
      <div className="form-group">
        <label>Height (cm):</label>
        <input
          type="number"
          value={height}
          onChange={(e) => handleNumberInput(e.target.value, setHeight)}
          step="0.1"
          min="0"
          required
        />
      </div>
      <div className="form-group">
        <label>Weight (g):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => handleNumberInput(e.target.value, setWeight)}
          min="0"
          required
        />
      </div>
      <div className="form-group">
        <label>Biparietal Diameter (cm):</label>
        <input
          type="number"
          value={biparietalDiameter}
          onChange={(e) => handleNumberInput(e.target.value, setBiparietalDiameter)}
          step="0.1"
          min="0"
          required
        />
      </div>
      <div className="form-group">
        <label>Femoral Length (cm):</label>
        <input
          type="number"
          value={femoralLength}
          onChange={(e) => handleNumberInput(e.target.value, setFemoralLength)}
          step="0.1"
          min="0"
          required
        />
      </div>
      <div className="form-group">
        <label>Head Circumference (cm):</label>
        <input
          type="number"
          value={headCircumference}
          onChange={(e) => handleNumberInput(e.target.value, setHeadCircumference)}
          step="0.1"
          min="0"
          required
        />
      </div>
      <div className="form-group">
        <label>Abdominal Circumference (cm):</label>
        <input
          type="number"
          value={abdominalCircumference}
          onChange={(e) => handleNumberInput(e.target.value, setAbdominalCircumference)}
          step="0.1"
          min="0"
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