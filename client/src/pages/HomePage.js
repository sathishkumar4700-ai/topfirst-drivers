import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [featuresRes, servicesRes] = await Promise.all([
        axios.get('/api/content/feature'),
        axios.get('/api/content/service')
      ]);
      setFeatures(featuresRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default features if database is empty
  const defaultFeatures = [
    { icon: '🕐', title: '24/7 Availability', description: 'Book a driver anytime—day or night—within minutes' },
    { icon: '✓', title: 'Verified & Experienced', description: 'Background-checked professionals with valid licenses and city driving expertise' },
    { icon: '💰', title: 'Transparent Pricing', description: 'No hidden costs; clear hourly, daily, and outstation rates' },
    { icon: '🏠', title: 'Home Pickup & Drop', description: 'Drivers reach your doorstep or pickup point on time' },
    { icon: '🚗', title: 'City & Outstation', description: 'Perfect for daily errands, meetings, events, and long-distance travel' },
    { icon: '🛡️', title: 'Safe & Responsible', description: 'Alcohol-free, disciplined, and trained in defensive driving' },
    { icon: '⏱️', title: 'Flexible Booking', description: 'Hourly, shift-based, full-day, and outstation driver services' },
    { icon: '🏢', title: 'Corporate & Events', description: 'Bulk hiring options for companies, hotels, and special events' },
    { icon: '📞', title: 'Customer Support', description: 'Quick response and real-time updates through call or WhatsApp' }
  ];

  const defaultServices = [
    { title: 'Hourly Drivers', description: 'Hire drivers by the hour for your convenience. Perfect for shopping, errands, or short trips around the city.' },
    { title: 'Airport Transfers', description: 'Reliable pickup and drop services for hassle-free airport commutes at any time.' },
    { title: 'Outstation Trips', description: 'Long distance travel with experienced drivers who know the routes well.' },
    { title: 'Corporate Services', description: 'Professional drivers for business needs, meetings, and corporate events.' }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;
  const displayServices = services.length > 0 ? services : defaultServices;

  const openLoginModal = (role = 'customer') => {
    navigate('/login', { state: { role } });
  };

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">
            <span className="logo-icon">🚗</span>
            <span>
              <span style={{ color: '#ffd700' }}>Top</span>{' '}
              <span style={{ color: '#ffed4e' }}>First</span>{' '}
              <span style={{ color: '#ffd700' }}>Call Drivers</span>
            </span>
          </h1>
          <div className="nav-links">
            <button onClick={() => openLoginModal('admin')} className="btn-admin">
              👨‍💼 Admin
            </button>
            <button onClick={() => openLoginModal('driver')} className="btn-driver">
              🚗 Driver
            </button>
            <button onClick={() => openLoginModal('customer')} className="btn-customer">
              👤 Customer
            </button>
            <a href="#contact" className="btn-contact">📞 Contact</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <h2 style={{ fontWeight: 800, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            <span style={{ fontSize: '3rem' }}>🚗</span><br />
            <span style={{ color: '#ffd700' }}>Top First</span>{' '}
            <span style={{ color: 'white' }}>Call Drivers</span><br />
            <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>in Chennai</span>
          </h2>
          <p className="tagline" style={{ fontWeight: 500, textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
            Your Trusted Solution for Professional, Reliable, and Trained Drivers
          </p>
          <button onClick={() => openLoginModal('customer')} className="btn-primary">Book Now</button>
        </div>
      </section>

      <section className="intro">
        <div className="container">
          <div className="intro-content">
            <div className="intro-text-section">
              <h3 style={{ fontWeight: 700 }}>
                Welcome to{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Top First Call Drivers
                </span>
              </h3>
              <p className="intro-text">
                Top First Call Drivers in Chennai is your trusted solution for hiring professional, reliable, and trained drivers anytime you need them. 
                Whether it's a late-night pickup, an outstation trip, a personal chauffeur for your car, or a temporary driver for daily commuting, 
                we ensure a smooth and safe driving experience across the city.
              </p>
              <p className="intro-text">
                With a team of verified, experienced, and courteous drivers, we focus on delivering convenience, comfort, and complete peace of mind. 
                Our services are designed to suit individuals, families, corporates, and businesses who require dependable drivers on demand.
              </p>
            </div>
            <div className="intro-image-section">
              <img 
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop" 
                alt="Professional Driver" 
                className="driver-image"
              />
              <div className="image-overlay">
                <p>Professional & Verified Drivers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h3>Why Choose Us?</h3>
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading...</p>
          ) : (
            <div className="features-grid">
              {displayFeatures.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="services">
        <div className="container">
          <h3>Our Services</h3>
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading...</p>
          ) : (
            <div className="service-grid">
              {displayServices.map((service, index) => (
                <div key={index} className="service-card">
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="contact">
        <div className="container">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <strong>Primary Contact</strong>
                <p><a href="tel:+919962366104">+91 9962366104</a></p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <strong>Email</strong>
                <p><a href="mailto:Kraja4700@gmail.com">Kraja4700@gmail.com</a></p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">💬</span>
              <div>
                <strong>WhatsApp</strong>
                <p><a href="https://wa.me/919962366104" target="_blank" rel="noopener noreferrer">+91 9962366104</a></p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <strong>Location</strong>
                <p>Chennai, Tamil Nadu</p>
              </div>
            </div>
          </div>
          <div className="whatsapp-cta">
            <a href="https://wa.me/919962366104?text=Hi%2C%20I%20need%20a%20driver" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="btn-whatsapp">
              <span className="whatsapp-icon">💬</span> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 600 }}>
            &copy; 2024{' '}
            <span style={{ color: '#ffd700', fontWeight: 700 }}>Top First Call Drivers</span>
            . All rights reserved.
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#999' }}>
            🚗 Professional Driver Services in Chennai | Available 24/7
          </p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
