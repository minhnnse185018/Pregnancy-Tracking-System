import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { AuthContext } from "../AuthContext";
import * as Components from "./Components";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgb(255, 223, 251);
`;

const GoogleButtonContainer = styled.div`
  margin: 10px 0;
`;

function LoginPage({ onClose }) { // Added onClose prop for modal support
  const clientId =
    "157843865023-45o3ncemhfk5n348ee0kdrmn9cq02u9b.apps.googleusercontent.com";
  const [signIn, toggle] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setHasToken } = useContext(AuthContext);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5254/api/Login",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, userID, userRole, hasMembership } = response.data; // Added hasMembership
      if (token) {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userID", userID);
        sessionStorage.setItem("userRole", userRole);
        sessionStorage.setItem("hasMembership", hasMembership); // Store hasMembership
        setHasToken(true);
        navigate("/");
        toast.success("Login successful!");
        if (onClose) onClose(); // Close modal if onClose is provided
      } else {
        setError("Email or Password Incorrect. Please try again.");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateEmail(signUpEmail)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5254/api/Login/register",
        {
          email: signUpEmail,
          password: signUpPassword,
          firstname: " ",
          lastName: " ",
          phone: "",
          dateOfBirth: "",
          gender: "",
          image: "",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, userID, userRole, hasMembership } = response.data; // Added hasMembership
      if (token) {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userID", userID);
        sessionStorage.setItem("userRole", userRole);
        sessionStorage.setItem("hasMembership", hasMembership); // Store hasMembership
        setHasToken(true);
        navigate("/");
        if (onClose) onClose(); // Close modal if onClose is provided
      } else {
        toast.success(
          "A confirmation email has been sent to your email address. Please check your inbox."
        );
      }
    } catch (error) {
      setError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập/đăng ký Google
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    const endpoint = signIn
      ? "http://localhost:5254/api/Login/google-login"
      : "http://localhost:5254/api/Register/google-register";
    try {
      const response = await axios.post(
        endpoint,
        {
          credential: credentialResponse.credential,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, userID, userRole, hasMembership } = response.data; // Added hasMembership
      if (token) {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userID", userID);
        sessionStorage.setItem("userRole", userRole);
        sessionStorage.setItem("hasMembership", hasMembership); // Store hasMembership
        setHasToken(true);
        toast.success(
          `${signIn ? "Google login" : "Google registration"} successful!`
        );
        navigate("/");
        if (onClose) onClose(); // Close modal if onClose is provided
      } else {
        setError(
          `Google ${
            signIn ? "login" : "registration"
          } failed. Please try again.`
        );
      }
    } catch (error) {
      setError(
        `Google ${signIn ? "login" : "registration"} failed. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <PageContainer>
        <Components.Container>
          <Components.SignUpContainer signinIn={signIn}>
            <Components.Form onSubmit={handleRegister}>
              <Components.Title>Create Account</Components.Title>
              <GoogleButtonContainer>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google registration failed")}
                  text="signup_with"
                />
              </GoogleButtonContainer>
              <Components.Input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
              />
              <Components.Input
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
                minLength={6}
              />
              <Components.Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Components.Button type="submit" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Components.Button>
            </Components.Form>
          </Components.SignUpContainer>

          <Components.SignInContainer signinIn={signIn}>
            <Components.Form onSubmit={handleLogin}>
              <Components.Title>Sign in</Components.Title>
              <GoogleButtonContainer>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google login failed")}
                  text="signin_with"
                />
              </GoogleButtonContainer>
              <Components.Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Components.Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Components.Anchor href="/forgotPassword">
                Forgot your password?
              </Components.Anchor>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Components.Button type="submit" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Components.Button>
            </Components.Form>
          </Components.SignInContainer>

          <Components.OverlayContainer signinIn={signIn}>
            <Components.Overlay signinIn={signIn}>
              <Components.LeftOverlayPanel signinIn={signIn}>
                <Components.Title>Welcome Back!</Components.Title>
                <Components.Paragraph>
                  To keep connected with us please login with your personal info
                </Components.Paragraph>
                <Components.GhostButton onClick={() => toggle(true)}>
                  Sign In
                </Components.GhostButton>
              </Components.LeftOverlayPanel>

              <Components.RightOverlayPanel signinIn={signIn}>
                <Components.Title>Hello, Friend!</Components.Title>
                <Components.Paragraph>
                  Enter Your personal details and start journey with us
                </Components.Paragraph>
                <Components.GhostButton onClick={() => toggle(false)}>
                  Sign Up
                </Components.GhostButton>
              </Components.RightOverlayPanel>
            </Components.Overlay>
          </Components.OverlayContainer>
        </Components.Container>
      </PageContainer>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;