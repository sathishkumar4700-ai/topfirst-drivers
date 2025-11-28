# 🔔 Notification System - Quick Reference

## One-Line Commands

```javascript
// Basic notification
notify('Title', 'Message', 'success');

// Types: success, error, warning, info, booking, driver, customer, admin
```

---

## Common Use Cases

```javascript
// ✅ Success
notify('Success!', 'Operation completed', 'success');

// ❌ Error
notify('Error!', 'Something went wrong', 'error');

// ⚠️ Warning
notify('Warning!', 'Please check details', 'warning');

// ℹ️ Info
notify('Info', 'New update available', 'info');

// 🚗 Booking
notify('New Booking', 'Ride requested', 'booking');

// 👨‍✈️ Driver
notify('Driver Update', 'New driver registered', 'driver');

// 👤 Customer
notify('Customer Alert', 'New customer', 'customer');

// 👨‍💼 Admin
notify('Admin Alert', 'Action required', 'admin');
```

---

## Management

```javascript
// Mark all as read
NotificationSystem.markAllAsRead();

// Clear all
NotificationSystem.clearAll();

// Disable sound
NotificationSystem.soundEnabled = false;

// Enable sound
NotificationSystem.soundEnabled = true;
```

---

## Check Status

```javascript
// View all notifications
console.log(NotificationSystem.notifications);

// Unread count
console.log(NotificationSystem.unreadCount);

// Browser permission
console.log(Notification.permission);
```

---

## Test Commands

```javascript
// Single test
notify('Test', 'This is a test', 'info');

// Multiple tests
for(let i=1; i<=5; i++) {
    notify(`Test ${i}`, `Message ${i}`, 'info');
}

// All types
['success','error','warning','info'].forEach(type => {
    notify(type.toUpperCase(), `This is ${type}`, type);
});
```

---

## Integration Example

```javascript
function yourFunction() {
    // Your code here...
    
    // Add notification
    notify('Action Complete', 'Successfully processed', 'success');
}
```

---

**That's it! Simple and powerful.** 🚀
