import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Register from './Auth/Register.jsx';
import Login from './Auth/Login.jsx';
import BookList from './components/BookList.jsx';
import "./App.css";
const App = () => {
  return (
    <AuthProvider>  {/* Wrap your app with AuthProvider */}
      <Router>
        <Routes>
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/home"
            element={<BookList />}
          />
          <Route
            path="/"
            element={<Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
