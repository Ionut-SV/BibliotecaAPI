import React from 'react';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Buttons.css';

const Buttons = () => {
  const { isAuthenticated, logout } = useAuth(); // Obținem starea de autentificare
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home'); 
  };

  return (
    <div className="button-container">
      {isAuthenticated ? (
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <>
          <Link to="/login">
            <Button type="primary">
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button type="primary">
              Register
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Buttons;
