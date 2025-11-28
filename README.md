# Top First Call Drivers - Chennai

A complete web application for managing call driver services with three portals: Customer, Driver, and Admin.

## Features

### Customer Portal
- Book drivers (hourly, airport, outstation, corporate)
- View booking history and status
- Real-time booking updates

### Driver Portal
- View assigned rides
- Accept/reject bookings
- Update ride status
- Track earnings

### Admin Portal
- **Homepage Content Management (CRUD)** - Edit features, services, and content
- Manage all bookings
- Add/edit/manage drivers
- Assign rides to drivers
- View analytics and reports

## Tech Stack

**Frontend:** React.js, React Router, Axios, CSS3
**Backend:** Node.js, Express.js, MongoDB, JWT Authentication
**Security:** bcrypt password hashing, JWT tokens

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Install Server Dependencies**
```bash
cd server
npm install
```

2. **Install Client Dependencies**
```bash
cd client
npm install
```

3. **Configure Environment**
Create `server/.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/topfirst-drivers
JWT_SECRET=your_secret_key_here
```

4. **Start MongoDB**
Make sure MongoDB is running locally or use MongoDB Atlas

5. **Seed Initial Content (Optional)**
```bash
cd server
node seedContent.js
```

6. **Start the Server**
```bash
cd server
npm start
```

7. **Start the Client**
```bash
cd client
npm start
```

The application will open at `http://localhost:3000`

## Default Login Credentials

Create users through the registration or use the API to seed initial admin/driver accounts.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── package.json
│
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── server.js         # Express server
│
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Bookings
- GET `/api/bookings/my-bookings` - Get user bookings
- POST `/api/bookings` - Create new booking
- GET `/api/bookings` - Get all bookings (Admin)
- PUT `/api/bookings/:id/assign` - Assign driver (Admin)

### Drivers
- GET `/api/drivers` - Get all drivers
- POST `/api/drivers` - Add new driver
- PUT `/api/drivers/:id` - Update driver

### Content (Homepage Management)
- GET `/api/content` - Get all active content (Public)
- GET `/api/content/:section` - Get content by section (Public)
- GET `/api/admin/content` - Get all content (Admin)
- POST `/api/admin/content` - Create new content (Admin)
- PUT `/api/admin/content/:id` - Update content (Admin)
- DELETE `/api/admin/content/:id` - Delete content (Admin)

## Contact

**Primary Contact:** +91 9962366104  
**Email:** Kraja4700@gmail.com  
**WhatsApp:** +91 9962366104  
**Location:** Chennai, Tamil Nadu
