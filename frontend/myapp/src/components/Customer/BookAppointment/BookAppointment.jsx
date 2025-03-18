import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    appointmentDate: '',
    selectedSlot: '',
    description: '',
    status: 'Scheduled',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSlotClick = (slot) => {
    setFormData((prev) => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.appointmentDate || !formData.selectedSlot) {
      setMessage('Please select both a date and a time slot.');
      return;
    }

    const [hours, minutes] = formData.selectedSlot.split(':');
    const selectedDateTime = new Date(`${formData.appointmentDate}T${hours}:${minutes}:00Z`);
    if (isNaN(selectedDateTime.getTime())) {
      setMessage('Invalid date or time. Please check your selection.');
      return;
    }

    try {
      const userId = sessionStorage.getItem('userID');
      if (!userId) {
        setMessage('User not logged in. Please log in first.');
        return;
      }

      const response = await axios.post(
        `http://localhost:5254/api/appointments`,
        {
          userId: parseInt(userId),
          appointmentDate: selectedDateTime.toISOString(),
          title: formData.title,
          description: formData.description,
          status: formData.status,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Book response:', response.data);
      if (response.status === 200 || response.status === 201) {
        setMessage('Appointment booked successfully!');
        setFormData({
          title: '',
          appointmentDate: '',
          selectedSlot: '',
          description: '',
          status: 'Scheduled',
        });
      } else {
        setMessage('Unexpected response from server.');
      }
    } catch (error) {
      setMessage(`Error booking appointment: ${error.response?.data?.message || error.message}`);
      console.error('Book error:', error.response?.data || error);
    }
  };

  const closeToast = () => setMessage('');

  return (
    <div className="ba-wrapper">
      <div className="ba-top-section">
        <img src="images/favicon.ico" alt="Baby Icon" className="ba-baby-icon" />
        <div className="ba-title">Book an Appointment</div>
      </div>
      <div className="ba-content">
        <form onSubmit={handleSubmit} className="ba-form">
          <div className="ba-form-group">
            <label>Appointment Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="ba-form-group">
            <label>Appointment Date*</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="ba-form-group">
            <label>Appointment Time*</label>
            <div className="ba-time-slots">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={formData.selectedSlot === slot ? 'selected' : ''}
                  onClick={() => handleSlotClick(slot)}
                  disabled={!formData.appointmentDate}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <div className="ba-form-group">
            <label>Details</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="ba-form-group">
            <label>Status*</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Scheduled">Scheduled</option>
              <option value="Pending">Pending</option>
              <option value="Ready">Ready</option>
            </select>
          </div>
          <button type="submit" className="ba-submit-btn">
            Book Appointment
          </button>
        </form>
      </div>

      {message && (
        <div className={`ba-toast ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
          <button onClick={closeToast}>Close</button>
        </div>
      )}

      <style jsx>{`
        .ba-wrapper {
          padding: 25px;
          max-width: 1200px;
          margin: 0 auto;
          margin-top: 100px;
          font-family: 'Georgia', serif;
          background: #fff7f9;
          border-radius: 20px;
        }

        .ba-top-section {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 35px;
          background: linear-gradient(to right, #f8e1e9, #fceff2);
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(248, 187, 208, 0.2);
        }

        .ba-baby-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #fff;
          padding: 8px;
          border: 2px solid #f8bbd0;
        }

        .ba-title {
          color: #ec407a;
          font-size: 28px;
          font-weight: 500;
          text-shadow: 1px 1px 3px rgba(236, 64, 122, 0.1);
        }

        .ba-content {
          padding: 30px;
          background: #ffffff;
          border-radius: 25px;
          box-shadow: 0 4px 12px rgba(248, 187, 208, 0.15);
          border: 1px solid #fce4ec;
        }

        .ba-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ba-form-group {
          margin-bottom: 20px;
        }

        .ba-form-group label {
          display: block;
          margin-bottom: 8px;
          color: #ec407a;
          font-size: 16px;
          font-weight: 500;
        }

        .ba-form-group input,
        .ba-form-group select,
        .ba-form-group textarea {
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

        .ba-form-group input:focus,
        .ba-form-group select:focus,
        .ba-form-group textarea:focus {
          border-color: #ec407a;
          outline: none;
        }

        .ba-time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          gap: 10px;
        }

        .ba-time-slots button {
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

        .ba-time-slots button:hover {
          background: #f8bbd0;
          color: #fff;
        }

        .ba-time-slots button.selected {
          background: #ec407a;
          color: #fff;
          border-color: #ec407a;
        }

        .ba-submit-btn {
          padding: 12px 25px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'Georgia', serif;
          font-size: 16px;
          background: #ec407a;
          color: #fff;
          transition: background-color 0.3s ease;
        }

        .ba-submit-btn:hover {
          background: #d1356b;
        }

        .ba-toast {
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

        .ba-toast.success {
          background: #2e7d32;
        }

        .ba-toast.error {
          background: #d81b60;
        }

        .ba-toast button {
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

export default BookAppointment;