import React, { useState } from "react";
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

const FormContainer = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #ff69b4;
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #ff69b4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #ff5ba7;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 1rem;
`;

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Gửi yêu cầu đặt lại mật khẩu với chỉ email
      await axios.post(
        "http://localhost:5254/api/Users/forgotpassrequest",
        { email: email },
        { headers: { "Content-Type": "application/json" } }
      );
      
      toast.success("Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư của bạn.");
    } catch (error) {
      setError("Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormContainer onSubmit={handleForgotPassword}>
        <Title>Reset your password</Title>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Email"}
        </Button>
      </FormContainer>
    </PageContainer>
  );
}

export default ForgotPasswordPage;