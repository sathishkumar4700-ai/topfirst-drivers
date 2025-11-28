import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState('pending');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProfile();

    // Auto-refresh data every 10 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      fetchProfile();
      setLastRefresh(new Date());
    }, 10000); // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (profile && profile.isApproved && profile.approvalStatus === 'approved') {
      fetchBookings();
      
      // Auto-refresh bookings every 10 seconds
      const bookingsInterval = setInterval(() => {
        fetchBookings();
      }, 10000);

      return () => clearInterval(bookingsInterval);
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/drivers/profile', {
        ...config,
        params: { _t: Date.now() } // Cache buster
      });
      setProfile(res.data);
      setIsAvailable(res.data.isAvailable);
      setApprovalStatus(res.data.approvalStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/drivers/my-bookings', {
        ...config,
        params: { _t: Date.now() } // Cache buster
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        // Account not approved yet
        setApprovalStatus(err.response.data.approvalStatus);
      }
    }
  };

  const toggleAvailability = async () => {
    if (!profile?.isApproved) {
      alert('Your account must be approved by admin first');
      return;
    }
    try {
      await axios.put('/api/drivers/availability', { isAvailable: !isAvailable }, config);
      setIsAvailable(!isAvailable);
      alert('Availability updated');
    } catch (err) {
      alert('Error updating availability');
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`/api/drivers/bookings/${bookingId}/status`, { status }, config);
      fetchBookings();
      alert('Status updated');
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchProfile();
      if (profile && profile.isApproved) {
        await fetchBookings();
      }
      setLastRefresh(new Date());
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Show approval pending screen
  if (profile && !profile.isApproved) {
    return (
      <div className="driver-dashboard">
        <nav className="driver-nav">
          <div className="nav-left">
            <button onClick={() => navigate('/')} className="btn-back" title="Back to Home">
              ← Back
            </button>
            <h1>Driver Dashboard</h1>
            <span className="last-refresh" title="Last data refresh">
              Updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
          <div>
            <button 
              onClick={handleRefresh} 
              className={`btn-refresh ${isRefreshing ? 'refreshing' : ''}`}
              title="Refresh data"
              disabled={isRefreshing}
            >
              🔄 {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </nav>

        <div className="driver-container">
          <div className="approval-pending-card">
            {approvalStatus === 'pending' && (
              <>
                <div className="pending-icon">⏳</div>
                <h2>Account Pending Approval</h2>
                <p>Welcome, {profile.userId?.name}!</p>
                <p>Your driver account has been created successfully and is currently under review by our admin team.</p>
                <div className="pending-details">
                  <h3>Your Details:</h3>
                  <p><strong>License Number:</strong> {profile.licenseNumber}</p>
                  <p><strong>Vehicle Type:</strong> {profile.vehicleType}</p>
                  <p><strong>Experience:</strong> {profile.experience} years</p>
                  {profile.address && <p><strong>Address:</strong> {profile.address}</p>}
                </div>
                <div className="pending-message">
                  <p>✓ You will receive a notification once your account is approved</p>
                  <p>✓ After approval, you can start accepting ride requests</p>
                  <p>✓ Please ensure your contact details are correct</p>
                </div>
              </>
            )}
            {approvalStatus === 'rejected' && (
              <>
                <div className="rejected-icon">❌</div>
                <h2>Account Rejected</h2>
                <p>Unfortunately, your driver application has been rejected.</p>
                {profile.rejectionReason && (
                  <div className="rejection-reason">
                    <h3>Reason:</h3>
                    <p>{profile.rejectionReason}</p>
                  </div>
                )}
                <p>Please contact support for more information or to reapply.</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      <nav className="driver-nav">
        <div className="nav-left">
          <button onClick={() => navigate('/')} className="btn-back" title="Back to Home">
            ← Back
          </button>
          <h1>Driver Dashboard</h1>
          <span className="last-refresh" title="Last data refresh">
            Updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
        <div>
          <button 
            onClick={handleRefresh} 
            className={`btn-refresh ${isRefreshing ? 'refreshing' : ''}`}
            title="Refresh data"
            disabled={isRefreshing}
          >
            🔄 {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={toggleAvailability} className={`btn-availability ${isAvailable ? 'available' : 'unavailable'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="driver-container">
        {profile && (
          <div className="profile-card">
            <h2>Welcome, {profile.userId?.name}</h2>
            <p>Total Rides: {profile.totalRides}</p>
            <p>Rating: {profile.rating || 'N/A'}</p>
            <p>Experience: {profile.experience} years</p>
            <div className="approval-badge">✓ Approved Driver</div>
          </div>
        )}

        <div className="bookings-section">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings assigned yet</p>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.serviceType}</h3>
                    <span className={`status ${booking.status}`}>{booking.status}</span>
                  </div>
                  <p><strong>Customer:</strong> {booking.customerId?.name}</p>
                  <p><strong>Phone:</strong> {booking.customerId?.phone}</p>
                  <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
                  {booking.dropLocation && <p><strong>Drop:</strong> {booking.dropLocation}</p>}
                  <p><strong>Date:</strong> {new Date(booking.pickupDate).toLocaleString()}</p>
                  <p><strong>Amount:</strong> ₹{booking.amount}</p>
                  
                  <div className="booking-actions">
                    {booking.status === 'assigned' && (
                      <>
                        <button onClick={() => updateBookingStatus(booking._id, 'accepted')} className="btn-accept">Accept</button>
                        <button onClick={() => updateBookingStatus(booking._id, 'cancelled')} className="btn-reject">Reject</button>
                      </>
                    )}
                    {booking.status === 'accepted' && (
                      <button onClick={() => updateBookingStatus(booking._id, 'started')} className="btn-start">Start Ride</button>
                    )}
                    {booking.status === 'started' && (
                      <button onClick={() => updateBookingStatus(booking._id, 'completed')} className="btn-complete">Complete Ride</button>
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

export default DriverDashboard;
