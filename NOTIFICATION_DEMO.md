# 🎮 Notification System - Live Demo & Testing

## Quick Test in Browser Console

Open your `index.html` in a browser, press **F12** to open console, and try these commands:

---

## 🧪 Test Commands

### **1. Basic Notifications**

```javascript
// Success notification
notify('Success!', 'Operation completed successfully', 'success');

// Error notification
notify('Error!', 'Something went wrong', 'error');

// Warning notification
notify('Warning!', 'Please check your details', 'warning');

// Info notification
notify('Info', 'New update available', 'info');
```

---

### **2. Real-World Examples**

```javascript
// New booking
notify('New Booking 🚗', 'Customer requested a ride to Chennai Airport', 'booking');

// Driver approved
notify('Driver Approved ✅', 'John Doe can now accept rides', 'success');

// Payment received
notify('Payment Received 💰', 'Rs. 500 received for Booking #1234', 'success');

// Ride started
notify('Ride Started 🚗', 'Your driver is on the way', 'info');

// Ride completed
notify('Ride Completed ✅', 'Thank you for using our service!', 'success');
```

---

### **3. Multiple Notifications (Stress Test)**

```javascript
// Send 5 notifications at once
for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
        notify(`Notification ${i}`, `This is test notification number ${i}`, 'info');
    }, i * 500);
}
```

---

### **4. Different Types Demo**

```javascript
// Show all types
const types = ['success', 'error', 'warning', 'info'];
types.forEach((type, index) => {
    setTimeout(() => {
        notify(`${type.toUpperCase()} Notification`, `This is a ${type} message`, type);
    }, index * 1000);
});
```

---

### **5. Custom Icons Demo**

```javascript
// Booking notification
notify('New Ride Request', 'Customer needs a driver', 'booking');

// Driver notification
notify('Driver Update', 'New driver registered', 'driver');

// Customer notification
notify('Customer Alert', 'New customer signed up', 'customer');

// Admin notification
notify('Admin Alert', 'System requires attention', 'admin');
```

---

### **6. Check Notification System Status**

```javascript
// View all notifications
console.log('All Notifications:', NotificationSystem.notifications);

// View unread count
console.log('Unread Count:', NotificationSystem.unreadCount);

// Check if sound is enabled
console.log('Sound Enabled:', NotificationSystem.soundEnabled);

// View notification permission
console.log('Browser Permission:', Notification.permission);
```

---

### **7. Manage Notifications**

```javascript
// Mark all as read
NotificationSystem.markAllAsRead();

// Clear all notifications
NotificationSystem.clearAll();

// Disable sound
NotificationSystem.soundEnabled = false;

// Enable sound
NotificationSystem.soundEnabled = true;
```

---

### **8. Simulate Real-Time Events**

```javascript
// Simulate a booking workflow
function simulateBooking() {
    notify('New Booking', 'Customer requested a ride', 'booking');
    
    setTimeout(() => {
        notify('Driver Assigned', 'Driver John has been assigned', 'success');
    }, 3000);
    
    setTimeout(() => {
        notify('Driver Arriving', 'Driver will arrive in 5 minutes', 'info');
    }, 6000);
    
    setTimeout(() => {
        notify('Ride Started', 'Your ride has started', 'info');
    }, 9000);
    
    setTimeout(() => {
        notify('Ride Completed', 'Thank you for riding with us!', 'success');
    }, 12000);
}

// Run the simulation
simulateBooking();
```

---

### **9. Test Browser Notifications**

```javascript
// Request permission (if not already granted)
if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            notify('Permission Granted!', 'You will now receive desktop notifications', 'success');
        }
    });
}

// Send a test browser notification
NotificationSystem.showBrowserNotification(
    'Test Browser Notification',
    'This is a native OS notification!'
);
```

---

### **10. Performance Test**

```javascript
// Send 20 notifications rapidly
console.time('Notification Performance');
for (let i = 1; i <= 20; i++) {
    NotificationSystem.add(`Notification ${i}`, `Test message ${i}`, 'info');
}
console.timeEnd('Notification Performance');
console.log('Total notifications:', NotificationSystem.notifications.length);
```

---

## 🎯 Interactive Demo Scenarios

### **Scenario 1: Customer Books a Ride**

```javascript
// Step 1: Customer creates booking
notify('Booking Created', 'Your ride request has been submitted', 'success');

// Step 2: Admin assigns driver (after 2 seconds)
setTimeout(() => {
    notify('Driver Assigned', 'Driver Rajesh has been assigned to your ride', 'success');
}, 2000);

// Step 3: Driver accepts (after 4 seconds)
setTimeout(() => {
    notify('Driver Accepted', 'Your driver is on the way!', 'info');
}, 4000);
```

