import axios from 'axios';
import React, { useState } from 'react';
import './BookAppointment.css';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    title: '',
    appointmentDate: '',
    description: ''
  });
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userId = sessionStorage.getItem('userID');
    if (!userId) {  
      alert('Người dùng chưa đăng nhập. Vui lòng đăng nhập trước.');
      return;
    }
    
    try {
      // Xem nội dung request trong console
      const requestData = {
        userId: parseInt(userId),
        appointmentDate: new Date(formData.appointmentDate).toISOString(),
        title: formData.title,
        description: formData.description
      };
      
      console.log('Đang gửi dữ liệu:', requestData);
      
      // Thử với cấu trúc URL khác
      const response = await axios.post('http://localhost:5254/api/appointments', requestData);
      
      console.log('Phản hồi từ server:', response.data);
      
      setMessage('Đặt lịch thành công!');
      setAppointments([...appointments, { 
        ...formData, 
        userId: parseInt(userId),
        id: Date.now() 
      }]);
      
      // Reset form
      setFormData({
        title: '',
        appointmentDate: '',
        description: ''
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      
      // Hiển thị chi tiết lỗi nếu có
      if (error.response && error.response.data) {
        console.error('Chi tiết lỗi:', error.response.data);
        setMessage(`Đã có lỗi xảy ra: ${JSON.stringify(error.response.data)}`);
      } else {
        setMessage('Đã có lỗi xảy ra. Vui lòng thử lại!');
      }
    }
  };

  return (
    <div className="book-appointment">
      <header className="header">
        <img src="images/favicon.ico" alt="Baby Icon" className="baby-icon" />
        <h1>Đặt lịch hẹn bác sĩ</h1>
      </header>
      <div className="container">
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tiêu đề lịch hẹn*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="VD: Hẹn khám với bác sĩ Nguyễn Văn A..."
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày hẹn*</label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mô tả chi tiết</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Thêm thông tin chi tiết về lịch hẹn..."
                rows="4"
              />
            </div>
            <button type="submit" className="submit-btn">Tạo lịch hẹn</button>
          </form>
          {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
        </div>
        <div className="illustration">
          <img src="images/bookappointment.png" alt="Doctor and Pregnant Woman" />
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;