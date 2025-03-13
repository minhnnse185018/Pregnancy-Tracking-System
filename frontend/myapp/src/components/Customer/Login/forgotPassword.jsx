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

    // Generate a reset token and link
    // In a real app, this would be done on the backend
    const resetLink = `http://localhost:3000/forgotPassword
    )}`;

    // Create the HTML email template
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .message {
            margin-bottom: 25px;
        }
        
        .button-container {
            text-align: center;
            margin: 25px 0;
        }
        
        .button {
            display: inline-block;
            background-color: #ff69b4;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
            font-size: 14px;
        }
        
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777777;
            border-top: 1px solid #eeeeee;
            padding-top: 20px;
        }
        
        .footer p {
            margin: 5px 0;
        }
        
        .small-text {
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="title">Password reset request</div>
        
        <div class="message">
            On the journey of life, passwords often get lost. Click below to create a new one.
        </div>
        
        <div class="button-container">
            <a href="${resetLink}" class="button">RESET YOUR PASSWORD</a>
        </div>
        
        <div class="footer">
            <p>Have any questions? <a href="mailto:mombabycaretracking@gmail.com">Contact us</a>. If you didn't ask for a password reset, kindly ignore this.</p>
            
            <p><strong>Get the Mom & Baby app</strong></p>
            
            <p class="small-text">© 2025 Mom & Baby, E2a-7, D1 Street, Long Thanh My, Thu Duc City, Ho Chi Minh City 700000.</p>
            <p class="small-text">Terms of Use • Privacy Policy</p>
            <p class="small-text">This email is for informational purposes only.</p>
            <p class="small-text">Unsubscribe • Manage your subscriptions</p>
        </div>
    </div>
</body>
</html>
    `;

    try {
      await axios.post(
        "http://localhost:5254/api/email/send",
        {
          toEmail: email,
          subject: "Password Reset Request",
          body: emailTemplate,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Password reset email sent!");
    } catch (error) {
      setError("Failed to send password reset email. Please try again.");
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
