import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import * as Components from "./Components";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Header from "../../HomePage/Header/Header";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background:rgb(255, 223, 251);
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
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://reqres.in/api/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      toast.success("Login successful!");
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Handle Google login success
      console.log(credentialResponse);
      toast.success("Google login successful!");
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  return (
     
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
              <Components.Button type="submit">Sign In</Components.Button>
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
