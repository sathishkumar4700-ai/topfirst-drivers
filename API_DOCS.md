# 📚 API Documentation - Top First Call Drivers

Base URL: `http://localhost:5000/api`

## Authentication

Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Check Phone Number
Check if a phone number exists and get user type.

**Endpoint**: `POST /auth/check-phone`

**Request Body**:
```json
{
  "phone": "9999999999"
}
```

**Response** (Phone exists):
```json
{
  "exists": true,
  "userType": "driver",
  "requiresPassword": true,
  "name": "John Doe",
  "isActive": true
}
```

**Response** (Phone doesn't exist):
```json
{
  "exists": false
}
```

---

### 2. Login with Password (Admin/Driver)
Login for admin and driver accounts using phone + password.

**Endpoint**: `POST /auth/login-password`

**Request Body**:
```json
{
  "phone": "9962366104",
  "password": "Tharish@4700"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Kraja",
    "phone": "9962366104",
    "role": "super_admin",
    "isSuperAdmin": true
  }
}
```

---

### 3. Send OTP (Customer)
Generate and send OTP for customer login/registration.

**Endpoint**: `POST /auth/send-otp`

**Request Body**:
```json
{
  "phone": "9876543210"
}
```

**Response**:
```json
{
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

Note: OTP is only returned in development mode.

---

### 4. Verify OTP (Customer)
Verify OTP and login/register customer.

**Endpoint**: `POST /auth/verify-otp`

**Request Body**:
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Customer",
    "phone": "9876543210",
    "role": "customer",
    "totalBookings": 0
  }
}
```

---

### 5. Register Driver
Register a new driver account (with file uploads).

**Endpoint**: `POST /auth/register-driver`

**Content-Type**: `multipart/form-data`

**Form Fields**:
- `name` (string, required)
- `email` (string, optional)
- `phone` (string, required)
- `password` (string, required)
- `licenseNumber` (string, required)
- `vehicleType` (string: manual/automatic/both)
- `experience` (number)
- `address` (string)
- `aadharNumber` (string)
- `licenseDoc` (file: image/pdf)
- `aadharDoc` (file: image/pdf)
- `photo` (file: image)

**Response**:
```json
{
  "message": "Driver registration successful. Please wait for admin approval.",
  "driver": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Driver",
    "phone": "9876543210",
    "approvalStatus": "pending"
  }
}
```

---

### 6. Register Customer
Register a new customer account.

**Endpoint**: `POST /auth/register-customer`

**Request Body**:
```json
{
  "name": "Jane Customer",
  "phone": "9876543211",
  "email": "jane@example.com",
  "password": "optional123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Customer",
    "phone": "9876543211",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

---

### 7. Request Admin Access
Submit a request for admin access.

**Endpoint**: `POST /auth/request-admin`

**Request Body**:
```json
{
  "phone": "9876543212",
  "name": "Admin Candidate",
  "email": "admin@example.com"
}
```

**Response**:
```json
{
  "message": "Admin access request submitted. Please wait for approval.",
  "request": {
    "id": "507f1f77bcf86cd799439011",
    "phone": "9876543212",
    "status": "pending"
  }
}
```

---

### 8. Get Current User
Get authenticated user's profile.

**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "role": "driver",
  "isActive": true,
  "driverProfile": {
    "licenseNumber": "DL1234567890",
    "vehicleType": "manual",
    "experience": 5,
    "approvalStatus": "approved"
  }
}
```

---

### 9. Reset Driver Password (Admin Only)
Reset a driver's password.

**Endpoint**: `PUT /auth/reset-driver-password`

**Headers**: `Authorization: Bearer <admin_token>`

**Request Body**:
```json
{
  "phone": "9876543210",
  "newPassword": "newpassword123"
}
```

**Response**:
```json
{
  "message": "Driver password reset successfully"
}
```

---

## 👨‍💼 Admin Endpoints

All admin endpoints require admin authentication.

### 1. Get Dashboard Stats
Get statistics for admin dashboard.

**Endpoint**: `GET /admin/stats`

**Headers**: `Authorization: Bearer <admin_token>`

**Response**:
```json
{
  "totalDrivers": 25,
  "activeDrivers": 18,
  "pendingDriverApprovals": 3,
  "totalCustomers": 150,
  "totalBookings": 500,
  "pendingBookings": 12,
  "completedBookings": 450
}
```

---

### 2. Get All Drivers
Get list of all drivers.

**Endpoint**: `GET /admin/drivers`

**Headers**: `Authorization: Bearer <admin_token>`

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": {
      "name": "John Driver",
      "phone": "9876543210",
      "email": "john@example.com"
    },
    "licenseNumber": "DL1234567890",
    "vehicleType": "manual",
    "experience": 5,
    "approvalStatus": "approved",
    "isAvailable": true
  }
]
```

---

### 3. Approve Driver
Approve a pending driver application.

**Endpoint**: `PUT /admin/drivers/:id/approve`

**Headers**: `Authorization: Bearer <admin_token>`

**Response**:
```json
{
  "message": "Driver approved successfully",
  "driver": { ... },
  "notification": "John Driver has been approved and can now access the driver dashboard"
}
```

---

### 4. Reject Driver
Reject a driver application.

**Endpoint**: `PUT /admin/drivers/:id/reject`

**Headers**: `Authorization: Bearer <admin_token>`

**Request Body**:
```json
{
  "reason": "Incomplete documents"
}
```

**Response**:
```json
{
  "message": "Driver application rejected",
  "driver": { ... },
  "notification": "John Driver has been rejected. Reason: Incomplete documents"
}
```

---

### 5. Get All Bookings
Get list of all bookings.

**Endpoint**: `GET /admin/bookings`

**Headers**: `Authorization: Bearer <admin_token>`

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "customerId": {
      "name": "Jane Customer",
      "phone": "9876543211"
    },
    "driverId": {
      "userId": {
        "name": "John Driver",
        "phone": "9876543210"
      }
    },
    "pickupLocation": "Chennai Airport",
    "dropLocation": "T Nagar",
    "pickupDateTime": "2024-11-21T10:00:00.000Z",
    "status": "assigned",
    "amount": 500
  }
]
```

