import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/register" element={<div>Register Page</div>} />
        <Route path="/auth/forgot-password" element={<div>Forgot Password Page</div>} />
        <Route path="/home" element={<div>Home Page</div>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 