---

### **Scenario 2: Driver Registration**

```javascript
// Step 1: Driver submits registration
notify('Registration Submitted', 'Your application is under review', 'info');

// Step 2: Admin reviews (after 3 seconds)
setTimeout(() => {
    notify('Under Review', 'Admin is reviewing your documents', 'warning');
}, 3000);

// Step 3: Approved (after 6 seconds)
setTimeout(() => {
    notify('Approved! 🎉', 'You can now start accepting rides', 'success');
}, 6000);
```

---

### **Scenario 3: Payment Flow**

```javascript
// Step 1: Payment initiated
notify('Payment Processing', 'Please wait...', 'info');

// Step 2: Payment successful (after 2 seconds)
setTimeout(() => {
    notify('Payment Successful', 'Rs. 500 has been received', 'success');
}, 2000);

// Step 3: Receipt generated (after 4 seconds)
setTimeout(() => {
    notify('Receipt Generated', 'Your receipt is ready for download', 'info');
}, 4000);
```

---

## 🔍 Debugging Commands

```javascript
// Check if notification system is initialized
console.log('Initialized:', NotificationSystem.notifications !== undefined);

// View notification panel state
console.log('Panel visible:', document.getElementById('notificationPanel').classList.contains('show'));

// Count toast notifications
console.log('Active toasts:', document.querySelectorAll('.toast').length);

// Check localStorage
console.log('Saved notifications:', localStorage.getItem('notifications'));
console.log('Saved unread count:', localStorage.getItem('unreadCount'));

// Clear localStorage
localStorage.removeItem('notifications');
localStorage.removeItem('unreadCount');
location.reload();
```

---

## 📱 Mobile Testing

### On Mobile Device:
1. Open `index.html` on your phone
2. Open browser console (if available) or use remote debugging
3. Tap the notification bell 🔔
4. Test touch interactions
5. Check responsive layout

### Remote Debugging:
- **Chrome**: chrome://inspect
- **Safari**: Safari > Develop > [Your Device]
- **Firefox**: about:debugging

---

## ✅ Checklist

Test each feature:

- [ ] Click notification bell - panel opens
- [ ] Click outside panel - panel closes
- [ ] Send notification - toast appears
- [ ] Toast auto-closes after 5 seconds
- [ ] Click toast close button - toast closes immediately
- [ ] Unread badge shows correct count
- [ ] Click notification - marks as read
- [ ] Click "Mark all read" - all marked as read
- [ ] Browser notification appears (if permission granted)
- [ ] Sound plays (if enabled)
- [ ] Notifications persist after page reload
- [ ] Mobile responsive layout works
- [ ] Multiple toasts stack correctly

---

## 🎨 Visual Test

Run this to see all notification types at once:

```javascript
const demo = [
    { title: 'Success Example', message: 'This is a success notification', type: 'success' },
    { title: 'Error Example', message: 'This is an error notification', type: 'error' },
    { title: 'Warning Example', message: 'This is a warning notification', type: 'warning' },
    { title: 'Info Example', message: 'This is an info notification', type: 'info' },
    { title: 'Booking Example', message: 'This is a booking notification', type: 'booking' },
    { title: 'Driver Example', message: 'This is a driver notification', type: 'driver' },
    { title: 'Customer Example', message: 'This is a customer notification', type: 'customer' },
    { title: 'Admin Example', message: 'This is an admin notification', type: 'admin' }
];

demo.forEach((notif, index) => {
    setTimeout(() => {
        notify(notif.title, notif.message, notif.type);
    }, index * 800);
});
```

---

## 🚀 Production Testing

Before going live, test:

1. **Load Test**: Send 100 notifications
2. **Memory Test**: Check for memory leaks
3. **Browser Compatibility**: Test on Chrome, Firefox, Safari, Edge
4. **Mobile Test**: Test on iOS and Android
5. **Permission Test**: Test with notifications blocked
6. **Sound Test**: Test with sound on/off
7. **Persistence Test**: Reload page and check notifications remain

---

## 📊 Expected Results

### After running tests:
- ✅ Toasts slide in smoothly from right
- ✅ Badge shows correct unread count
- ✅ Panel shows all notifications
- ✅ Unread notifications highlighted in blue
- ✅ Timestamps show relative time
- ✅ Browser notifications appear (if permitted)
- ✅ Sound plays on new notification
- ✅ No console errors
- ✅ Smooth animations
- ✅ Mobile responsive

---

**Happy Testing! 🎉**

For issues, check `NOTIFICATION_SYSTEM_GUIDE.md` or contact support.
