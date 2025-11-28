# 🚗 Driver Registration & Approval System - Updated

## Overview
The driver registration system has been integrated into the login page. Drivers can now create accounts directly from the login page with document uploads, and admins receive notifications to approve new drivers.

## How It Works

### 1. Driver Registration Flow

#### Step 1: Navigate to Login Page
- Driver clicks **"🚗 Driver"** button on homepage
- Redirected to `/login` page with driver role pre-selected

#### Step 2: Create Account
- Driver clicks **"Create Account"** link
- Selects **"🚗 Driver"** role (or **"👤 Customer"** for customers)
- Fills out comprehensive registration form:

**Personal Information:**
- Full Name *
- Phone Number *
- Email *
- Address *

**Driver Details:**
- Driving License Number *
- Aadhar Number *
- Vehicle Type (Car/Bike/Both) *
- Years of Experience *

**Upload Documents:**
- 📄 License Document (Image/PDF)
- 📄 Aadhar Document (Image/PDF)
- 📷 Your Photo (Image)

**Account Security:**
- Password *

#### Step 3: Submit Registration
- Driver submits the form
- Documents are uploaded to server
- Account created with `approvalStatus: 'pending'`
- Success screen shown
- Auto-redirected to login after 3 seconds

#### Step 4: Login & Wait for Approval
- Driver logs in with credentials
- Sees **"Account Pending Approval"** screen
- Cannot access bookings until approved

### 2. Admin Approval Process

#### Step 1: Admin Receives Notification
- When driver registers, admin should receive:
  - ✉️ Email notification (to be implemented)
  - 📱 WhatsApp message (to be implemented)
- Console log shows: "New driver registration: [Name] ([Email])"

#### Step 2: Review in Admin Dashboard
- Admin logs into admin dashboard
- Clicks **"Pending Approvals"** tab (shows count badge)
- Sees all pending driver applications

#### Step 3: View Driver Details
Each pending driver card shows:
- Driver name and status
- Contact information (email, phone)
- Full address
- License number
- Aadhar number
- Vehicle type
- Years of experience
- Application date
- **Uploaded Documents** with download links:
  - 📄 License (clickable to view/download)
  - 📄 Aadhar (clickable to view/download)
  - 📷 Photo (clickable to view/download)

#### Step 4: Approve or Reject
- **Approve:** Click "✓ Approve" → Driver gets full access
- **Reject:** Click "✗ Reject" → Enter reason → Driver sees rejection message

### 3. Document Management

#### File Upload
- Files are uploaded to `server/uploads/driver-documents/`
- Supported formats: JPEG, JPG, PNG, PDF
- Maximum file size: 5MB per file
- Files are renamed with unique identifiers

#### File Access
- Documents are served via `/uploads/` route
- Admin can view/download documents directly from dashboard
- Files are stored securely on server

## API Endpoints

### Driver Registration with Documents
```
POST /api/auth/register-driver
Content-Type: multipart/form-data

Body (FormData):
- name: string
- email: string
- phone: string
- password: string
- address: string
- licenseNumber: string
- aadharNumber: string
- vehicleType: string (car/bike/both)
- experience: number
- licenseDoc: file (optional)
- aadharDoc: file (optional)
- photo: file (optional)

Response: {
  message: "Driver registration successful. Please wait for admin approval.",
  driver: { id, name, email, approvalStatus }
}
```

### Get Pending Drivers (Admin)
```
GET /api/admin/drivers/pending-approvals
Response: Array of pending drivers with documents
```

### Approve Driver (Admin)
```
PUT /api/admin/drivers/:id/approve
Response: Success message
```

### Reject Driver (Admin)
```
PUT /api/admin/drivers/:id/reject
Body: { reason: string }
Response: Success message
```

## Database Schema

