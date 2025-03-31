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

      const validRoles = {
        2: 'doctor',
        3: 'manager',
        4: 'admin'
      };

      if (!validRoles[userRole]) {
        setError('Access Denied: This login is for internal staff only');
        setLoading(false);
        return;
      }

      // Store authentication data
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userID', userID);
      sessionStorage.setItem('userRole', userRole);
      window.dispatchEvent(new Event('storage'));

      toast.success("Login Successful!");
      
      // Navigate immediately after successful login
      const redirectTo = {
        2: '/doctor',
        3: '/manager',
        4: '/admin'
      }[userRole];
      
      setLoading(false);
      navigate(redirectTo, { replace: true });
      
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
              Staff Pregnancy Care Portal
            </h5>
          </div>
          <div className="modal-body">
            <p className="info-text">Supporting our prenatal care team</p>
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
      <style>
        {`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #FFF0F5 0%, #F8E1E9 100%);
            padding: 20px;
          }

          .login-box {
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(244, 164, 188, 0.2);
            padding: 40px;
            max-width: 450px;
            width: 100%;
            background: white;
          }

          .logo {
            width: 60px;
            margin-right: 15px;
            border-radius: 50%;
          }

          .modal-title {
            color: #F472B6;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .info-text {
            text-align: center;
            color: #F9A8D4;
            font-style: italic;
            font-size: 16px;
            margin-bottom: 25px;
          }

          .form-label {
            color: #F472B6;
            font-weight: 500;
          }

          .form-control {
            border: 2px solid #FCE7F3;
            border-radius: 10px;
            padding: 10px;
            transition: border-color 0.3s;
          }

          .form-control:focus {
            border-color: #F9A8D4;
            box-shadow: 0 0 0 0.2rem rgba(244, 114, 182, 0.25);
          }

          .error-text {
            color: #F43F5E;
            text-align: center;
            font-weight: 500;
            margin: 15px 0;
          }

          .login-btn {
            width: 100%;
            border-radius: 12px;
            background: linear-gradient(to right, #F472B6, #F9A8D4);
            border: none;
            color: white;
            padding: 12px;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
          }

          .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(244, 114, 182, 0.4);
          }

          .login-btn:disabled {
            background: #E5E7EB;
            cursor: not-allowed;
          }

          .google-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #F472B6;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            color: white;
            font-size: 20px;
            transition: transform 0.3s;
          }

          .google-btn:hover {
            transform: scale(1.1);
            background: #F9A8D4;
          }

          .text-decoration-none {
            color: #F472B6;
            transition: color 0.3s;
          }

          .text-decoration-none:hover {
            color: #F9A8D4;
          }
        `}
      </style>
    </div>
  );
};

export default InternalLoginPage;