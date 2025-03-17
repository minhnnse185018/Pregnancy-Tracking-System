import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ViewAppointment = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    appointmentDate: '',
    description: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [location.state?.refresh]); // Re-fetch only when refresh state is true

  const fetchAppointments = async () => {
    const userId = sessionStorage.getItem('userID');
    if (!userId) {
      setError('Please log in to view your appointments');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5254/api/appointments/get/${userId}`);
      // Handle both single object and array response
      const appointmentData = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
      setAppointments(appointmentData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err.response ? err.response.data : err.message);
      setError('Unable to load your appointments. Please try again later!');
      setLoading(false);
      setAppointments([]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userID');
    const selectedDateTime = formData.appointmentDate
      ? new Date(`${formData.appointmentDate}T${new Date().toTimeString().split(' ')[0]}`).toISOString()
      : null;

    const data = {
      userId: parseInt(userId),
      appointmentDate: selectedDateTime,
      title: formData.title,
      description: formData.description,
    };

    try {
      await axios.put(`http://localhost:5254/api/appointments/update/${editId}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      setFormData({ title: '', appointmentDate: '', description: '' });
      setEditId(null);
      fetchAppointments();
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError('Unable to update the appointment. Please try again!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`http://localhost:5254/api/appointments/delete/${id}`);
        fetchAppointments();
      } catch (err) {
        console.error('Error deleting appointment:', err);
        setError('Unable to delete the appointment. Please try again!');
      }
    }
  };

  const handleEdit = (appointment) => {
    setEditId(appointment.userId);
    setFormData({
      title: appointment.title,
      appointmentDate: new Date(appointment.appointmentDate).toISOString().split('T')[0],
      description: appointment.description || '',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="va-wrapper">
      <div className="va-top-section">
        <img src="images/favicon.ico" alt="Baby Icon" className="va-baby-icon" />
        <div className="va-title">Your Pregnancy Appointments</div>
      </div>
      <div className="va-content">
        {loading ? (
          <div className="va-loading">Loading your appointments...</div>
        ) : error ? (
          <div className="va-error">{error}</div>
        ) : !appointments.length ? (
          <div className="va-empty">
            <img src="images/pregnant-icon.png" alt="Pregnant Icon" className="va-empty-icon" />
            <p>You have no appointments. Book one now!</p>
          </div>
        ) : (
          <>
            {editId && (
              <div className="va-form">
                <h3>Edit Appointment</h3>
                <form onSubmit={handleUpdate}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Details"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <button type="submit">Update</button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setFormData({ title: '', appointmentDate: '', description: '' });
                    }}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
            <div className="va-appointments">
              {appointments.map((appointment) => (
                <div key={appointment.userId} className="va-card">
                  <div className="va-card-top">
                    <span className="va-card-icon">🤰</span>
                    <div className="va-card-title">{appointment.title}</div>
                  </div>
                  <p className="va-card-time">
                    <strong>Time:</strong> {formatDateTime(appointment.appointmentDate)}
                  </p>
                  <p className="va-card-desc">
                    <strong>Details:</strong> {appointment.description || 'No details provided'}
                  </p>
                  <div className="va-card-actions">
                    <button onClick={() => handleEdit(appointment)}>Edit</button>
                    <button onClick={() => handleDelete(appointment.userId)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="va-refresh-btn" onClick={fetchAppointments}>
              Refresh Appointments
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .va-wrapper {
          padding: 25px;
          max-width: 1200px;
          margin: 0 auto;
          margin-top: 100px;
          font-family: 'Georgia', serif;
          background: #fff7f9;
        }

        .va-top-section {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 35px;
          background: linear-gradient(to right, #f8e1e9, #fceff2);
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(248, 187, 208, 0.2);
        }

        .va-baby-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #fff;
          padding: 8px;
          border: 2px solid #f8bbd0;
        }

        .va-title {
          color: #ec407a;
          font-size: 28px;
          font-weight: 500;
          text-shadow: 1px 1px 3px rgba(236, 64, 122, 0.1);
        }

        .va-content {
          padding: 30px;
          background: #ffffff;
          border-radius: 25px;
          box-shadow: 0 4px 12px rgba(248, 187, 208, 0.15);
          border: 1px solid #fce4ec;
        }

        .va-loading {
          text-align: center;
          color: #f06292;
          font-size: 18px;
          padding: 35px;
          font-style: italic;
          background: #fff1f5;
          border-radius: 15px;
        }

        .va-error {
          text-align: center;
          color: #d81b60;
          font-size: 18px;
          padding: 35px;
          background: #ffebee;
          border-radius: 15px;
          border: 1px dashed #f48fb1;
        }

        .va-empty {
          text-align: center;
          padding: 50px;
          color: #f06292;
        }

        .va-empty-icon {
          width: 90px;
          height: 90px;
          margin-bottom: 20px;
          opacity: 0.7;
          filter: drop-shadow(0 2px 4px rgba(240, 98, 146, 0.2));
        }

        .va-empty p {
          font-size: 18px;
          margin: 0;
          font-style: italic;
          color: #ec407a;
        }

        .va-appointments {
          display: grid;
          gap: 25px;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        }

        .va-card {
          padding: 25px;
          border: 2px solid #f8bbd0;
          border-radius: 20px;
          background: #fffafc;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .va-card:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 18px rgba(248, 187, 208, 0.25);
        }

        .va-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .va-card-icon {
          font-size: 28px;
          background: #fce4ec;
          padding: 8px;
          border-radius: 50%;
        }

        .va-card-title {
          margin: 0;
          color: #ec407a;
          font-size: 20px;
          font-weight: 500;
        }

        .va-card-time {
          margin: 10px 0;
          color: #f06292;
          font-size: 16px;
        }

        .va-card-desc {
          margin: 10px 0;
          color: #880e4f;
          font-size: 16px;
          line-height: 1.5;
        }

        .va-card strong {
          color: #d81b60;
          font-weight: 600;
        }

        .va-card-actions {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }

        .va-card-actions button {
          padding: 8px 15px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
        }

        .va-card-actions button:first-child {
          background: #ffca28;
          color: #fff;
        }

        .va-card-actions button:last-child {
          background: #ef5350;
          color: #fff;
        }

        .va-form {
          margin-bottom: 30px;
          padding: 20px;
          background: #fff1f5;
          border-radius: 15px;
          border: 1px solid #f8bbd0;
        }

        .va-form h3 {
          color: #ec407a;
          margin-bottom: 15px;
        }

        .va-form input,
        .va-form textarea {
          display: block;
          width: 100%;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #f8bbd0;
          border-radius: 10px;
          font-family: 'Georgia', serif;
        }

        .va-form button {
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          background: #ec407a;
          color: #fff;
          cursor: pointer;
          margin-right: 10px;
        }

        .va-form button:last-child {
          background: #ef5350;
        }

        .va-refresh-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          background: #ffca28;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
          margin-top: 15px;
          display: block;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default ViewAppointment;