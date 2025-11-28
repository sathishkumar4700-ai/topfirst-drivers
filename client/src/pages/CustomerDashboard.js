import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    serviceType: 'hourly',
    date: '',
    time: '',
    hours: 1,
    notes: ''
  });

  useEffect(() => {
    fetchBookings();

    // Auto-refresh bookings every 10 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      fetchBookings();
      setLastRefresh(new Date());
    }, 10000); // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` },
        params: { _t: Date.now() } // Cache buster
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/bookings', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Booking created successfully!');
      setShowBookingForm(false);
      setFormData({
        pickupLocation: '',
        dropLocation: '',
        serviceType: 'hourly',
        date: '',
        time: '',
        hours: 1,
        notes: ''
      });
      fetchBookings();
    } catch (error) {
      alert('Error creating booking: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchBookings();
      setLastRefresh(new Date());
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="customer-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <button onClick={() => navigate('/')} className="btn-back" title="Back to Home">
            ← Back
          </button>
          <h2>Customer Dashboard</h2>
          <span className="last-refresh" title="Last data refresh">
            Updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
        <div className="nav-actions">
          <button 
            onClick={handleRefresh} 
            className={`btn-refresh ${isRefreshing ? 'refreshing' : ''}`}
            title="Refresh bookings"
            disabled={isRefreshing}
          >
            🔄 {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <button onClick={() => setShowBookingForm(!showBookingForm)} className="btn-primary">
            {showBookingForm ? 'Cancel' : 'New Booking'}
          </button>
        </div>

        {showBookingForm && (
          <div className="booking-form-container">
            <h3>Create New Booking</h3>
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Drop Location</label>
                <input
                  type="text"
                  name="dropLocation"
                  value={formData.dropLocation}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                >
                  <option value="hourly">Hourly</option>
                  <option value="airport">Airport Transfer</option>
                  <option value="outstation">Outstation</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {formData.serviceType === 'hourly' && (
                <div className="form-group">
                  <label>Hours</label>
                  <input
                    type="number"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <button type="submit" className="btn-submit">Submit Booking</button>
            </form>
          </div>
        )}

        <div className="bookings-section">
          <h3>My Bookings</h3>
          {bookings.length === 0 ? (
            <p className="no-bookings">No bookings yet. Create your first booking!</p>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                    <span className="booking-date">
                      {new Date(booking.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
                    <p><strong>Drop:</strong> {booking.dropLocation}</p>
                    <p><strong>Service:</strong> {booking.serviceType}</p>
                    <p><strong>Time:</strong> {booking.time}</p>
                    {booking.driver && (
                      <p><strong>Driver:</strong> {booking.driver.name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;