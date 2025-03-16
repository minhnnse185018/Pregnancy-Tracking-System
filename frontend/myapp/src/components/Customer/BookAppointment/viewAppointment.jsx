import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './viewAppointment.css';
import axios from 'axios';

const MedicalAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState({
    appointmentId: '',
    appointmentDate: '',
    title: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    const userID = sessionStorage.getItem('userID');
    if (!userID) {
      setError('User ID not found. Please log in.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5254/api/appointments/get/${userID}`);
      setAppointments(response.data);
    } catch (err) {
      setError(err.message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  const handleCreateAppointment = () => {
    console.log('Book Appointment clicked');
    navigate('/appointment');
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment({
      appointmentId: appointment.appointmentId, // Using appointmentId instead of userId
      userId: appointment.userId,
      appointmentDate: formatDateForInput(appointment.appointmentDate),
      title: appointment.title,
      description: appointment.description
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Using appointmentId for the update endpoint
      const response = await axios.put(
        `http://localhost:5254/api/appointments/update/${editingAppointment.appointmentId}`,
        editingAppointment
      );
      
      if (response.data && response.data.message === "Appointment updated successfully!") {
        alert('Appointment updated successfully!');
        setIsEditModalOpen(false);
        await fetchAppointments(); // Refresh the appointments list
      }
    } catch (err) {
      alert(`Error updating appointment: ${err.message}`);
      console.error('Error updating appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setLoading(true);
      try {
        const response = await axios.delete(`http://localhost:5254/api/appointments/delete/${id}`);
        
        if (response.data && response.data.message === "Appointment cancelled successfully!") {
          alert('Appointment cancelled successfully!');
          await fetchAppointments(); // Refresh the appointments list
        }
      } catch (err) {
        alert(`Error cancelling appointment: ${err.message}`);
        console.error('Error cancelling appointment:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Edit Appointment Form Component
  const EditAppointmentForm = ({ appointment, onSave, onCancel }) => {
    return (
      <form onSubmit={onSave} className="edit-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={appointment.title}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="datetime-local"
            name="appointmentDate"
            value={appointment.appointmentDate}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={appointment.description}
            onChange={handleEditChange}
            rows="3"
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">Save Changes</button>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading-message">Loading your appointments...</div>;
    }

    if (error) {
      return <div className="error-message">Error: {error}</div>;
    }

    if (appointments.length === 0) {
      return (
        <div className="empty-message">
          No appointments found. Add your first appointment to get started!
        </div>
      );
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return (
      <div className="appointments-grid">
        {appointments.map((appointment) => {
          const appointmentDate = new Date(appointment.appointmentDate);
          const isUpcoming = appointmentDate >= currentDate;
          const statusClass = isUpcoming ? 'status-upcoming' : 'status-past';
          const statusText = isUpcoming ? 'Upcoming' : 'Past';

          return (
            <div className="appointment-card" key={appointment.appointmentId}>
              <h2 className="appointment-title">{appointment.title}</h2>
              <div className="appointment-field">
                <span className="field-label">Date</span>
                <span>{formatDate(appointment.appointmentDate)}</span>
              </div>
              <div className="appointment-field">
                <span className="field-label">Notes</span>
                <span>{appointment.description || 'No details provided'}</span>
              </div>
              <div className="appointment-field">
                <span className="field-label">Status</span>
                <span className={statusClass}>{statusText}</span>
              </div>
              <div className="appointment-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEditAppointment(appointment)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteAppointment(appointment.appointmentId)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="appointments-container">
      <h1 className="appointments-title">Medical Appointments</h1>
      <button className="create-appointment-button" onClick={handleCreateAppointment}>
        Book Appointment
      </button>
      <div className="appointments-content">{renderContent()}</div>
      
      {/* Edit Modal using the style you provided */}
      {isEditModalOpen && (
        <div className="preg-modal-overlay">
          <div className="preg-modal-container">
            <div className="preg-modal-header">
              <h2>Edit Appointment</h2>
              <button
                className="preg-close-button"
                onClick={handleCloseEditModal}
              >
                ×
              </button>
            </div>
            <div className="preg-modal-body">
              <EditAppointmentForm
                appointment={editingAppointment}
                onSave={handleSaveEdit}
                onCancel={handleCloseEditModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalAppointments;