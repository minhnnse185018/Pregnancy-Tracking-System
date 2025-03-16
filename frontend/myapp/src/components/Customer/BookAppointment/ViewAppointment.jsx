// ViewAppointment.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const userId = sessionStorage.getItem('userID');
    if (!userId) {
      setError('Vui lòng đăng nhập để xem lịch hẹn');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5254/api/appointments/all`);
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau!');
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="va-wrapper">
      <div className="va-top-section">
        <img src="images/favicon.ico" alt="Baby Icon" className="va-baby-icon" />
        <div className="va-title">Lịch hẹn của bạn</div>
      </div>
      <div className="va-content">
        {loading ? (
          <div className="va-loading">Đang tải lịch hẹn...</div>
        ) : error ? (
          <div className="va-error">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="va-empty">
            <img src="images/pregnant-icon.png" alt="Pregnant Icon" className="va-empty-icon" />
            <p>Bạn chưa có lịch hẹn nào. Đặt lịch ngay nhé!</p>
          </div>
        ) : (
          <div className="va-appointments">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="va-card">
                <div className="va-card-top">
                  <span className="va-card-icon">👶</span>
                  <div className="va-card-title">{appointment.title}</div>
                </div>
                <p className="va-card-time">
                  <strong>Thời gian:</strong> {formatDateTime(appointment.appointmentDate)}
                </p>
                <p className="va-card-desc">
                  <strong>Chi tiết:</strong> {appointment.description || 'Không có chi tiết'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scoped CSS với tên class độc nhất */}
      <style jsx>{`
        .va-wrapper {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Arial', sans-serif;
        }

        .va-top-section {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
          background: linear-gradient(to right, #ffe6f0, #fff0f5);
          padding: 15px;
          border-radius: 10px;
        }

        .va-baby-icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #fff;
          padding: 5px;
        }

        .va-title {
          color: #ff6699;
          font-size: 26px;
          font-weight: 600;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .va-content {
          padding: 25px;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 4px 10px rgba(255, 102, 153, 0.1);
        }

        .va-loading {
          text-align: center;
          color: #ff85ad;
          font-size: 18px;
          padding: 30px;
          font-style: italic;
        }

        .va-error {
          text-align: center;
          color: #ff3366;
          font-size: 18px;
          padding: 30px;
          background: #fff5f7;
          border-radius: 10px;
        }

        .va-empty {
          text-align: center;
          padding: 40px;
          color: #ff85ad;
        }

        .va-empty-icon {
          width: 80px;
          height: 80px;
          margin-bottom: 15px;
          opacity: 0.8;
        }

        .va-empty p {
          font-size: 18px;
          margin: 0;
          font-style: italic;
        }

        .va-appointments {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        }

        .va-card {
          padding: 20px;
          border: 2px solid #ffe6f0;
          border-radius: 12px;
          background: #fffafc;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .va-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 15px rgba(255, 102, 153, 0.15);
        }

        .va-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .va-card-icon {
          font-size: 24px;
        }

        .va-card-title {
          margin: 0;
          color: #ff6699;
          font-size: 18px;
          font-weight: 500;
        }

        .va-card-time {
          margin: 8px 0;
          color: #ff85ad;
          font-size: 15px;
        }

        .va-card-desc {
          margin: 8px 0;
          color: #666;
          font-size: 15px;
          line-height: 1.4;
        }

        .va-card strong {
          color: #ff4081;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ViewAppointment;