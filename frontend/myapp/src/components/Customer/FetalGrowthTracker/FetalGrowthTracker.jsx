import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './FetalGrowthTracker.css';

const FetalGrowthTracker = () => {
  const [growthData, setGrowthData] = useState([]);
  const [weight, setWeight] = useState(''); // kg
  const [height, setHeight] = useState(''); // cm
  const [measurementDate, setMeasurementDate] = useState(''); // YYYY-MM-DD
  const [notes, setNotes] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL and endpoints
  const API_BASE_URL = 'http://localhost:5254';
  const API_ENDPOINTS = {
    getAll: '/api/FetalMeasurement/GetAllGrowth',
    create: '/api/FetalMeasurement/CreateGrowth',
    update: (id) => `/api/FetalMeasurement/UpdateGrowth/${id}`,
    delete: (id) => `/api/FetalMeasurement/DeleteGrowth/${id}`,
  };

  // Mock profileId (must be an integer, adjust based on your auth system)
  const profileId = 1; // Changed to integer to match API expectation

  // Fetch all growth data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.getAll}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API GetAll Response:', response.data);

        const transformedData = response.data.map(item => ({
          id: item.id,
          weight: item.weightGrams / 1000, // Convert grams to kg
          height: item.heightCm,
          measurementDate: item.measurementDate.split('T')[0], // Extract YYYY-MM-DD
          notes: item.notes || 'No notes',
        }));
        setGrowthData(transformedData);
      } catch (err) {
        console.error('Fetch error:', err.response ? err.response.data : err.message);
        setError(`Error loading data: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Create/Update
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate input
    if (!weight || !height || !measurementDate) {
      setError('Please fill in all required fields (weight, height, measurement date)!');
      return;
    }

    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);
    if (isNaN(weightValue) || isNaN(heightValue)) {
      setError('Weight and height must be valid numbers!');
      return;
    }

    // Validate measurementDate (ensure it's in YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(measurementDate)) {
      setError('Measurement date must be in YYYY-MM-DD format!');
      return;
    }

    // Convert measurementDate to ISO format
    let isoDate;
    try {
      const [year, month, day] = measurementDate.split('-');
      isoDate = new Date(year, month - 1, day).toISOString(); // month is 0-based in JS
    } catch (err) {
      setError('Invalid measurement date!');
      return;
    }

    // Prepare data for API
    const data = {
      profileId,
      weightGrams: weightValue * 1000, // Convert kg to grams
      heightCm: heightValue,
      measurementDate: isoDate, // Send in ISO format
      notes: notes || '', // Send empty string if no notes, instead of null
    };

    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      if (editId) {
        // Update
        await axios.put(`${API_BASE_URL}${API_ENDPOINTS.update(editId)}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json-patch+json',
          },
        });
        setGrowthData(growthData.map(item =>
          item.id === editId ? { ...item, weight: weightValue, height: heightValue, measurementDate, notes } : item
        ));
        setEditId(null);
      } else {
        // Create
        const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.create}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json-patch+json',
          },
        });
        console.log('Create Response:', response.data);
        setGrowthData([...growthData, { 
          id: response.data.id, 
          weight: weightValue, 
          height: heightValue, 
          measurementDate: response.data.measurementDate.split('T')[0], // Extract YYYY-MM-DD
          notes: response.data.notes 
        }]);
      }
      resetForm();
    } catch (err) {
      console.error('Save error:', err.response ? err.response.data : err.message);
      setError(`Error saving data: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.delete(id)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGrowthData(growthData.filter(item => item.id !== id));
      } catch (err) {
        console.error('Delete error:', err.response ? err.response.data : err.message);
        setError(`Error deleting data: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Edit
  const handleEdit = (item) => {
    setEditId(item.id);
    setWeight(item.weight.toString());
    setHeight(item.height.toString());
    setMeasurementDate(item.measurementDate);
    setNotes(item.notes);
  };

  // Reset form
  const resetForm = () => {
    setWeight('');
    setHeight('');
    setMeasurementDate('');
    setNotes('');
    setEditId(null);
  };

  // Prepare chart data
  const chartData = growthData.map(item => ({
    date: item.measurementDate,
    weight: item.weight,
    height: item.height,
  }));

  return (
    <div className="growth-tracker-container">
      <h1 className="tracker-title">Fetal Growth Tracker</h1>
      <p className="tracker-description">Easily input and manage your baby’s growth data!</p>

      {/* Data Entry Form */}
      <div className="data-entry-form">
        {error && <p className="error-message">{error}</p>}
        <Form onSubmit={handleSave} className="growth-form">
          <div className="form-row">
            <Form.Group controlId="weight" className="mb-3">
              <Form.Label>Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight (kg)"
                disabled={loading}
                className="form-control"
              />
            </Form.Group>
            <Form.Group controlId="height" className="mb-3">
              <Form.Label>Height (cm)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter height (cm)"
                disabled={loading}
                className="form-control"
              />
            </Form.Group>
            <Form.Group controlId="measurementDate" className="mb-3">
              <Form.Label>Measurement Date (YYYY-MM-DD)</Form.Label>
              <Form.Control
                type="date"
                value={measurementDate}
                onChange={(e) => setMeasurementDate(e.target.value)}
                placeholder="Select date (YYYY-MM-DD)"
                disabled={loading}
                className="form-control"
              />
            </Form.Group>
          </div>
          <Form.Group controlId="notes" className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes (optional)"
              disabled={loading}
              className="form-control"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="save-button" disabled={loading}>
            {loading ? 'Processing...' : editId ? 'Update' : 'Add'}
          </Button>
          {editId && (
            <Button variant="secondary" onClick={resetForm} className="cancel-button ms-2" disabled={loading}>
              Cancel
            </Button>
          )}
        </Form>
      </div>

      {loading ? (
        <div className="loading-container">
          <p className="loading-message">Loading data...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      ) : growthData.length > 0 ? (
        <>
          {/* Data Management Table */}
          <Table striped bordered hover responsive className="growth-table mt-4">
            <thead>
              <tr>
                <th>ID</th>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
                <th>Measurement Date (YYYY-MM-DD)</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {growthData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.weight.toFixed(2)}</td>
                  <td>{item.height}</td>
                  <td>{item.measurementDate}</td>
                  <td>{item.notes}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleEdit(item)} className="me-2 action-button">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)} className="action-button">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Chart */}
          <div className="chart-container mt-4">
            <h2 className="chart-title">Growth Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" label={{ value: 'Measurement Date', position: 'insideBottomRight', offset: -10 }} style={{ fontSize: '14px' }} />
                <YAxis
                  label={{ value: 'Value (kg/cm)', angle: -90, position: 'insideLeft' }}
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => (value ? `${value} kg` : '')}
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => (value ? `${value} cm` : '')}
                  style={{ fontSize: '14px' }}
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === 'weight' ? [`${value} kg`, 'Weight'] : [`${value} cm`, 'Height']
                  }
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Bar dataKey="weight" name="Weight (kg)" fill="#FF9999" yAxisId="left" barSize={20} />
                <Bar dataKey="height" name="Height (cm)" fill="#66B2B2" yAxisId="right" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="no-data-container">
          <p className="no-data">No data available. Please add information to view the chart!</p>
        </div>
      )}
    </div>
  );
};

export default FetalGrowthTracker;