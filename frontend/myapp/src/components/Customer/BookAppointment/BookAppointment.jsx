import axios from 'axios';
import React, { useState } from 'react';
import './BookAppointment.css';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    examType: '',
    appointmentDate: '',
    address: '',
    phoneNumber: '',
    note: ''
  });
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://your-api-endpoint.com/schedule', formData);
      setMessage('Đặt lịch thành công!');
      setAppointments([...appointments, { ...formData, id: Date.now(), date: new Date().toLocaleDateString() }]);
      setFormData({
        fullName: '',
        examType: '',
        appointmentDate: '',
        address: '',
        phoneNumber: '',
        note: ''
      });
    } catch (error) {
      setMessage('Đã có lỗi xảy ra. Vui lòng thử lại!');
      console.error(error);
    }
  };

  return (
    <div className="book-appointment">
      <header className="header">
        <img src="https://via.placeholder.com/50" alt="Baby Icon" className="baby-icon" />
        <h1>Đặt lịch hẹn bác sĩ</h1>
      </header>
      <div className="container">
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên thông báo*</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="VD: Hẹn khám với bác sĩ Nguyễn Văn A..."
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày hẹn*</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ*</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="..."
                required
              />
            </div>
            <div className="form-group">
              <label>Thông tin liên hệ</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="VD: 0123456789"
              />
            </div>
            <div className="form-group">
              <label>Thông điền thêm</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Vào lúc điện ra siêu âm..."
              />
            </div>
            <button type="submit" className="submit-btn">Tạo lịch hẹn</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
        <div className="illustration">
          <img src="images/bookappointment.png" alt="Doctor and Pregnant Woman" />
        </div>
      </div>
      <div className="appointments-section">
        <h2>Các cuộc hẹn sắp diễn ra</h2>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-item">
              <p>{`Thứ 4, ngày 12 tháng 03 năm 2025 - Địa điểm khám: ${appointment.address}`}</p>
              <button className="details-btn">Chi tiết</button>
            </div>
          ))
        ) : (
          <p>Không có cuộc hẹn nào sắp diễn ra.</p>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;