import React from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentFailure() {
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
            color: #e65b7b;
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
            background-color: #ccc;
            border: none;
            padding: 12px 30px;
            font-size: 1.2rem;
            border-radius: 25px;
            transition: background-color 0.3s ease;
          }

          .payment-result-container .btn:hover {
            background-color: #b3b3b3;
          }

          .payment-result-container::before {
            content: '😔';
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
      <h1>Thanh toán thất bại!</h1>
      <p>Rất tiếc, thanh toán cho gói <strong>{plan?.name}</strong> không thành công.</p>
      <p>Số tiền: <strong>{plan?.cost.toLocaleString()}đ</strong></p>
      <p>Số dư của mẹ có thể không đủ. Vui lòng kiểm tra lại hoặc nạp thêm điểm nhé!</p>
      <Button variant="secondary" onClick={() => navigate('/membership')}>
        Thử lại
      </Button>
    </div>
  );
}

export default PaymentFailure;