const mongoose = require('mongoose');
const Content = require('./models/Content');
require('dotenv').config();

const seedData = [
  // Features
  { section: 'feature', title: '24/7 Availability', description: 'Book a driver anytime—day or night—within minutes', icon: '🕐', order: 1 },
  { section: 'feature', title: 'Verified & Experienced', description: 'Background-checked professionals with valid licenses and city driving expertise', icon: '✓', order: 2 },
  { section: 'feature', title: 'Transparent Pricing', description: 'No hidden costs; clear hourly, daily, and outstation rates', icon: '💰', order: 3 },
  { section: 'feature', title: 'Home Pickup & Drop', description: 'Drivers reach your doorstep or pickup point on time', icon: '🏠', order: 4 },
  { section: 'feature', title: 'City & Outstation', description: 'Perfect for daily errands, meetings, events, and long-distance travel', icon: '🚗', order: 5 },
  { section: 'feature', title: 'Safe & Responsible', description: 'Alcohol-free, disciplined, and trained in defensive driving', icon: '🛡️', order: 6 },
  { section: 'feature', title: 'Flexible Booking', description: 'Hourly, shift-based, full-day, and outstation driver services', icon: '⏱️', order: 7 },
  { section: 'feature', title: 'Corporate & Events', description: 'Bulk hiring options for companies, hotels, and special events', icon: '🏢', order: 8 },
  { section: 'feature', title: 'Customer Support', description: 'Quick response and real-time updates through call or WhatsApp', icon: '📞', order: 9 },
  
  // Services
  { section: 'service', title: 'Hourly Drivers', description: 'Hire drivers by the hour for your convenience. Perfect for shopping, errands, or short trips around the city.', order: 1 },
  { section: 'service', title: 'Airport Transfers', description: 'Reliable pickup and drop services for hassle-free airport commutes at any time.', order: 2 },
  { section: 'service', title: 'Outstation Trips', description: 'Long distance travel with experienced drivers who know the routes well.', order: 3 },
  { section: 'service', title: 'Corporate Services', description: 'Professional drivers for business needs, meetings, and corporate events.', order: 4 }
];

const seedContent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/topfirst-drivers');
    console.log('MongoDB Connected');

    // Clear existing content
    await Content.deleteMany({});
    console.log('Cleared existing content');

    // Insert seed data
    await Content.insertMany(seedData);
    console.log('Seed data inserted successfully');

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedContent();
