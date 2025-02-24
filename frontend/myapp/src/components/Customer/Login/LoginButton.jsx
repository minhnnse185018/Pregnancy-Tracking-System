import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaLock } from "react-icons/fa";

const LoginButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* Nút Login */}
      <Button
        className="login-button"
        onClick={() => setShowModal(true)}
        style={{
          backgroundColor: "#ff69b4",
          border: "none",
          color: "#fff",
          fontWeight: "500",
          padding: "10px 20px",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <FaLock />
        <span>Login</span>
      </Button>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose Login Type</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Button
            className="w-100 mb-3"
            onClick={() => {
              setShowModal(false);
              // Chuyển hướng đến trang Login của khách hàng (nếu cần)
              window.location.href = "/customer-login";
            }}
            style={{
              borderRadius: "10px",
              backgroundColor: "#E495D9",
              border: "none",
            }}
          >
            Login for Customer
          </Button>
          <Button
            className="w-100"
            onClick={() => {
              setShowModal(false);
              // Chuyển hướng đến trang Login nội bộ (nếu cần)
              window.location.href = "/internal-login";
            }}
            style={{
              borderRadius: "10px",
              backgroundColor: "#E495D9",
              border: "none",
            }}
          >
            Login for Internal
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LoginButton;
