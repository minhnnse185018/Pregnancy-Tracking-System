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
  const [weight, setWeight] = useState(''); // gram
  const [height, setHeight] = useState(''); // cm
  const [week, setWeek] = useState(''); // Tuần thai
  const [notes, setNotes] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5254';
  const API_ENDPOINTS = {
    getAll: '/api/FetalMeasurement/GetAllGrowth',
    create: '/api/FetalMeasurement/CreateGrowth',
    update: (id) => `/api/FetalMeasurement/UpdateGrowth/${id}`,
    delete: (id) => `/api/FetalMeasurement/DeleteGrowth/${id}`,
  };

  const profileId = 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.getAll}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transformedData = response.data.map(item => ({
          id: item.id,
          weight: item.weightGrams, // Giữ nguyên gram
          height: item.heightCm,
          week: item.week || Math.floor((new Date(item.measurementDate) - new Date('2025-01-01')) / (7 * 24 * 60 * 60 * 1000)), // Chuyển sang tuần
          notes: item.notes || 'No notes',
        }));
        
        // Sắp xếp theo tuần tăng dần
        const sortedData = transformedData.sort((a, b) => a.week - b.week);
        setGrowthData(sortedData);
      } catch (err) {
        console.error('Fetch error:', err.response ? err.response.data : err.message);
        setError(`Error loading data: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!weight || !height || !week) {
      setError('Please fill in all required fields (weight, height, week)!');
      return;
    }

    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);
    const weekValue = parseInt(week);
    
    if (isNaN(weightValue) || isNaN(heightValue) || isNaN(weekValue)) {
      setError('Weight, height must be valid numbers and week must be a valid integer!');
      return;
    }

    if (weekValue < 1 || weekValue > 42) {
      setError('Week must be between 1 and 42!');
      return;
    }

    const data = {
      profileId,
      weightGrams: weightValue,
      heightCm: heightValue,
      week: weekValue,
      notes: notes || '',
    };

    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      if (editId) {
        await axios.put(`${API_BASE_URL}${API_ENDPOINTS.update(editId)}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json-patch+json',
          },
        });
        setGrowthData(growthData.map(item =>
          item.id === editId ? { ...item, weight: weightValue, height: heightValue, week: weekValue, notes } : item
        ));
        setEditId(null);
      } else {
        const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.create}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json-patch+json',
          },
        });
        const newData = [...growthData, { 
          id: response.data.id, 
          weight: weightValue, 
          height: heightValue, 
          week: weekValue,
          notes: response.data.notes 
        }];
        setGrowthData(newData.sort((a, b) => a.week - b.week));
      }
      resetForm();
    } catch (err) {
      console.error('Save error:', err.response ? err.response.data : err.message);
      setError(`Error saving data: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  const handleEdit = (item) => {
    setEditId(item.id);
    setWeight(item.weight.toString());
    setHeight(item.height.toString());
    setWeek(item.week.toString());
    setNotes(item.notes);
  };

  const resetForm = () => {
    setWeight('');
    setHeight('');
    setWeek('');
    setNotes('');
    setEditId(null);
  };

  const chartData = growthData.map(item => ({
    week: `Week ${item.week}`,
    weight: item.weight,
    height: item.height,
  }));

  return (
    <div className="growth-tracker-container">
      <h1 className="tracker-title">Fetal Growth Tracker</h1>
      <p className="tracker-description">Easily input and manage your baby’s growth data!</p>

      <div className="data-entry-form">
        {error && <p className="error-message">{error}</p>}
        <Form onSubmit={handleSave} className="growth-form">
          <div className="form-row">
            <Form.Group controlId="weight" className="mb-3">
              <Form.Label>Weight (grams)</Form.Label>
              <Form.Control
                type="number"
                step="1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight (grams)"
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
            <Form.Group controlId="week" className="mb-3">
              <Form.Label>Week</Form.Label>
              <Form.Control
                type="number"
                step="1"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                placeholder="Enter week (1-42)"
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
          <Table striped bordered hover responsive className="growth-table mt-4">
            <thead>
              <tr>
                <th>ID</th>
                <th>Weight (grams)</th>
                <th>Height (cm)</th>
                <th>Week</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {growthData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.weight}</td>
                  <td>{item.height}</td>
                  <td>{item.week}</td>
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

          <div className="chart-container mt-4">
            <h2 className="chart-title">Growth Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="week" label={{ value: 'Week', position: 'insideBottomRight', offset: -10 }} style={{ fontSize: '14px' }} />
                <YAxis
                  label={{ value: 'Value (g/cm)', angle: -90, position: 'insideLeft' }}
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => (value ? `${value} g` : '')}
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => (value ? `${value} cm` : '')}
                  style={{ fontSize: '14px' }}
                />
                <Tooltip
                      formatter={(value, name) => {
                        if (name === 'weight') {
                          return [`${value} g`, 'Weight'];
                        }
                        if (name === 'height') {
                          return [`${value} cm`, 'Height'];
                        }
                        return [value, name]; // Default case
                      }}
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                      }}
                    />

                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Bar dataKey="weight" name="Weight (grams)" fill="#FF9999" yAxisId="left" barSize={20} />
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