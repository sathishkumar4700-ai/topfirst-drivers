import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [content, setContent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [showDriverStatus, setShowDriverStatus] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchStats();
    fetchDrivers();
    fetchPendingDrivers();
    fetchCustomers();
    fetchBookings();
    fetchContent();

    // Auto-refresh data every 10 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      fetchStats();
      fetchDrivers();
      fetchPendingDrivers();
      fetchCustomers();
      fetchBookings();
      setLastRefresh(new Date());
    }, 10000); // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats', {
        ...config,
        params: { _t: Date.now() } // Cache buster
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get('/api/admin/drivers', {
        ...config,
        params: { _t: Date.now() } // Cache buster
      });
      setDrivers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingDrivers = async () => {
    try {
      const res = await axios.get('/api/admin/drivers/pending-approvals', {
        ...config,
        params: { _t: Date.now() } // Cache buster
      });
      setPendingDrivers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveDriver = async (driverId) => {
    if (!window.confirm('Are you sure you want to approve this driver?')) return;
    try {
      await axios.put(`/api/admin/drivers/${driverId}/approve`, {}, config);
      alert('Driver approved successfully!');
      fetchPendingDrivers();
      fetchDrivers();
      fetchStats();
    } catch (err) {
      alert('Error approving driver');
      console.error(err);
    }
  };

  const rejectDriver = async (driverId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await axios.put(`/api/admin/drivers/${driverId}/reject`, { reason }, config);
      alert('Driver rejected');
      fetchPendingDrivers();
      fetchDrivers();
      fetchStats();
    } catch (err) {
      alert('Error rejecting driver');
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/admin/customers', {
        ...config,
        params: { _t: Date.now() } // Cache buster
      });
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/admin/bookings', {
        ...config,
        params: { _t: Date.now() } // Cache buster
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await axios.get('/api/admin/content', {
        ...config,
        params: { _t: Date.now() } // Cache buster
      });
      setContent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchDrivers(),
        fetchPendingDrivers(),
        fetchCustomers(),
        fetchBookings(),
        fetchContent()
      ]);
      setLastRefresh(new Date());
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    
    try {
      await axios.delete(`/api/admin/${type}/${id}`, config);
      if (type === 'drivers') fetchDrivers();
      else if (type === 'customers') fetchCustomers();
      else if (type === 'bookings') fetchBookings();
      else if (type === 'content') fetchContent();
      alert('Deleted successfully');
    } catch (err) {
      alert('Error deleting: ' + err.response?.data?.message);
    }
  };

  const copyPhoneNumber = (phone) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone).then(() => {
        alert(`Phone number ${phone} copied to clipboard!`);
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = phone;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(`Phone number ${phone} copied to clipboard!`);
      });
    }
  };

  const getSortedDrivers = () => {
    const approvedDrivers = drivers.filter(d => d.approvalStatus === 'approved');
    return approvedDrivers.sort((a, b) => {
      const statusOrder = { 'online': 1, 'occupied': 2, 'offline': 3 };
      const statusA = a.status || 'offline';
      const statusB = b.status || 'offline';
      return statusOrder[statusA] - statusOrder[statusB];
    });
  };

  const getDriverStatusCounts = () => {
    const approvedDrivers = drivers.filter(d => d.approvalStatus === 'approved');
    return {
      online: approvedDrivers.filter(d => d.status === 'online').length,
      occupied: approvedDrivers.filter(d => d.status === 'occupied').length,
      offline: approvedDrivers.filter(d => !d.status || d.status === 'offline').length
    };
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="nav-left">
          <button onClick={() => navigate('/')} className="btn-back" title="Back to Home">
            ← Back
          </button>
          <h1>Admin Panel</h1>
          <span className="last-refresh" title="Last data refresh">
            Updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
        <div className="nav-actions">
          <button 
            onClick={handleRefresh} 
            className={`btn-refresh ${isRefreshing ? 'refreshing' : ''}`}
            title="Refresh data"
            disabled={isRefreshing}
          >
            🔄 {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={() => setShowChangePassword(true)} className="btn-change-password">
            🔑 Change Password
          </button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="admin-container">
        <aside className="sidebar">
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
            Dashboard
          </button>
          <button onClick={() => setActiveTab('pending-drivers')} className={activeTab === 'pending-drivers' ? 'active' : ''}>
            Pending Approvals {pendingDrivers.length > 0 && <span className="badge">{pendingDrivers.length}</span>}
          </button>
          <button onClick={() => setActiveTab('content')} className={activeTab === 'content' ? 'active' : ''}>
            Homepage Content
          </button>
          <button onClick={() => setActiveTab('drivers')} className={activeTab === 'drivers' ? 'active' : ''}>
            Drivers
          </button>
          <button onClick={() => setActiveTab('customers')} className={activeTab === 'customers' ? 'active' : ''}>
            Customers
          </button>
          <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'active' : ''}>
            Bookings
          </button>
          <button onClick={() => setShowDriverStatus(true)} className="btn-driver-status">
            📊 Driver Status
          </button>
        </aside>

        <main className="main-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-stats">
              <h2>Dashboard Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{stats.totalDrivers || 0}</h3>
                  <p>Total Drivers</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.activeDrivers || 0}</h3>
                  <p>Active Drivers</p>
                </div>
                <div className="stat-card highlight">
                  <h3>{stats.pendingDriverApprovals || 0}</h3>
                  <p>Pending Driver Approvals</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.totalCustomers || 0}</h3>
                  <p>Total Customers</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.totalBookings || 0}</h3>
                  <p>Total Bookings</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.pendingBookings || 0}</h3>
                  <p>Pending Bookings</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.completedBookings || 0}</h3>
                  <p>Completed Bookings</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pending-drivers' && (
            <div className="pending-drivers-section">
              <div className="section-header">
                <h2>Pending Driver Approvals</h2>
                <p className="subtitle">Review and approve new driver applications</p>
              </div>
              {pendingDrivers.length === 0 ? (
                <div className="empty-state">
                  <p>✓ No pending driver approvals</p>
                </div>
              ) : (
                <div className="pending-drivers-grid">
                  {pendingDrivers.map(driver => (
                    <div key={driver._id} className="pending-driver-card">
                      <div className="driver-header">
                        <h3>{driver.userId?.name}</h3>
                        <span className="status-badge pending">Pending</span>
                      </div>
                      <div className="driver-details">
                        <p><strong>Email:</strong> {driver.userId?.email}</p>
                        <p><strong>Phone:</strong> {driver.userId?.phone}</p>
                        <p><strong>Address:</strong> {driver.address}</p>
                        <p><strong>License Number:</strong> {driver.licenseNumber}</p>
                        <p><strong>Aadhar Number:</strong> {driver.aadharNumber}</p>
                        <p><strong>Vehicle Type:</strong> {driver.vehicleType}</p>
                        <p><strong>Experience:</strong> {driver.experience} years</p>
                        <p><strong>Applied:</strong> {new Date(driver.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      {driver.documents && (
                        <div className="driver-documents">
                          <h4>Documents:</h4>
                          <div className="document-links">
                            {driver.documents.licenseDoc && (
                              <a href={`/${driver.documents.licenseDoc}`} target="_blank" rel="noopener noreferrer" className="doc-link">
                                📄 License
                              </a>
                            )}
                            {driver.documents.aadharDoc && (
                              <a href={`/${driver.documents.aadharDoc}`} target="_blank" rel="noopener noreferrer" className="doc-link">
                                📄 Aadhar
                              </a>
                            )}
                            {driver.documents.photo && (
                              <a href={`/${driver.documents.photo}`} target="_blank" rel="noopener noreferrer" className="doc-link">
                                📷 Photo
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="driver-actions">
                        <button onClick={() => approveDriver(driver._id)} className="btn-approve">
                          ✓ Approve
                        </button>
                        <button onClick={() => rejectDriver(driver._id)} className="btn-reject">
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Homepage Content Management</h2>
                <button onClick={() => openModal('content')} className="btn-add">Add Content</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Icon</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {content.map(item => (
                    <tr key={item._id}>
                      <td><span className="badge">{item.section}</span></td>
                      <td>{item.title}</td>
                      <td>{item.description?.substring(0, 50)}...</td>
                      <td>{item.icon}</td>
                      <td>{item.order}</td>
                      <td>{item.isActive ? '✓ Active' : '✗ Inactive'}</td>
                      <td>
                        <button onClick={() => openModal('content', item)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete('content', item._id)} className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'drivers' && (
            <div className="drivers-section">
              <div className="section-header">
                <h2>Drivers Management</h2>
                <button onClick={() => openModal('driver')} className="btn-add">Add Driver</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>License</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map(driver => (
                    <tr key={driver._id}>
                      <td>{driver.userId?.name}</td>
                      <td>{driver.userId?.email}</td>
                      <td>{driver.userId?.phone}</td>
                      <td>{driver.licenseNumber}</td>
                      <td>{driver.vehicleType}</td>
                      <td>{driver.isAvailable ? 'Available' : 'Unavailable'}</td>
                      <td>
                        <button onClick={() => openModal('driver', driver)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete('drivers', driver._id)} className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="customers-section">
              <h2>Customers Management</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer._id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.isActive ? 'Active' : 'Inactive'}</td>
                      <td>
                        <button onClick={() => openModal('customer', customer)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete('customers', customer._id)} className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <h2>Bookings Management</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Pickup</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.customerId?.name}</td>
                      <td>{booking.serviceType}</td>
                      <td>{booking.pickupLocation}</td>
                      <td>{new Date(booking.pickupDate).toLocaleDateString()}</td>
                      <td>{booking.status}</td>
                      <td>₹{booking.amount}</td>
                      <td>
                        <button onClick={() => openModal('booking', booking)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete('bookings', booking._id)} className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <Modal
          type={modalType}
          item={editItem}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            if (modalType === 'driver') fetchDrivers();
            else if (modalType === 'customer') fetchCustomers();
            else if (modalType === 'booking') fetchBookings();
            else if (modalType === 'content') fetchContent();
          }}
          config={config}
        />
      )}

      {showDriverStatus && (
        <DriverStatusModal
          drivers={getSortedDrivers()}
          statusCounts={getDriverStatusCounts()}
          onClose={() => setShowDriverStatus(false)}
          onCopyPhone={copyPhoneNumber}
        />
      )}

      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
          config={config}
        />
      )}
    </div>
  );
};

const DriverStatusModal = ({ drivers, statusCounts, onClose, onCopyPhone }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const getStatusIcon = (status) => {
    if (status === 'online') return '🟢';
    if (status === 'occupied') return '🔴';
    return '⚫';
  };

  const getStatusLabel = (status) => {
    if (status === 'online') return 'Online';
    if (status === 'occupied') return 'Occupied';
    return 'Offline';
  };

  const filteredDrivers = drivers.filter(driver => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const name = driver.userId?.name?.toLowerCase() || '';
    const phone = driver.userId?.phone?.toLowerCase() || '';
    const address = driver.address?.toLowerCase() || '';
    
    return name.includes(query) || phone.includes(query) || address.includes(query);
  });

  const filteredCounts = {
    online: filteredDrivers.filter(d => d.status === 'online').length,
    occupied: filteredDrivers.filter(d => d.status === 'occupied').length,
    offline: filteredDrivers.filter(d => !d.status || d.status === 'offline').length
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="driver-status-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 Driver Status</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, phone, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="status-summary">
          <div className="status-card online">
            <div className="status-count">{filteredCounts.online}</div>
            <div className="status-label">🟢 Online</div>
          </div>
          <div className="status-card occupied">
            <div className="status-count">{filteredCounts.occupied}</div>
            <div className="status-label">🔴 Occupied</div>
          </div>
          <div className="status-card offline">
            <div className="status-count">{filteredCounts.offline}</div>
            <div className="status-label">⚫ Offline</div>
          </div>
        </div>

        <div className="drivers-list">
          {filteredDrivers.length === 0 ? (
            <div className="empty-state">
              <p>{searchQuery ? 'No drivers found matching your search' : 'No approved drivers found'}</p>
            </div>
          ) : (
            filteredDrivers.map(driver => {
              const status = driver.status || 'offline';
              return (
                <div key={driver._id} className={`driver-status-card ${status}`}>
                  <div className="driver-status-header">
                    <h3>{driver.userId?.name}</h3>
                    <span className={`status-badge ${status}`}>
                      {getStatusIcon(status)} {getStatusLabel(status)}
                    </span>
                  </div>
                  <div className="driver-status-details">
                    <p className="driver-address">📍 {driver.address}</p>
                    <p className="driver-info">
                      🚗 {driver.vehicleType} | {driver.experience} years experience
                    </p>
                    <div className="driver-phone-section">
                      <button 
                        className="btn-copy-phone"
                        onClick={() => onCopyPhone(driver.userId?.phone)}
                        title="Copy phone number"
                      >
                        📞 {driver.userId?.phone}
                      </button>
                    </div>
                    {driver.lastStatusUpdate && (
                      <p className="last-update">
                        Last update: {new Date(driver.lastStatusUpdate).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const Modal = ({ type, item, onClose, onSuccess, config }) => {
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = type === 'content' ? '/api/admin/content' : `/api/admin/${type}s`;
      if (item) {
        await axios.put(`${endpoint}/${item._id}`, formData, config);
      } else {
        await axios.post(endpoint, formData, config);
      }
      alert('Success!');
      onSuccess();
    } catch (err) {
      alert('Error: ' + err.response?.data?.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{item ? 'Edit' : 'Add'} {type}</h3>
        <form onSubmit={handleSubmit}>
          {type === 'content' && (
            <>
              <select value={formData.section || 'feature'} onChange={(e) => setFormData({...formData, section: e.target.value})} required>
                <option value="">Select Section</option>
                <option value="hero">Hero</option>
                <option value="intro">Intro</option>
                <option value="feature">Feature</option>
                <option value="service">Service</option>
                <option value="contact">Contact</option>
              </select>
              <input placeholder="Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="4" />
              <input placeholder="Icon (emoji or text)" value={formData.icon || ''} onChange={(e) => setFormData({...formData, icon: e.target.value})} />
              <input placeholder="Order" type="number" value={formData.order || 0} onChange={(e) => setFormData({...formData, order: e.target.value})} />
              <label>
                <input type="checkbox" checked={formData.isActive !== false} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                Active
              </label>
            </>
          )}
          {type === 'driver' && (
            <>
              <input placeholder="Name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input placeholder="Email" type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <input placeholder="Phone" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              {!item && <input placeholder="Password" type="password" value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} required />}
              <input placeholder="License Number" value={formData.licenseNumber || ''} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} required />
              <select value={formData.vehicleType || 'car'} onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="both">Both</option>
              </select>
            </>
          )}
          <div className="modal-actions">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ChangePasswordModal = ({ onClose, config }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, config);

      alert('Password changed successfully! Please login again with your new password.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="change-password-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔑 Change Password</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="change-password-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password (min 6 characters)"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              required
              disabled={loading}
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
