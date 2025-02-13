import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './MembershipPage.css';

function MembershipPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleClose = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  const handlePurchase = (cost) => {
    const userBalance = 500000; // Example user balance, replace with actual balance check

    if (userBalance >= cost) {
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  return (
    <div className="membership-container">
      <h1 className="membership-title">Chọn gói nâng cấp</h1>
      <p className="membership-description">Để sử dụng đầy đủ các chức năng của diễn đàn, hãy chọn các gói dịch vụ phù hợp với bạn để có thể sử dụng đầy đủ các quyền lợi và chức năng của diễn đàn.</p>
      
      <div className="membership-plans">
        <div className="membership-plan">
          <h2>BABYCARE MEMBER</h2>
          <p>38,000đ cho 1 tháng</p>
          <ul>
            <li>Được truy cập hơn 2,000 đề tài có ích</li>
            <li>Hiển thị đầy đủ các link ẩn</li>
            <li>Comment và chat không giới hạn</li>
          </ul>
          <Button onClick={() => handlePurchase(38000)}>Mua ngay</Button>
        </div>
        <div className="membership-plan">
          <h2>BABYCARE VIP</h2>
          <p>200,000đ cho 8 tháng</p>
          <ul>
            <li>Toàn quyền của gói Member</li>
            <li>Không quảng cáo</li>
            <li>Xem chủ đề mới nhất của diễn đàn</li>
          </ul>
          <Button onClick={() => handlePurchase(200000)}>Mua ngay</Button>
        </div>
        <div className="membership-plan">
          <h2>BABYCARE NOVA</h2>
          <p>650,000đ cho 4 năm</p>
          <ul>
            <li>Toàn quyền của gói VIP</li>
            <li>Không quảng cáo</li>
            <li>Xem chủ đề mới nhất của diễn đàn</li>
            <li>Sử dụng chức năng đặt biệt</li>
          </ul>
          <Button onClick={() => handlePurchase(650000)}>Mua ngay</Button>
        </div>
      </div>
      
      <h3 className="payment-method-title">Phương thức thanh toán</h3>
      <p className="payment-method-description">Bạn có thể nạp BABYCARE Point qua tài khoản ngân hàng hoặc quét mã QR code để nạp tiền.</p>
      
      <div className="payment-methods">
        <p><strong>CHỦ TÀI KHOẢN:</strong> NGUYEN VAN A</p>
        <p><strong>SỐ TK:</strong> babycare.com</p>
        <p><strong>NGÂN HÀNG:</strong> MB</p>
        <p><strong>NỘI DUNG CHUYỂN KHOẢN:</strong> NAP306046BABY</p>
        <img src="images/QRCode.png" alt="QR Code" className="qr-code" />   
        <p><strong>Mệnh giá BABYCARE Point:</strong> 1,000 Baby Point = 1,000 VND</p>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thanh toán thành công</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn đã mua thành công gói dịch vụ!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thanh toán thất bại</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn không đủ số dư để mua gói dịch vụ này.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MembershipPage;
