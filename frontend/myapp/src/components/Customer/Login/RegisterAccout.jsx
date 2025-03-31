import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgb(255, 223, 251);
`;

const MessageContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  color: ${(props) => (props.success ? "green" : "red")};
`;

function RegisterAccount() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your account...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = decodeURIComponent(urlParams.get("email"));
    const token = decodeURIComponent(urlParams.get("token"));

    if (!email || !token) {
      setMessage("Invalid or expired verification link.");
      return;
    }

    const verifyAccount = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5254/api/Login/verify-registration",
          { email, token },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          setMessage("Account verified successfully! Redirecting to login...");
          setSuccess(true);
          toast.success("Account verified successfully!");
          setTimeout(() => navigate("/customer-login"), 2000); // Điều hướng sau 2 giây
        } else {
          setMessage("Verification failed. The link may be expired.");
          setSuccess(false);
        }
      } catch (error) {
        setMessage("Verification failed. Please try again.");
        setSuccess(false);
        console.error("Verification Error:", error);
      }
    };

    verifyAccount();
  }, [navigate]);

  return (
    <PageContainer>
      <MessageContainer>
        <Title>Account Verification</Title>
        <Message success={success}>{message}</Message>
      </MessageContainer>
    </PageContainer>
  );
}

export default RegisterAccount;