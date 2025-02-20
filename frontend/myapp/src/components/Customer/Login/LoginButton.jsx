import React from 'react';
import { FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';

const LoginButton = () => {
  return (
    <div>
      <style>
        {`
          .login-button {
            background-color: #ff69b4; /* Pink color */
            border: none;
            color: #fff;
            font-weight: 500;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            text-align: center;
            transition: background 0.3s;
          }

          .login-button:hover {
            background-color: #ff85c1; /* Lighter pink color */
            color: #fff;
          }

          .login-button .icon {
            margin-right: 8px;
          }

          .login-button .text {
            font-size: 16px;
            font-weight: bold;
          }
        `}
      </style>
      <Link to="/login" className="login-button">
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaLock className="icon" />
          <span className="text">Login</span>
        </div>
      </Link>
    </div>
  );
};

export default LoginButton;
