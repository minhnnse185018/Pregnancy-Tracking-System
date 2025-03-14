import React from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan } = location.state || {};

  return (
    <div className="payment-result-container">
      <style>
        {`
          .payment-result-container {
            padding: 60px 20px;
            background: linear-gradient(135deg, #f9f5f6 0%, #e6f0fa 100%);
            min-height: 100vh;
            text-align: center;
            font-family: 'Arial', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .payment-result-container h1 {
            font-size: 2.5rem;
            color: #ff6f91;
            margin-bottom: 20px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .payment-result-container p {
            font-size: 1.2rem;
            color: #555;
            margin: 10px 0;
            max-width: 600px;
            line-height: 1.6;
          }

          .payment-result-container p strong {
            color: #4a90e2;
            font-weight: 600;
          }

          .payment-result-container .btn {
            margin-top: 30px;
            background-color: #ff6f91;
            border: none;
            padding: 12px 30px;
            font-size: 1.2rem;
            border-radius: 25px;
            transition: background-color 0.3s ease;
          }

          .payment-result-container .btn:hover {
            background-color: #e65b7b;
          }

          .payment-result-container::before {
            content: '🎉';
            font-size: 3rem;
            display: block;
            margin-bottom: 20px;
          }

          @media (max-width: 768px) {
            .payment-result-container {
              padding: 40px 15px;
            }

            .payment-result-container h1 {
              font-size: 2rem;
            }

            .payment-result-container p {
              font-size: 1.1rem;
            }

            .payment-result-container .btn {
              font-size: 1.1rem;
              padding: 10px 25px;
            }
          }

          @media (max-width: 480px) {
            .payment-result-container h1 {
              font-size: 1.8rem;
            }

            .payment-result-container p {
              font-size: 1rem;
            }

            .payment-result-container .btn {
              font-size: 1rem;
              padding: 8px 20px;
            }
          }
        `}
      </style>
      <h1>Thanh toán thành công!</h1>
      <p>Chúc mừng mẹ đã tham gia gói <strong>{plan?.name}</strong>!</p>
      <p>Số tiền: <strong>{plan?.cost.toLocaleString()}đ</strong></p>
      <p>Bây giờ mẹ có thể tận hưởng tất cả quyền lợi từ gói dịch vụ này.</p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Quay về trang chính
      </Button>
    </div>
  );
}

export default PaymentSuccess;