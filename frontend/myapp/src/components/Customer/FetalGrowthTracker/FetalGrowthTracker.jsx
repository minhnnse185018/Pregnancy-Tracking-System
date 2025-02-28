import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './FetalGrowthTracker.css';

function FetalGrowthTracker() {
  const [week, setWeek] = useState('');
  const [weight, setWeight] = useState(''); // Weight in kg
  const [height, setHeight] = useState('');
  const [growthData, setGrowthData] = useState([]);
  const [latestEntry, setLatestEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/fetal-growth'; // Adjust to your API endpoint

  // Check authentication status manually using sessionStorage
  const hasToken = !!sessionStorage.getItem('token');

  // Load initial data based on authentication status
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (hasToken) {
        // Authenticated user: Fetch from API
        try {
          const token = sessionStorage.getItem('token');
          const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setGrowthData(response.data);
        } catch (err) {
          console.error('Fetch error:', err.response ? err.response.data : err.message);
          setError('Không thể tải dữ liệu từ server. Vui lòng thử lại sau.');
        }
      } else {
        // Guest: Load from localStorage
        const savedData = localStorage.getItem('guestFetalGrowthData');
        setGrowthData(savedData ? JSON.parse(savedData) : []);
      }
      setLoading(false);
    };
    fetchData();
  }, [hasToken]); // Re-run when hasToken changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!week || !weight || !height) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const newEntry = {
      week: parseInt(week),
      weight: parseFloat(weight),
      height: parseFloat(height),
    };

    setLoading(true);
    if (hasToken) {
      // Authenticated user: Save to API
      try {
        const token = sessionStorage.getItem('token');
        console.log('Submitting with token:', token, 'Data:', newEntry); // Debug
        const response = await axios.post(API_URL, newEntry, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedData = [...growthData.filter((entry) => entry.week !== newEntry.week), response.data];
        setGrowthData(updatedData);
        setLatestEntry(response.data);
      } catch (err) {
        console.error('API Error:', err.response ? err.response.data : err.message);
        setError(`Không thể lưu dữ liệu: ${err.response ? err.response.data.message || err.response.statusText : err.message}`);
      }
    } else {
      // Guest: Save to localStorage
      const updatedData = [...growthData.filter((entry) => entry.week !== newEntry.week), newEntry];
      setGrowthData(updatedData);
      setLatestEntry(newEntry);
      localStorage.setItem('guestFetalGrowthData', JSON.stringify(updatedData));
    }

    // Clear form
    setWeek('');
    setWeight('');
    setHeight('');
    setLoading(false);
  };

  // Prepare chart data
  const chartData = growthData.map((entry) => ({
    week: `Tuần ${entry.week}`,
    oldWeight: entry.week !== latestEntry?.week ? entry.weight : null,
    oldHeight: entry.week !== latestEntry?.week ? entry.height : null,
    newWeight: entry.week === latestEntry?.week ? entry.weight : null,
    newHeight: entry.week === latestEntry?.week ? entry.height : null,
  }));

  return (
    <div className="growth-tracker-container">
      <h1 className="tracker-title">Theo dõi tăng trưởng thai nhi</h1>
      <p className="tracker-description">
        Nhập thông tin để theo dõi và so sánh sự tăng trưởng của bé qua các tuần!{' '}
        {hasToken ? 'Dữ liệu của bạn sẽ được lưu trên server.' : 'Bạn đang ở chế độ khách - dữ liệu lưu cục bộ.'}
      </p>

      {/* Form Input */}
      <Form className="growth-form" onSubmit={handleSubmit}>
        <Form.Group controlId="week">
          <Form.Label>Tuần thai kỳ</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="40"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            placeholder="Nhập tuần (1-40)"
            disabled={loading}
          />
        </Form.Group>
        <Form.Group controlId="weight">
          <Form.Label>Cân nặng (kg)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Nhập cân nặng (kg)"
            disabled={loading}
          />
        </Form.Group>
        <Form.Group controlId="height">
          <Form.Label>Chiều cao (cm)</Form.Label>
          <Form.Control
            type="number"
            step="0.1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Nhập chiều cao (cm)"
            disabled={loading}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Thêm dữ liệu'}
        </Button>
      </Form>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading-message">Đang tải dữ liệu...</p>
      ) : growthData.length > 0 ? (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                label={{ value: 'Tuần thai kỳ', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis
                label={{ value: 'Giá trị (kg/cm)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name.includes('Weight')) return [`${value} kg`, name];
                  return [`${value} cm`, name];
                }}
              />
              <Legend />
              <Bar dataKey="oldWeight" name="Cân nặng cũ (kg)" fill="#ff9999" />
              <Bar dataKey="newWeight" name="Cân nặng mới (kg)" fill="#ff6f91" />
              <Bar dataKey="oldHeight" name="Chiều cao cũ (cm)" fill="#99ccff" />
              <Bar dataKey="newHeight" name="Chiều cao mới (cm)" fill="#4a90e2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="no-data">Chưa có dữ liệu. Hãy thêm thông tin để xem biểu đồ!</p>
      )}
    </div>
  );
}

export default FetalGrowthTracker;