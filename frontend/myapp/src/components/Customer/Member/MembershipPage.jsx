import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './MembershipPage.css';

function MembershipPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const navigate = useNavigate();

  const plans = [
    {
      name: 'MẸ BẦU KHỎE MẠNH',
      cost: 38000,
      duration: '1 tháng',
      benefits: [
        'Truy cập hơn 2,000 bài viết về thai kỳ và chăm sóc bé',
        'Xem tài liệu ẩn từ chuyên gia sản khoa',
        'Tham gia hỏi đáp với cộng đồng mẹ bầu',
      ],
    },
    {
      name: 'MẸ BẦU VIP',
      cost: 200000,
      duration: '3 tháng',
      benefits: [
        'Tất cả quyền lợi của gói “Mẹ Bầu Khỏe Mạnh”',
        'Không quảng cáo, tập trung vào thông tin hữu ích',
        'Cập nhật kiến thức mới nhất về thai kỳ và nuôi con',
      ],
    },
    {
      name: 'MẸ BẦU TOÀN DIỆN',
      cost: 650000,
      duration: '8 tháng',
      benefits: [
        'Tất cả quyền lợi của gói VIP',
        'Không quảng cáo, trải nghiệm liền mạch',
        'Truy cập tài liệu độc quyền từ bác sĩ và chuyên gia',
        'Hỗ trợ cá nhân hóa cho hành trình làm mẹ',
      ],
    },
  ];

  const handleShowPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod('');
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    // Simulate payment process (replace with actual payment logic)
    const userBalance = 500000; // Example balance
    if (userBalance >= selectedPlan.cost) {
      navigate('/payment-success', { state: { plan: selectedPlan } });
    } else {
      navigate('/payment-failure', { state: { plan: selectedPlan } });
    }
    handleClosePaymentModal();
  };

  return (
    <div className="membership-container">
      <h1 className="membership-title">Đồng hành cùng mẹ bầu và bé yêu</h1>
      <p className="membership-description">
        Chọn gói dịch vụ phù hợp để nhận tài liệu chuyên sâu, lời khuyên từ chuyên gia và kết nối với cộng đồng mẹ bầu!
      </p>

      <div className="membership-plans">
        {plans.map((plan, index) => (
          <div key={index} className="membership-plan">
            <h2>{plan.name}</h2>
            <p>{plan.cost.toLocaleString()}đ cho {plan.duration}</p>
            <ul>
              {plan.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
            <Button onClick={() => handleShowPaymentModal(plan)}>Tham gia ngay</Button>
          </div>
        ))}
      </div>

      {/* Payment Method Modal */}
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn đang mua gói: <strong>{selectedPlan?.name}</strong></p>
          <p>Số tiền: <strong>{selectedPlan?.cost.toLocaleString()}đ</strong></p>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="bank"
                checked={selectedPaymentMethod === 'bank'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />
              Chuyển khoản ngân hàng
            </label>
            <label>
              <input
                type="radio"
                value="qr"
                checked={selectedPaymentMethod === 'qr'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />
              Quét mã QR
            </label>
          </div>
          {selectedPaymentMethod === 'bank' && (
            <div className="payment-details">
              <p><strong>CHỦ TÀI KHOẢN:</strong> NGUYEN VAN A</p>
              <p><strong>SỐ TK:</strong> babycare.com</p>
              <p><strong>NGÂN HÀNG:</strong> MB</p>
              <p><strong>NỘI DUNG:</strong> NAP306046MOM</p>
            </div>
          )}
          {selectedPaymentMethod === 'qr' && (
            <div className="payment-details">
              <p>Vui lòng quét mã QR để thanh toán:</p>
              <img src="images/QRCode.png" alt="QR Code" className="qr-code" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePaymentModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handlePayment}>
            Xác nhận thanh toán
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MembershipPage;