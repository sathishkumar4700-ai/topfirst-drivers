# 🧪 Quick Test Guide - Duplicate Prevention

## How to Test the Duplicate Prevention Feature

### Test 1: Driver → Customer Duplicate Prevention

1. **Open index.html** in your browser
2. Click **"Create Account"** button
3. Select **"Driver Account"**
4. Fill in the form with phone: **9999999999**
5. Submit registration
6. ✅ Driver account created successfully

7. Click **"Create Account"** again
8. Select **"Customer Account"**
9. Enter same phone: **9999999999**
10. Click submit
11. ✅ **Should see error**: "This phone number is already registered as a driver"

---

### Test 2: Customer → Driver Duplicate Prevention

1. Click **"Create Account"**
2. Select **"Customer Account"**
3. Fill in form with phone: **8888888888**
4. Submit registration
5. ✅ Customer account created

6. Click **"Create Account"** again
7. Select **"Driver Account"**
8. Enter same phone: **8888888888**
9. Click submit
10. ✅ **Should see error**: "This phone number is already registered as a customer"

---

### Test 3: Admin → Customer Duplicate Prevention

1. Click **"Login"**
2. Select **"Admin"**
3. Enter super admin phone: **9962366104**
4. Enter password: **Tharish@4700**
5. Login successful

6. Logout and click **"Create Account"**
7. Select **"Customer Account"**
8. Enter admin phone: **9962366104**
9. Click submit
10. ✅ **Should see error**: "This phone number is already registered as an admin"

---

### Test 4: Customer OTP Login Prevention

1. Register as driver with phone: **7777777777**
2. Logout
3. Click **"Login"**
4. Select **"Customer"**
5. Enter driver phone: **7777777777**
6. Click "Send OTP"
7. ✅ **Should see error**: "This phone number is registered as a driver"

---

### Test 5: Pending Admin Request

1. Click **"Create Account"**
2. Select **"Admin Account Request"**
3. Enter phone: **6666666666**
4. Submit request
5. ✅ Request submitted

6. Try to submit another admin request with same phone: **6666666666**
7. ✅ **Should see error**: "You already have a pending admin request"

---

## Expected Results Summary

| Test | Action | Expected Result |
|------|--------|----------------|
| 1 | Driver phone → Customer registration | ❌ Blocked with error |
| 2 | Customer phone → Driver registration | ❌ Blocked with error |
| 3 | Admin phone → Customer registration | ❌ Blocked with error |
| 4 | Driver phone → Customer OTP login | ❌ Blocked before OTP |
| 5 | Duplicate admin request | ❌ Blocked with error |

---

## What to Look For

✅ **Clear error messages** - Users see helpful guidance
✅ **Immediate feedback** - Errors show before any data is saved
✅ **No page refresh** - Errors appear in alert boxes
✅ **Form stays open** - Users can correct their phone number
✅ **No console errors** - Check browser console (F12)

---

## Browser Console Testing

Open browser console (F12) and check:

```javascript
// View all drivers
console.log('Drivers:', driverApprovalStatus);

// View all customers
console.log('Customers:', customerData);

// View all admins
console.log('Super Admins:', superAdmins);
console.log('Approved Admins:', approvedAdmins);
```

---

**Pro Tip**: Use different phone numbers for each user type to avoid conflicts!

**Super Admin Credentials**:
- Phone: 9962366104 or 8179824281
- Password: Tharish@4700
