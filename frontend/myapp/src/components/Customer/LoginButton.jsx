import React from 'react';
import { Link } from 'react-router-dom';

const LoginButton = () => {
  return (
    <>
      <style>
        {`
          .login-button {
            background-color:rgb(226, 32, 200);
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
            background-color: rgb(230, 70, 208);
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