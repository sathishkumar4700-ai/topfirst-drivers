import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const location = useLocation();
  const roleFromState = location.state?.role || 'customer';
  
  const [isLogin, setIsLogin] = useState(true);
  const [userRole, setUserRole] = useState(roleFromState);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    licenseNumber: '',
    aadharNumber: '',
    vehicleType: 'car',
    experience: ''
  });
  const [documents, setDocuments] = useState({
    license: null,
    aadhar: null,
    photo: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setDocuments({ ...documents, [name]: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem('token', response.data.token);
        
        const role = response.data.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'driver') navigate('/driver');
        else navigate('/customer');
      } else {
        // Registration
        if (userRole === 'driver') {
          // Driver registration with documents
          const formDataToSend = new FormData();
          formDataToSend.append('name', formData.name);
          formDataToSend.append('email', formData.email);
          formDataToSend.append('phone', formData.phone);
          formDataToSend.append('password', formData.password);
          formDataToSend.append('address', formData.address);
          formDataToSend.append('licenseNumber', formData.licenseNumber);
          formDataToSend.append('aadharNumber', formData.aadharNumber);
          formDataToSend.append('vehicleType', formData.vehicleType);
          formDataToSend.append('experience', formData.experience || '0');
          
          if (documents.license) formDataToSend.append('licenseDoc', documents.license);
          if (documents.aadhar) formDataToSend.append('aadharDoc', documents.aadhar);
          if (documents.photo) formDataToSend.append('photo', documents.photo);

          await axios.post('/api/auth/register-driver', formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          setSuccess(true);
          setTimeout(() => {
            setIsLogin(true);
            setSuccess(false);
          }, 3000);
        } else {
          // Customer registration
          const response = await axios.post('/api/auth/register', {
            ...formData,
            role: 'customer'
          });

          localStorage.setItem('token', response.data.token);
          navigate('/customer');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container success-screen">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>Your driver account has been created successfully.</p>
          <p>Please wait for admin approval before you can start accepting rides.</p>
          <p>Switching to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <button onClick={() => navigate('/')} className="btn-back-login" title="Back to Home">
          ← Back to Home
        </button>
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        
        {!isLogin && (
          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${userRole === 'customer' ? 'active' : ''}`}
              onClick={() => setUserRole('customer')}
            >
              👤 Customer
            </button>
            <button
              type="button"
              className={`role-btn ${userRole === 'driver' ? 'active' : ''}`}
              onClick={() => setUserRole('driver')}
            >
              🚗 Driver
            </button>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Login Form */}
          {isLogin && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* Customer Registration */}
          {!isLogin && userRole === 'customer' && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
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
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* Driver Registration */}
          {!isLogin && userRole === 'driver' && (
            <>
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
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
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
                <textarea
                  name="address"
                  placeholder="Address *"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  required
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
                <input
                  type="text"
                  name="aadharNumber"
                  placeholder="Aadhar Number *"
                  value={formData.aadharNumber}
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
                <h3>Upload Documents</h3>
                <div className="file-upload">
                  <label>
                    📄 License Document
                    <input
                      type="file"
                      name="license"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                    {documents.license && <span className="file-name">✓ {documents.license.name}</span>}
                  </label>
                </div>
                <div className="file-upload">
                  <label>
                    📄 Aadhar Document
                    <input
                      type="file"
                      name="aadhar"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                    {documents.aadhar && <span className="file-name">✓ {documents.aadhar.name}</span>}
                  </label>
                </div>
                <div className="file-upload">
                  <label>
                    📷 Your Photo
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {documents.photo && <span className="file-name">✓ {documents.photo.name}</span>}
                  </label>
                </div>
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
              </div>
            </>
          )}
          
          <button type="submit" className="btn-submit">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
        
        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create Account' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
