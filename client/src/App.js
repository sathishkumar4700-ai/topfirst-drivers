import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DriverRegistration from './pages/DriverRegistration';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/driver-registration" element={<DriverRegistration />} />
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/driver" element={<PrivateRoute role="driver"><DriverDashboard /></PrivateRoute>} />
        <Route path="/customer" element={<PrivateRoute role="customer"><CustomerDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
