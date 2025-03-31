import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentReturnHandler.css";

function PaymentReturnHandler() {
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your payment...");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        // Get the query string without the leading '?'
        const queryString = location.search.substring(1);

        // Parse the query string into a collection of key-value pairs
        const queryParams = {};
        new URLSearchParams(queryString).forEach((value, key) => {
          queryParams[key] = decodeURIComponent(value);
        });

        console.log("Sending payment params to backend:", queryParams);

        // Verify the payment with your backend
        const response = await axios.get(
          `http://localhost:5254/api/payment/return?${new URLSearchParams(
            queryParams
          ).toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Payment verification response:", response.data);

        // Store full payment details from response
        setPaymentDetails(response.data);

        // Check payment status from response
        if (response.data.paymentStatus === "Success") {
          setStatus("success");
          setMessage(
            response.data.paymentDescription ||
              "Payment successful! Your membership is now active."
          );

          // After 3 seconds, redirect to the membership page
          setTimeout(() => {
            navigate("/membership");
          }, 3000);
        } else {
          setStatus("failed");
          setMessage(
            response.data.paymentDescription ||
              "Payment verification failed. Please contact support."
          );
        }
      } catch (error) {
        console.error("Error handling payment return:", error);
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "An error occurred while processing your payment. Please contact support."
        );
      }
    };

    // Execute the handler when component mounts
    if (location.search) {
      handlePaymentReturn();
    } else {
      setStatus("error");
      setMessage("No payment information received.");
    }
  }, [location, navigate]);

  const renderStatusContent = () => {
    switch (status) {
      case "processing":
        return (
          <>
            <div className="text-center mb-4">
              <Spinner animation="border" variant="primary" />
            </div>
            <h3 className="text-center">Processing Payment</h3>
          </>
        );
      case "success":
        return (
          <>
            <div className="text-center mb-4">
              <div className="success-icon">✓</div>
            </div>
            <h3 className="text-center text-success">Payment Successful!</h3>
            <p className="text-center">Thank you for your payment.</p>
            <p className="text-center">We also be in contact with more details shortly</p>
          </>
        );
      case "failed":
      case "error":
      default:
        return (
          <>
            <div className="text-center mb-4">
              <div className="error-icon">✗</div>
            </div>
            <h3 className="text-center text-danger">Payment Failed</h3>
            <Alert variant="danger">{message}</Alert>
            <div className="text-center mt-4">
              <Button variant="primary" onClick={() => navigate("/membership")}>
                Return to Membership Page
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <Container className="payment-return-container py-5">
      <Card className="payment-return-card mx-auto">
        <Card.Header>
          <h2 className="text-center">Payment Verification</h2>
        </Card.Header>
        <Card.Body>{renderStatusContent()}</Card.Body>
      </Card>
    </Container>
  );
}

export default PaymentReturnHandler;
