import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DriverRegistration.css';

const DriverRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    vehicleType: 'car',
    experience: '',
    address: '',
    aadharNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await axios.post('/api/auth/register-driver', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        licenseNumber: formData.licenseNumber,
        vehicleType: formData.vehicleType,
        experience: parseInt(formData.experience) || 0,
        address: formData.address,
        aadharNumber: formData.aadharNumber
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  if (success) {
    return (
      <div className="driver-registration-page">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>Your driver account has been created successfully.</p>
          <p>Please wait for admin approval before you can start accepting rides.</p>
          <p>You will be redirected to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-registration-page">
      <div className="registration-container">
        <h2>Driver Registration</h2>
        <p className="subtitle">Join Top First Call Drivers in Chennai</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Number (Optional)"
              value={formData.aadharNumber}
              onChange={handleChange}
            />
            <textarea
              name="address"
              placeholder="Address (Optional)"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-section">
            <h3>Driver Details</h3>
            <input
              type="text"
              name="licenseNumber"
              placeholder="Driving License Number *"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="both">Both</option>
            </select>
            <input
              type="number"
              name="experience"
              placeholder="Years of Experience *"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-section">
            <h3>Account Security</h3>
            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            Register as Driver
          </button>
        </form>
        
        <p className="login-link">
          Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
        </p>
        
        <button onClick={() => navigate('/')} className="btn-back">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default DriverRegistration;
