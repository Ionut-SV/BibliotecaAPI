import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Register from './Auth/Register.jsx';
import Login from './Auth/Login.jsx';
import BookListPage from './pages/BookListPage.jsx';
import BookUploadForm from './pages/Upload.jsx';
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
            element={<BookListPage />}
          />
          <Route
            path="/"
            element={<Navigate to="/login" />}
          />
           <Route 
            path="/add" 
            element={<BookUploadForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
