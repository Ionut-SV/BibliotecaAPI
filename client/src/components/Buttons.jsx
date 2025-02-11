import React from 'react';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BasketDropdown from './DropdownBasket';
import '../styles/Buttons.css';

const Buttons = () => {
  const { isAuthenticated, logout, role } = useAuth(); // Include role from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home'); 
  };

  const goHome= () => {
    navigate('/home'); 
  };

  const handleAddBooks = () => {
    navigate('/add');
  };

  return (
    <div className="button-container">
      {isAuthenticated ? (
        <>
          <Button type="primary" onClick={goHome}>
            Acasa
          </Button>
          {role === 'bibliotecar' && (
            <>
            <Button type="primary" onClick={handleAddBooks}>
              Adauga Carte
            </Button>
            <Button type="primary" onClick={handleLogout}>
              Comenzi
            </Button>
            <Button type="primary" onClick={handleLogout}>
              Istoric
            </Button>
        </>
          )}
          {role === 'membru' && (
        <>
          <BasketDropdown />
          <Button type="primary" onClick={handleLogout}>
            Comenzile Mele
          </Button>
        </>
      )}
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </>
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
