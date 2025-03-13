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
        duration: `${plan.duration} months`,
        benefits: plan.description
          .split('",\r\n') // Split based on API formatting
          .map((desc) => desc.replace(/["\r\n]/g, "").trim()) // Clean unwanted characters
          .filter((desc) => desc !== ""), // Remove empty strings
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
      alert("Please log in to proceed with the payment!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5254/api/payment", {
        userId: userId,
        membershipId: selectedPlan.id,
        amount: selectedPlan.price,
        paymentDescription: `Payment for ${selectedPlan.name} plan`,
        paymentMethod: selectedPaymentMethod,
      });

      if (response.status === 200) {
        alert("Payment successful!");
        setShowPaymentModal(false);
      } else {
        alert("Payment failed!");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred, please try again!");
    }
  };

  return (
    <div className="membership-container">
      <h1 className="membership-title">Join the Journey with Mom and Baby</h1>
      <p className="membership-description">
        Choose a suitable membership plan to access exclusive materials, expert advice, and connect with the mom community!
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
                <strong>Price:</strong> {plan.price.toLocaleString()}đ
              </p>
              <p>
                <strong>Duration:</strong> {plan.duration}
              </p>
              <ul>
                {plan.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
              <Button onClick={() => handleShowPaymentModal(plan)}>
                Join Now
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Payment Method Modal */}
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are purchasing: <strong>{selectedPlan?.name}</strong>
          </p>
          <p>
            Amount: <strong>{selectedPlan?.price?.toLocaleString()}đ</strong>
          </p>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="bank"
                checked={selectedPaymentMethod === "bank"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />
              Bank Transfer
            </label>
            <label>
              <input
                type="radio"
                value="qr"
                checked={selectedPaymentMethod === "qr"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />
              Scan QR Code
            </label>
          </div>
          {selectedPaymentMethod === "bank" && (
            <div className="payment-details">
              <p>
                <strong>ACCOUNT HOLDER:</strong> NGUYEN VAN A
              </p>
              <p>
                <strong>ACCOUNT NUMBER:</strong> babycare.com
              </p>
              <p>
                <strong>BANK:</strong> MB
              </p>
              <p>
                <strong>TRANSFER NOTE:</strong> NAP306046MOM
              </p>
            </div>
          )}
          {selectedPaymentMethod === "qr" && (
            <div className="payment-details">
              <p>Please scan the QR code to proceed with the payment:</p>
              <img src="images/QRCode.png" alt="QR Code" className="qr-code" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePaymentModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePayment} disabled={!selectedPaymentMethod}>
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MembershipPage;
