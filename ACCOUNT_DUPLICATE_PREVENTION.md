# 🛡️ Account Duplicate Prevention System

## ⚠️ UPDATED - Multi-Role Support Enabled

**See `MULTI_ROLE_SUPPORT.md` for the latest system behavior.**

## Overview
The system prevents duplicate registrations **within the same role**, but **allows the same phone number to have multiple roles** (Customer + Driver + Admin).

## How It Works

### 1. **Driver Registration**
When someone tries to register as a driver, the system checks:
- ❌ If phone number is already registered as a **Driver**
- ❌ If phone number is already registered as a **Customer**
- ❌ If phone number is already registered as an **Admin**

**Error Messages:**
- "This phone number is already registered as a driver. Please login instead or use a different phone number."
- "This phone number is already registered as a customer. Please use a different phone number for driver registration."
- "This phone number is already registered as an admin. Please use a different phone number for driver registration."

### 2. **Customer Registration**
When someone tries to register as a customer, the system checks:
- ❌ If phone number is already registered as a **Customer**
- ❌ If phone number is already registered as a **Driver**
- ❌ If phone number is already registered as an **Admin**

**Error Messages:**
- "This phone number is already registered as a customer. Please login instead or use a different phone number."
- "This phone number is already registered as a driver. Please use a different phone number for customer registration."
- "This phone number is already registered as an admin. Please use a different phone number for customer registration."

### 3. **Customer OTP Login**
When a customer tries to login with OTP (which can auto-create accounts), the system checks:
- ❌ If phone number is already registered as a **Driver**
- ❌ If phone number is already registered as an **Admin**

**Error Messages:**
- "This phone number is registered as a driver. Please login as a driver or use a different phone number."
- "This phone number is registered as an admin. Please login as an admin or use a different phone number."

### 4. **Admin Registration Request**
When someone requests admin access, the system checks:
- ❌ If phone number is already registered as a **Driver**
- ❌ If phone number is already registered as a **Customer**
- ⏳ If there's already a **pending admin request** for this number

**Error Messages:**
- "This phone number is already registered as a driver. Please use a different phone number for admin registration."
- "This phone number is already registered as a customer. Please use a different phone number for admin registration."
- "You already have a pending admin request for this phone number. Please wait for approval."

## Benefits

✅ **Prevents Confusion**: Users can't accidentally create multiple accounts with the same phone number

✅ **Data Integrity**: Ensures each phone number is unique across the entire system

✅ **Clear Guidance**: Users get helpful error messages directing them to the correct login portal

✅ **Security**: Prevents account conflicts and potential security issues

## User Experience

### Scenario 1: Existing Driver Tries to Register as Customer
1. Driver enters their phone number in customer registration
2. System detects phone is already a driver account
3. Shows error: "This phone number is already registered as a driver"
4. User is directed to use a different phone number or login as driver

### Scenario 2: Existing Customer Tries to Register as Driver
1. Customer enters their phone number in driver registration
2. System detects phone is already a customer account
3. Shows error: "This phone number is already registered as a customer"
4. User is directed to use a different phone number

### Scenario 3: Admin Tries to Create Customer Account
1. Admin enters their phone number in customer registration
2. System detects phone is already an admin account
3. Shows error: "This phone number is already registered as an admin"
4. User is directed to use a different phone number

## Technical Implementation

The system checks against three data sources:
1. `driverApprovalStatus` - All driver accounts (pending, approved, rejected, deactivated)
2. `customerData` - All customer accounts
3. `superAdmins` + `approvedAdmins` - All admin accounts (super admins and approved admins)

## Testing

To test the duplicate prevention:

1. **Register a driver** with phone: 9876543210
2. **Try to register as customer** with same phone: 9876543210
   - ✅ Should show error and prevent registration

3. **Register a customer** with phone: 9876543211
4. **Try to register as driver** with same phone: 9876543211
   - ✅ Should show error and prevent registration

5. **Login as super admin** (9962366104 or 8179824281)
6. **Try to register as customer** with admin phone
   - ✅ Should show error and prevent registration

## Notes

- Phone numbers are the unique identifier across all user types
- Users must use different phone numbers for different account types
- This is a security and data integrity feature
- All checks happen before any data is stored

---

**Status**: ✅ Fully Implemented and Active
**Last Updated**: November 20, 2025
