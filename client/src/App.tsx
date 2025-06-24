import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminFeedback from './components/AdminFeedback';
import AdminDashboard from './components/AdminDashboard';
import ReceptionRoomManagement from './components/ReceptionRoomManagement';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<div>Forgot Password Page</div>} />
        <Route path="/home" element={<div>Home Page</div>} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/reception/rooms" element={<ReceptionRoomManagement />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 