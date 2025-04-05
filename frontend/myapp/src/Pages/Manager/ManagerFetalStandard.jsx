import axios from "axios";
import React, { useEffect } from "react";

const API_BASE_URL = "http://localhost:5254/api";
function ManagerFetalStandard() {
  const [fetalStandards, setFetalStandards] = React.useState([]);
  const [formData, setFormData] = React.useState({
    id: "",
    week: "",
    weight: "",
    height: "",
    biparietalDiameter: "",
    headCircumference: "",
    abdominalCircumference: "",
  });
  const [searchWeek, setSearchWeek] = React.useState("");

  const fetchStandards = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/FetalStandard`);
      const data = await response.json();
      setFetalStandards(data);
    } catch (error) {
      console.error("Error fetching fetal standards:", error);
    }
  };

  const fetchStandardsById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/FetalStandard/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching fetal standard:", error);
    }
  };

  const fetchStandardsByWeek = async (week) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/FetalStandard/Week/${week}`
      );
      const data = await response.json();
      setFetalStandards(response.data);
    } catch (error) {
      console.error("Error fetching fetal standards by week:", error);
    }
  };

  const createStandard = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/FetalStandard`,
        formData
      );
      setFetalStandards([...fetalStandards, response.data]);
    } catch (error) {
      console.error("Error creating fetal standard:", error);
    }
  };

  const updateStandard = async (id) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/FetalStandard/${id}`,
        formData
      );
      setFetalStandards(
        fetalStandards.map((standard) =>
          standard.id === id ? response.data : standard
        )
      );
    } catch (error) {
      console.error("Error updating fetal standard:", error);
    }
  };

  const deleteStandard = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/FetalStandard/${id}`);
      setFetalStandards(
        fetalStandards.filter((standard) => standard.id !== id)
      );
    } catch (error) {
      console.error("Error deleting fetal standard:", error);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSearchWeek = (e) => {
    if (searchWeek) {
      fetchStandardsByWeek(searchWeek);
    } else {
      fetchStandards();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fetal Growth Standard Manager</h1>

      {/* Form để thêm mới hoặc cập nhật */}
      <div style={{ marginBottom: "20px" }}>
        <h2>{formData.id ? "Update Standard" : "Add New Standard"}</h2>
        <input
          type="text"
          name="week"
          placeholder="Week"
          value={formData.week}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          name="value"
          placeholder="Value"
          value={formData.value}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        />
        {formData.id ? (
          <button onClick={() => updateStandard(formData.id)}>Update</button>
        ) : (
          <button onClick={createStandard}>Add</button>
        )}
      </div>

      {/* Tìm kiếm theo tuần */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Search by Week</h2>
        <input
          type="text"
          placeholder="Enter week"
          value={searchWeek}
          onChange={(e) => setSearchWeek(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleSearchWeek}>Search</button>
      </div>

      {/* Danh sách Fetal Growth Standards */}
      <h2>Standards List</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Week</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fetalStandards.map((standard) => (
            <tr key={standard.id}>
              <td>{standard.id}</td>
              <td>{standard.week}</td>
              <td>{standard.value}</td>
              <td>
                <button
                  onClick={() => fetchStandardsById(standard.id)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>
                <button onClick={() => deleteStandard(standard.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerFetalStandard;
