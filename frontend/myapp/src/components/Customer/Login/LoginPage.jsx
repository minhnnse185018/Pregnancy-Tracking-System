import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
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

function LoginPage({ setIsLoggedIn }) {
  const clientId =
    "157843865023-45o3ncemhfk5n348ee0kdrmn9cq02u9b.apps.googleusercontent.com";
  const [signIn, toggle] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

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
      const response = await axios.post("https://reqres.in/api/login", {
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        toast.success("Login successful!");
        navigate("/");
      } else {
        setError("Email or Password Incorrect. Please try again.");
      }
    } catch (error) {
      setError("Email or Password Incorrect.");
    } finally {
      setLoading(false);
      
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      // Handle Google login success
      console.log(credentialResponse);
      setIsLoggedIn(true);
      toast.success("Google login successful!");
      navigate("/");
    } catch (error) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGoogleCallback = async () => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams(window.location.search);
      const email = params.get("token");

      if (email) {
        try {
          const response = await axios.post("https://reqres.in/api/login", {
            email,
          });

          const { token } = response.data;
          if (token) {
            localStorage.setItem("token", token);
            setIsLoggedIn(true);
            toast.success("Login successful!");
            navigate("/");
          } else {
            setError("Google login failed. Please try again.");
          }
        } catch (error) {
          console.error("Error logging in with Google:", error);
        }
      }
      setLoading(false);
    };

    const params = new URLSearchParams(window.location.search);
    const email = params.get("token");

    if (email) {
      handleGoogleCallback(email);
    }
  }, [navigate]);

  return (
    <div>
      <GoogleOAuthProvider clientId={clientId}>
        <PageContainer>
          <ToastContainer />
          <Components.Container>
            <Components.SignUpContainer signinIn={signIn}>
              <Components.Form>
                <Components.Title>Create Account</Components.Title>
                <GoogleButtonContainer>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed")}
                    text="signup_with"
                  />
                </GoogleButtonContainer>
                <Components.Input type="text" placeholder="Name" />
                <Components.Input type="email" placeholder="Email" />
                <Components.Input type="password" placeholder="Password" />
                <Components.Button>Sign Up</Components.Button>
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
                />
                <Components.Anchor href="#">
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
                    To keep connected with us please login with your personal
                    info
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
    </div>
  );
}

export default LoginPage;