---

### 6. Assign Driver to Booking
Assign a driver to a pending booking.

**Endpoint**: `PUT /admin/bookings/:id`

**Headers**: `Authorization: Bearer <admin_token>`

**Request Body**:
```json
{
  "driverId": "507f1f77bcf86cd799439011",
  "status": "assigned"
}
```

**Response**:
```json
{
  "message": "Booking updated successfully",
  "booking": { ... }
}
```

---

## 🚗 Driver Endpoints

All driver endpoints require driver authentication.

### 1. Get Driver Profile
Get driver's own profile.

**Endpoint**: `GET /drivers/profile`

**Headers**: `Authorization: Bearer <driver_token>`

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": {
    "name": "John Driver",
    "phone": "9876543210",
    "email": "john@example.com"
  },
  "licenseNumber": "DL1234567890",
  "vehicleType": "manual",
  "experience": 5,
  "rating": 4.5,
  "totalRides": 100,
  "isAvailable": true,
  "approvalStatus": "approved"
}
```

---

### 2. Get Driver's Bookings
Get all bookings assigned to the driver.

**Endpoint**: `GET /drivers/my-bookings`

**Headers**: `Authorization: Bearer <driver_token>`

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "customerId": {
      "name": "Jane Customer",
      "phone": "9876543211"
    },
    "pickupLocation": "Chennai Airport",
    "dropLocation": "T Nagar",
    "pickupDateTime": "2024-11-21T10:00:00.000Z",
    "status": "assigned",
    "amount": 500
  }
]
```

---

### 3. Update Booking Status
Update the status of a booking.

**Endpoint**: `PUT /drivers/bookings/:id/status`

**Headers**: `Authorization: Bearer <driver_token>`

**Request Body**:
```json
{
  "status": "in-progress"
}
```

**Response**:
```json
{
  "message": "Booking status updated",
  "booking": { ... }
}
```

---

### 4. Toggle Availability
Toggle driver's availability status.

**Endpoint**: `PUT /drivers/availability`

**Headers**: `Authorization: Bearer <driver_token>`

**Request Body**:
```json
{
  "isAvailable": true
}
```

**Response**:
```json
{
  "message": "Availability updated",
  "isAvailable": true
}
```

---

## 👤 Customer/Booking Endpoints

### 1. Create Booking
Create a new booking.

**Endpoint**: `POST /bookings`

**Headers**: `Authorization: Bearer <customer_token>`

**Request Body**:
```json
{
  "serviceType": "airport",
  "vehicleType": "manual",
  "pickupLocation": "Chennai Airport",
  "dropLocation": "T Nagar",
  "pickupDateTime": "2024-11-21T10:00:00.000Z",
  "duration": 2,
  "amount": 500,
  "notes": "Please call before arriving"
}
```

**Response**:
```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "507f1f77bcf86cd799439011",
    "customerId": "507f1f77bcf86cd799439012",
    "status": "pending",
    ...
  }
}
```

---

### 2. Get Customer's Bookings
Get all bookings for the authenticated customer.

**Endpoint**: `GET /bookings/my-bookings`

**Headers**: `Authorization: Bearer <customer_token>`

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "driverId": {
      "userId": {
        "name": "John Driver",
        "phone": "9876543210"
      }
    },
    "pickupLocation": "Chennai Airport",
    "dropLocation": "T Nagar",
    "status": "assigned",
    "amount": 500
  }
]
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "message": "Invalid phone number"
}
```

### 401 Unauthorized
```json
{
  "message": "No authentication token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin only."
}
```

### 404 Not Found
```json
{
  "message": "Driver not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Detailed error message"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Testing with cURL

### Login as Super Admin:
```bash
curl -X POST http://localhost:5000/api/auth/login-password \
  -H "Content-Type: application/json" \
  -d '{"phone":"9962366104","password":"Tharish@4700"}'
```

### Get Dashboard Stats:
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Booking:
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType":"airport",
    "pickupLocation":"Chennai Airport",
    "dropLocation":"T Nagar",
    "pickupDateTime":"2024-11-21T10:00:00.000Z",
    "amount":500
  }'
```

---

**Last Updated**: November 20, 2025
