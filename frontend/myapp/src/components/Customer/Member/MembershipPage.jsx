import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import "./MembershipPage.css";

function MembershipPage() {
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    fetchMembershipPlans();
  }, []);

  const fetchMembershipPlans = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5254/api/MembershipPlan/GetAllPlans"
      );
      const formattedPlans = response.data.map((plan) => ({
        id: plan.id,
        name: plan.planName,
        price: plan.price,
        duration: `${plan.duration} tháng`,
        benefits: plan.description
          .split('",\r\n') // Split based on how it's formatted in the API
          .map((desc) => desc.replace(/["\r\n]/g, "").trim()) // Clean up unwanted characters
          .filter((desc) => desc !== ""), // Remove any empty strings
      }));
      setPlans(formattedPlans);
    } catch (err) {
      setError("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  };

  const handleShowPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod("");
  };

  const handlePayment = async () => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      alert("Vui lòng đăng nhập để thanh toán!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5254/api/payment", {
        userId: userId,
        membershipId: selectedPlan.id,
        amount: selectedPlan.price,
        paymentDescription: `Thanh toán gói ${selectedPlan.name}`,
        paymentMethod: selectedPaymentMethod,
      });

      if (response.status === 200) {
        alert("Thanh toán thành công!");
        setShowPaymentModal(false);
      } else {
        alert("Thanh toán thất bại!");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="membership-container">
      <h1 className="membership-title">Đồng hành cùng mẹ bầu và bé yêu</h1>
      <p className="membership-description">
        Chọn gói dịch vụ phù hợp để nhận tài liệu chuyên sâu, lời khuyên từ
        chuyên gia và kết nối với cộng đồng mẹ bầu!
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="membership-plans">
          {plans.map((plan) => (
            <div key={plan.id} className="membership-plan">
              <h2>{plan.name}</h2>
              <p>
                <strong>Giá:</strong> {plan.price.toLocaleString()}đ
              </p>
              <p>
                <strong>Thời gian:</strong> {plan.duration}
              </p>
              <ul>
                {plan.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
              <Button onClick={() => handleShowPaymentModal(plan)}>
                Tham gia ngay
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Payment Method Modal */}
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn đang mua gói: <strong>{selectedPlan?.name}</strong>
          </p>
          <p>
            Số tiền: <strong>{selectedPlan?.price?.toLocaleString()}đ</strong>
          </p>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="bank"
                checked={selectedPaymentMethod === "bank"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />
              Chuyển khoản ngân hàng
            </label>
            <label>
              <input
                type="radio"
                value="qr"
                checked={selectedPaymentMethod === "qr"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />
              Quét mã QR
            </label>
          </div>
          {selectedPaymentMethod === "bank" && (
            <div className="payment-details">
              <p>
                <strong>CHỦ TÀI KHOẢN:</strong> NGUYEN VAN A
              </p>
              <p>
                <strong>SỐ TK:</strong> babycare.com
              </p>
              <p>
                <strong>NGÂN HÀNG:</strong> MB
              </p>
              <p>
                <strong>NỘI DUNG:</strong> NAP306046MOM
              </p>
            </div>
          )}
          {selectedPaymentMethod === "qr" && (
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
          <Button variant="primary" onClick={handlePayment} disabled={!selectedPaymentMethod}>
            Xác nhận thanh toán
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MembershipPage;
