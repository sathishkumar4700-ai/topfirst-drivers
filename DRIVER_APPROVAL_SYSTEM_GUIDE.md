# 🚗 Driver Approval System Guide

## Overview
The driver approval system ensures that only verified and approved drivers can access the driver dashboard and accept ride requests. This adds a layer of security and quality control to your platform.

## How It Works

### 1. Driver Registration Process

#### Step 1: Driver Creates Account
- Drivers visit the homepage and click **"⭐ Become a Driver"** button
- They are redirected to `/driver-registration` page
- Fill out the registration form with:
  - **Personal Information:**
    - Full Name
    - Email
    - Phone Number
    - Aadhar Number (Optional)
    - Address (Optional)
  - **Driver Details:**
    - Driving License Number
    - Vehicle Type (Car/Bike/Both)
    - Years of Experience
  - **Account Security:**
    - Password
    - Confirm Password

#### Step 2: Account Created (Pending Status)
- Upon successful registration, driver account is created with `approvalStatus: 'pending'`
- Driver receives a success message
- Driver is redirected to login page after 3 seconds

#### Step 3: Driver Logs In
- Driver can log in with their credentials
- They are redirected to driver dashboard
- Dashboard shows **"Account Pending Approval"** screen with:
  - ⏳ Pending icon
  - Welcome message
  - Their submitted details
  - Information about what happens next

### 2. Admin Approval Process

#### Step 1: Admin Views Pending Approvals
- Admin logs into admin dashboard
- Sees **"Pending Approvals"** tab with a badge showing count
- Dashboard stats show **"Pending Driver Approvals"** count (highlighted)

#### Step 2: Admin Reviews Driver Application
- Admin clicks on **"Pending Approvals"** tab
- Sees all pending driver applications in card format
- Each card shows:
  - Driver name and status badge
  - Contact information (email, phone)
  - License number
  - Vehicle type
  - Experience
  - Address and Aadhar (if provided)
  - Application date

#### Step 3: Admin Makes Decision

**Option A: Approve Driver**
- Admin clicks **"✓ Approve"** button
- Confirmation dialog appears
- Upon confirmation:
  - Driver's `isApproved` is set to `true`
  - Driver's `approvalStatus` is set to `'approved'`
  - Driver's `approvedBy` is set to admin's ID
  - Driver's `approvedAt` is set to current date
  - Success notification shown
  - Driver can now access full dashboard features

**Option B: Reject Driver**
- Admin clicks **"✗ Reject"** button
- Prompt appears asking for rejection reason
- Upon submission:
  - Driver's `isApproved` remains `false`
  - Driver's `approvalStatus` is set to `'rejected'`
  - Driver's `rejectionReason` is saved
  - Rejection notification shown

### 3. Driver Experience After Approval

#### Approved Driver
- Driver logs in and sees full dashboard
- Can toggle availability (Available/Unavailable)
- Can view and manage bookings
- Can accept/reject ride requests
- Can start and complete rides
- Profile shows **"✓ Approved Driver"** badge

#### Rejected Driver
- Driver logs in and sees rejection screen
- ❌ Rejected icon displayed
- Rejection reason shown
- Message to contact support

## API Endpoints

### Driver Registration
```
POST /api/auth/register-driver
Body: {
  name, email, phone, password,
  licenseNumber, vehicleType, experience,
  address, aadharNumber
}
Response: Success message with pending status
```

### Get Pending Driver Approvals (Admin Only)
```
GET /api/admin/drivers/pending-approvals
Response: Array of pending driver applications
```

### Approve Driver (Admin Only)
```
PUT /api/admin/drivers/:id/approve
Response: Success message with driver details
```

### Reject Driver (Admin Only)
```
PUT /api/admin/drivers/:id/reject
Body: { reason: "Rejection reason" }
Response: Success message with driver details
```

### Get Driver Profile
```
GET /api/drivers/profile
Response: Driver profile with approval status
```

## Database Schema Updates

### Driver Model
```javascript
{
  isApproved: Boolean (default: false),
  approvalStatus: String (enum: ['pending', 'approved', 'rejected']),
  rejectionReason: String,
  approvedBy: ObjectId (ref: 'User'),
  approvedAt: Date
}
```

## Protected Routes

All driver dashboard features require approval:
- `/api/drivers/my-bookings` - Requires approval
- `/api/drivers/bookings/:id/status` - Requires approval
- `/api/drivers/availability` - Requires approval
- `/api/drivers/profile` - No approval required (drivers need to see their status)

## Middleware

### checkApproval Middleware
```javascript
const checkApproval = async (req, res, next) => {
  const driver = await Driver.findOne({ userId: req.userId });
  if (!driver.isApproved || driver.approvalStatus !== 'approved') {
    return res.status(403).json({ 
      message: 'Your account is pending admin approval',
      approvalStatus: driver.approvalStatus
    });
  }
  next();
};
```

## Testing the System

### Test as Driver
1. Go to homepage
2. Click **"⭐ Become a Driver"**
3. Fill registration form
4. Submit and wait for redirect
5. Login with credentials
6. See pending approval screen
7. Wait for admin approval

### Test as Admin
1. Login as admin
2. Go to **"Pending Approvals"** tab
3. Review driver application
4. Click **"✓ Approve"** or **"✗ Reject"**
5. Check dashboard stats update

### Test After Approval
1. Driver logs out and logs back in
2. Should see full dashboard
3. Can toggle availability
4. Can manage bookings

## Features

✅ Secure driver onboarding process
✅ Admin review and approval system
✅ Pending status screen for drivers
✅ Rejection with reason tracking
✅ Real-time approval status updates
✅ Protected dashboard features
✅ Badge notifications for pending approvals
✅ Mobile responsive design
✅ Professional UI/UX

## Future Enhancements

- Email notifications on approval/rejection
- WhatsApp notifications
- Document upload (license, Aadhar photos)
- Background verification integration
- Driver rating system before approval
- Bulk approval/rejection
- Approval history tracking
- Re-application process for rejected drivers

## Support

For issues or questions about the driver approval system, contact the development team.

---

**Last Updated:** November 17, 2025
