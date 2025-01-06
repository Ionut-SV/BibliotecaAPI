import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BasketProvider } from './contexts/BasketContext';
import Register from './Auth/Register.jsx';
import Login from './Auth/Login.jsx';
import BookListPage from './pages/BookListPage.jsx';
import BookUploadForm from './pages/Upload.jsx';
import BookDetailsPage from './pages/DetailsPage.jsx';
import BookUpdateForm from './pages/Update.jsx';
import BasketPage from './pages/BasketPage.jsx'
import "./App.css";
const App = () => {
  return (
    <AuthProvider>
      <BasketProvider>
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
              element={<BookListPage/>}
            />
            <Route 
              path="/book/:id"
              element={<BookDetailsPage />} 
            />
            <Route
              path="/update/:id"
              element={<BookUpdateForm/>}
            />
            <Route
              path="/basket" 
              element={<BasketPage />} 
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
      </BasketProvider>
    </AuthProvider>
  );
};

export default App;
