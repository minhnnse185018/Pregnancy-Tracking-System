import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewAppointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    id: '',
    title: '',
    appointmentDate: '',
    selectedSlot: '',
    description: '',
    status: 'Scheduled',
  });
  const [message, setMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const userId = sessionStorage.getItem('userID');
      if (!userId) {
        setMessage('User not logged in. Please log in first.');
        return;
      }

      const response = await axios.get(`http://localhost:5254/api/appointments/get/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Fetched appointments:', response.data);
      if (Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
        setMessage('Invalid response format from appointments API.');
      }
    } catch (error) {
      setMessage(`Error fetching appointments: ${error.message}`);
      console.error('Fetch error:', error);
    }
  };

  const handleEditClick = (appointment) => {
    if (!appointment || !appointment.id || !appointment.appointmentDate) {
      console.error('Invalid appointment data:', appointment);
      setMessage('Invalid appointment selected.');
      return;
    }
    setSelectedAppointment(appointment);
    const dateTime = new Date(appointment.appointmentDate);
    if (isNaN(dateTime.getTime())) {
      setMessage('Invalid appointment date format.');
      return;
    }
    const formattedDate = dateTime.toISOString().split('T')[0];
    const hours = dateTime.getUTCHours().toString().padStart(2, '0');
    const minutes = dateTime.getUTCMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    setEditFormData({
      id: appointment.id,
      title: appointment.title || '',
      appointmentDate: formattedDate,
      selectedSlot: formattedTime,
      description: appointment.description || '',
      status: appointment.status || 'Scheduled',
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSlotClick = (slot) => {
    setEditFormData((prev) => ({
      ...prev,
      selectedSlot: slot,
    }));
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) {
      setMessage('No appointment selected for update.');
      return;
    }

    if (!editFormData.appointmentDate || !editFormData.selectedSlot) {
      setMessage('Please select both a date and a time slot.');
      return;
    }

    const [hours, minutes] = editFormData.selectedSlot.split(':');
    const selectedDateTime = new Date(`${editFormData.appointmentDate}T${hours}:${minutes}:00Z`);
    if (isNaN(selectedDateTime.getTime())) {
      setMessage('Invalid date or time. Please check your selection.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5254/api/appointments/update`,
        {
          id: parseInt(editFormData.id),
          appointmentDate: selectedDateTime.toISOString(),
          title: editFormData.title,
          description: editFormData.description,
          status: editFormData.status,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Update response:', response.data);
      if (response.status === 200) {
        setMessage('Appointment updated successfully!');
        fetchAppointments();
        setShowEditModal(false);
      } else {
        setMessage('Unexpected response from server.');
      }
    } catch (error) {
      setMessage(`Error updating appointment: ${error.response?.data?.message || error.message}`);
      console.error('Update error:', error.response?.data || error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await axios.delete(`http://localhost:5254/api/appointments/delete/${id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Delete response:', response.data);
        if (response.status === 200) {
          setMessage('Appointment deleted successfully!');
          fetchAppointments();
        } else {
          setMessage('Unexpected response from server.');
        }
      } catch (error) {
        setMessage(`Error deleting appointment: ${error.response?.data?.message || error.message}`);
        console.error('Delete error:', error.response?.data || error);
      }
    }
  };

  const closeToast = () => setMessage('');

  return (
    <div className="va-wrapper">
      <div className="va-top-section">
        <img src="images/favicon.ico" alt="Baby Icon" className="va-baby-icon" />
        <div className="va-title">View Your Appointments</div>
      </div>
      <div className="va-content">
        <div className="va-list">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="va-appointment-item">
                <div>
                  <strong>Title:</strong> {appointment.title || 'N/A'}
                </div>
                <div>
                  <strong>Date:</strong>{' '}
                  {appointment.appointmentDate
                    ? new Date(appointment.appointmentDate).toLocaleDateString()
                    : 'N/A'}
                </div>
                <div>
                  <strong>Time:</strong>{' '}
                  {appointment.appointmentDate
                    ? new Date(appointment.appointmentDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </div>
                <div>
                  <strong>Details:</strong> {appointment.description || 'N/A'}
                </div>
                <div>
                  <strong>Status:</strong> {appointment.status || 'N/A'}
                </div>
                <div className="va-actions">
                  <button onClick={() => handleEditClick(appointment)}>Edit</button>
                  <button onClick={() => handleDelete(appointment.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No appointments found.</p>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="va-modal">
          <div className="va-modal-content">
            <h2>Edit Appointment</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="va-form-group">
                <label>Appointment Title*</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="va-form-group">
                <label>Appointment Date*</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={editFormData.appointmentDate}
                  onChange={handleEditChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="va-form-group">
                <label>Appointment Time*</label>
                <div className="va-time-slots">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={editFormData.selectedSlot === slot ? 'selected' : ''}
                      onClick={() => handleSlotClick(slot)}
                      disabled={!editFormData.appointmentDate}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="va-form-group">
                <label>Details</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows="4"
                />
              </div>
              <div className="va-form-group">
                <label>Status*</label>
                <select name="status" value={editFormData.status} onChange={handleEditChange} required>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending</option>
                  <option value="Ready">Ready</option>
                </select>
              </div>
              <button type="submit" className="va-modal-btn va-save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="va-modal-btn va-cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {message && (
        <div className={`va-toast ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
          <button onClick={closeToast}>Close</button>
        </div>
      )}

      <style jsx>{`
        .va-wrapper {
          padding: 25px;
          max-width: 1200px;
          margin: 0 auto;
          margin-top: 100px;
          font-family: 'Georgia', serif;
          background: #fff7f9;
          border-radius: 20px;
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

        .va-list {
          max-height: 600px;
          overflow-y: auto;
        }

        .va-appointment-item {
          border: 1px solid #f8bbd0;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 10px;
          background: #fffafc;
          transition: transform 0.2s ease;
        }

        .va-appointment-item:hover {
          transform: scale(1.02);
          box-shadow: 0 2px 6px rgba(248, 187, 208, 0.3);
        }

        .va-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .va-actions button {
          padding: 8px 15px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'Georgia', serif;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .va-actions button:first-child {
          background: #ffca28;
          color: #fff;
        }

        .va-actions button:first-child:hover {
          background: #e0b124;
        }

        .va-actions button:last-child {
          background: #d81b60;
          color: #fff;
        }

        .va-actions button:last-child:hover {
          background: #b01550;
        }

        .va-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .va-modal-content {
          background: #fff;
          padding: 30px;
          border-radius: 20px;
          width: 450px;
          box-shadow: 0 4px 12px rgba(248, 187, 208, 0.2);
          border: 1px solid #f8bbd0;
          background: linear-gradient(to bottom, #fceff2, #fff7f9);
        }

        .va-modal-content h2 {
          color: #ec407a;
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
          text-shadow: 1px 1px 2px rgba(236, 64, 122, 0.1);
        }

        .va-form-group {
          margin-bottom: 20px;
        }

        .va-form-group label {
          display: block;
          margin-bottom: 8px;
          color: #ec407a;
          font-size: 16px;
          font-weight: 500;
        }

        .va-form-group input,
        .va-form-group select,
        .va-form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #f8bbd0;
          border-radius: 10px;
          font-family: 'Georgia', serif;
          font-size: 14px;
          background: #fffafc;
          color: #880e4f;
          transition: border-color 0.3s ease;
        }

        .va-form-group input:focus,
        .va-form-group select:focus,
        .va-form-group textarea:focus {
          border-color: #ec407a;
          outline: none;
        }

        .va-time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          gap: 10px;
        }

        .va-time-slots button {
          padding: 8px;
          border: 1px solid #f8bbd0;
          border-radius: 10px;
          background: #fffafc;
          color: #880e4f;
          cursor: pointer;
          font-family: 'Georgia', serif;
          font-size: 14px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .va-time-slots button:hover {
          background: #f8bbd0;
          color: #fff;
        }

        .va-time-slots button.selected {
          background: #ec407a;
          color: #fff;
          border-color: #ec407a;
        }

        .va-modal-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'Georgia', serif;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .va-save-btn {
          background: #ec407a;
          color: #fff;
          margin-right: 10px;
        }

        .va-save-btn:hover {
          background: #d1356b;
        }

        .va-cancel-btn {
          background: #d81b60;
          color: #fff;
        }

        .va-cancel-btn:hover {
          background: #b01550;
        }

        .va-toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 10px 20px;
          border-radius: 10px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          font-family: 'Georgia', serif;
        }

        .va-toast.success {
          background: #2e7d32;
        }

        .va-toast.error {
          background: #d81b60;
        }

        .va-toast button {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          margin-left: 10px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default ViewAppointment;