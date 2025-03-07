import axios from 'axios';
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InternalLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleInternalLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5254/api/Login', {
        email: email,
        password: password,
      });

      const { token, userID, userRole } = response.data;

      if (!token || !userID || !userRole) {
        setError('Access Denied: Invalid login response');
        setLoading(false);
        return;
      }

      // Define valid internal staff roles
      const validRoles = {
        2: 'doctor',
        3: 'manager',
        4: 'admin'
      };

      if (!validRoles[userRole]) {
        setError('Access Denied: This login is for internal staff only (Doctor, Manager, or Admin)');
        setLoading(false);
        return;
      }

      // Store authentication data
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userID', userID);
      sessionStorage.setItem('userRole', userRole);
      window.dispatchEvent(new Event('storage'));

      toast.success("Login Successfully!");
      setLoading(false);

      // Navigate based on role
      switch (userRole) {
        case 2:
          navigate('/doctor');
          break;
        case 3:
          navigate('/manager');
          break;
        case 4:
          navigate('/admin');
          break;
        default:
          // This shouldn't happen due to validRoles check, but included for safety
          setError('Invalid role configuration');
          setLoading(false);
          return;
      }

    } catch (error) {
      setError('Username or Password Incorrect.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content login-box">
          <div className="modal-header">
            <h5 className="modal-title text-center w-100">
              <img src="images/logo.png" alt="baby icon" className="logo" />
              Internal Staff Login
            </h5>
          </div>
          <div className="modal-body">
            <p className="info-text">Login for Doctors, Managers, and Admins</p>
            <form onSubmit={handleInternalLogin}>
              <div className="mb-3">
                <label htmlFor="internalUsername" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="internalUsername"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="internalPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="internalPassword"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              {error && <p className="error-text">{error}</p>}
              <div className="d-flex justify-content-between">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
            <div className="text-center mt-3">
              <p>or sign in with</p>
              <div className="d-flex justify-content-center">
                <Link to="#" className="google-btn">
                  <FaGoogle />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Your existing styles remain unchanged */}
      <style>{/* ... your existing CSS ... */}</style>
    </div>
  );
};

export default InternalLoginPage;