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
        setError('Access Denied: This login is for internal staff only.');
        setLoading(false);
        return;
      }

      if (userRole === 1) {
        setError('Your account does not have internal login permissions. Please select customer login.');
        setLoading(false);
        return;
      }
      if (token && userID && userRole) {
      // Lưu thông tin vào sessionStorage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userID', userID);
      sessionStorage.setItem('userRole', userRole);
      window.dispatchEvent(new Event('storage'));

      toast.success("Login Successfully!");
      setLoading(false);

      // Điều hướng về login layout sau khi đăng nhập thành công
      navigate('/admin');
      
      // switch (userRole) {
      //   case 2:
      //     navigate('/stylist');
      //      window.location.reload();
      //     break;
      //   case 3:
      //     navigate('/staff');
      //     window.location.reload();
      //     break;
      //   case 4:
      //     navigate('/manager');
      //     window.location.reload();
      //     break;
      //   case 5:
      //     navigate('/admin');
      //     window.location.reload();
      //     break;
      //   default:
      //     setError('Access Denied: Invalid role for internal login.');
      // }

    }else{
      setError('Access Denied: This login is for internal staff only.');
        setLoading(false);
    }
    } catch (error) {
      
      setError('Username or Password Incorrect.');
      setLoading(false);

      // Điều hướng về trang login layout nếu đăng nhập thất bại
      navigate('/internal-login');
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
            <p className="info-text">This Login Only For Internal Staff!!</p>
            <form onSubmit={handleInternalLogin}>
              <div className="mb-3">
                <label htmlFor="internalUsername" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="internalUsername"
                  placeholder="Enter your username"
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
                <Link to="#" className="text-decoration-none">
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
            height: 100vh;
            background-color: #f0f0f0;
          }

          .login-box {
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 30px;
            max-width: 400px;
            width: 100%;
          }

          .logo {
            width: 50px;
            margin-right: 10px;
          }

          .info-text {
            text-align: center;
            font-style: italic;
            font-size: 16px;
          }

          .error-text {
            color: red;
            text-align: center;
            font-weight: bold;
          }

          .login-btn {
            width: 100%;
            border-radius: 10px;
            background-color: #D569D6;
            border-color: #D569D6;
            color: white;
            padding: 10px;
            font-weight: bold;
            transition: 0.3s;
          }

          .login-btn:hover {
            background-color: #c254c2;
          }

          .google-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #db4437;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            color: white;
            font-size: 20px;
            transition: 0.3s;
          }

          .google-btn:hover {
            background-color: #c1351d;
          }
        `}
      </style>
    </div>
  );
};

export default InternalLoginPage;
