import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import LoginPage from '../Customer/Login/LoginPage';

const CustomerPrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('userRole');

    if (token && userRole === '1') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        <div
          className="modal fade show"
          id="customerLoginModal"
          tabIndex="-1"
          aria-labelledby="customerLoginModalLabel"
          aria-hidden="true"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <LoginPage />
        </div>
      </>
    );
  }

  return <Outlet />;
};

export default CustomerPrivateRoute;
