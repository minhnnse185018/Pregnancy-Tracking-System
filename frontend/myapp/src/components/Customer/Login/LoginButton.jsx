import React from 'react';
import { Link } from 'react-router-dom';

const LoginButton = () => {
  return (
    <>
      <style>
        {`
          .login-button {
            border: none;
            color: #fff;
            font-weight: 500;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            text-align: center;
          }

          .login-button:hover {
            color: #fff;
          }
        `}
      </style>
      <Link to="/login" className="login-button">
        Đăng nhập
      </Link>
    </>
  );
};

export default LoginButton;