import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Register from './Auth/Register.jsx';
import Login from './Auth/Login.jsx';
import BookList from './components/BookList.jsx';
import { useAuth } from "./contexts/AuthContext.jsx";

const App = () => {
  const { isAuthenticated } = useAuth();
  return (
   
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />}/>
        <Route path="/home" element={<BookList/>}/>
      </Routes>
    </Router>

   

  );
};

export default App;