### Driver Model Updates
```javascript
{
  // ... existing fields
  address: String (required),
  aadharNumber: String (required),
  documents: {
    licenseDoc: String,  // File path
    aadharDoc: String,   // File path
    photo: String        // File path
  },
  isApproved: Boolean (default: false),
  approvalStatus: String (enum: ['pending', 'approved', 'rejected']),
  rejectionReason: String,
  approvedBy: ObjectId,
  approvedAt: Date
}
```

## File Structure

### Backend
```
server/
├── uploads/
│   └── driver-documents/
│       ├── licenseDoc-[timestamp]-[random].jpg
│       ├── aadharDoc-[timestamp]-[random].pdf
│       └── photo-[timestamp]-[random].jpg
├── routes/
│   └── auth.js (with multer configuration)
└── server.js (serves static files from /uploads)
```

### Frontend
```
client/src/pages/
├── LoginPage.js (integrated registration)
├── LoginPage.css (with file upload styles)
├── DriverDashboard.js (pending approval screen)
└── AdminDashboard.js (document viewing)
```

## Features

✅ **Integrated Registration** - No separate registration page needed
✅ **Role Selection** - Choose between Customer and Driver
✅ **Document Upload** - Upload license, Aadhar, and photo
✅ **File Validation** - Only images and PDFs allowed, 5MB limit
✅ **Secure Storage** - Files stored with unique names
✅ **Admin Document View** - View/download all uploaded documents
✅ **Pending Approval Screen** - Drivers see their status
✅ **Approval/Rejection** - Admin can approve or reject with reason
✅ **Mobile Responsive** - Works on all devices

## Installation

### Install Dependencies
```bash
cd server
npm install multer
```

### Create Uploads Directory
The server automatically creates the uploads directory on startup.

### Environment Variables
No additional environment variables needed for file uploads.

## Testing

### Test Driver Registration
1. Go to homepage
2. Click **"🚗 Driver"** button
3. Click **"Create Account"**
4. Select **"🚗 Driver"** role
5. Fill all required fields
6. Upload documents (optional but recommended)
7. Submit form
8. Login with credentials
9. See pending approval screen

### Test Admin Approval
1. Login as admin
2. Go to **"Pending Approvals"** tab
3. See new driver application
4. Click document links to view files
5. Click **"✓ Approve"** to approve
6. Driver can now access full dashboard

### Test Document Access
1. Admin clicks on document link
2. Document opens in new tab
3. Can view or download the file

## Notifications (To Be Implemented)

### Email Notification
When driver registers, send email to admin:
```
Subject: New Driver Registration - [Driver Name]
Body:
- Driver Name
- Email
- Phone
- License Number
- Link to admin dashboard
```

### WhatsApp Notification
Send WhatsApp message to admin:
```
🚗 New Driver Registration

Name: [Driver Name]
Phone: [Phone]
License: [License Number]

Please review and approve in admin dashboard.
```

## Security Considerations

✅ File type validation (only images and PDFs)
✅ File size limit (5MB)
✅ Unique file names to prevent overwrites
✅ Files stored outside public directory
✅ Admin authentication required to view documents
✅ Password hashing for driver accounts

## Future Enhancements

- [ ] Email notifications to admin on new registration
- [ ] WhatsApp notifications to admin
- [ ] Email confirmation to driver on approval/rejection
- [ ] Document verification status
- [ ] Bulk document download for admin
- [ ] Document expiry tracking
- [ ] Re-upload document feature
- [ ] Background verification integration
- [ ] Driver rating before approval

## Troubleshooting

### Files Not Uploading
- Check uploads directory exists and has write permissions
- Verify file size is under 5MB
- Ensure file format is supported (JPEG, JPG, PNG, PDF)

### Documents Not Displaying
- Check server is serving static files from /uploads
- Verify file paths are stored correctly in database
- Check browser console for errors

### Registration Failing
- Check all required fields are filled
- Verify email is unique
- Check license number is unique
- Ensure server has multer installed

---

**System is ready to use!** Drivers can now register with documents, and admins can review and approve applications with full document access.
