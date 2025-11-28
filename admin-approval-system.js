// Admin Approval System
// Store approved admin mobile numbers (in production, this would be in database)
const approvedAdmins = ['9962366104']; // Super admin number

// Store pending admin requests
let pendingAdminRequests = {};

function handleAdminAuth() {
    const mobile = document.getElementById('adminMobile').value;
    const otpSection = document.getElementById('adminOtpSection');
    const authBtn = document.getElementById('adminAuthBtn');
    
    if (!mobile || mobile.length !== 10) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }

    if (otpSection.style.display === 'none') {
        // Generate and send OTP
        const otp = generateOTP();
        generatedOTPs['admin_' + mobile] = otp;
        
        otpSection.style.display = 'block';
        document.getElementById('adminOtpDisplay').textContent = '📱 OTP sent to ' + mobile + ': ' + otp;
        authBtn.textContent = 'Verify OTP & Login';
        
        console.log('Admin OTP for ' + mobile + ': ' + otp);
    } else {
        // Verify OTP
        const enteredOtp = document.getElementById('adminOtp').value;
        const correctOtp = generatedOTPs['admin_' + mobile];
        
        if (enteredOtp === correctOtp) {
            // Check if admin is approved
            if (approvedAdmins.includes(mobile)) {
                // Approved admin - show dashboard
                showAdminDashboard(mobile);
            } else {
                // New admin request - send approval request
                requestAdminApproval(mobile);
            }
        } else {
            alert('❌ Invalid OTP. Please try again.');
        }
    }
}

function requestAdminApproval(mobile) {
    // Store pending request
    pendingAdminRequests[mobile] = {
        requestedAt: new Date().toISOString(),
        status: 'pending'
    };

    // Show approval pending message
    document.getElementById('portalTitle').textContent = '⏳ Admin Approval Pending';
    document.getElementById('portalContent').innerHTML = `
        <div style="text-align: center; padding: 2rem 0;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">⏳</div>
            <h3 style="color: #667eea; margin-bottom: 1rem;">Approval Request Sent!</h3>
            <p style="color: #666; line-height: 1.8; margin-bottom: 1.5rem;">
                Your admin access request has been sent for approval.
            </p>
            <div style="background: #e7f3ff; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #2196F3; margin-bottom: 1.5rem; text-align: left;">
                <p style="color: #0d47a1; margin: 0 0 0.5rem 0; font-weight: 600;">
                    📱 Mobile Number: ${mobile}
                </p>
                <p style="color: #0d47a1; margin: 0; font-size: 0.9rem;">
                    Notifications sent to:
                </p>
                <p style="color: #0d47a1; margin: 0.5rem 0 0 0; font-size: 0.9rem;">
                    ✉️ Email: Kraja4700@gmail.com<br>
                    💬 WhatsApp: +91 9962366104
                </p>
            </div>
            <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p style="color: #856404; margin: 0; font-size: 0.9rem;">
                    ⚠️ You will be notified once your request is approved by the super admin.
                </p>
            </div>
            <a href="mailto:Kraja4700@gmail.com?subject=Admin%20Access%20Request%20-%20${mobile}&body=Hi%2C%0A%0AI%20am%20requesting%20admin%20access%20for%20Top%20First%20Call%20Drivers.%0A%0AMobile%20Number%3A%20${mobile}%0A%0APlease%20approve%20my%20request.%0A%0AThank%20you!" 
               style="display: block; background: #667eea; color: white; padding: 0.75rem; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 0.5rem;">
                📧 Send Email Request
            </a>
            <a href="https://wa.me/919962366104?text=Hi%2C%20I%20am%20requesting%20admin%20access%20for%20Top%20First%20Call%20Drivers.%20My%20mobile%20number%20is%20${mobile}.%20Please%20approve%20my%20request." 
               target="_blank"
               style="display: block; background: #25D366; color: white; padding: 0.75rem; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 0.5rem;">
                💬 Send WhatsApp Request
            </a>
            <button onclick="closePortal()" style="width: 100%; background: #6c757d; color: white; border: none; padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                Close
            </button>
        </div>
    `;

    // In production, this would send actual email and WhatsApp notifications via backend API
    console.log('Admin approval request sent for:', mobile);
    console.log('Email would be sent to: Kraja4700@gmail.com');
    console.log('WhatsApp would be sent to: 9962366104');
}

// Function for super admin to approve requests (can be called from console or admin panel)
function approveAdmin(mobile) {
    if (!approvedAdmins.includes(mobile)) {
        approvedAdmins.push(mobile);
        if (pendingAdminRequests[mobile]) {
            pendingAdminRequests[mobile].status = 'approved';
            pendingAdminRequests[mobile].approvedAt = new Date().toISOString();
        }
        console.log('Admin approved:', mobile);
        alert('✅ Admin ' + mobile + ' has been approved!');
        return true;
    }
    return false;
}

// Function to reject admin request
function rejectAdmin(mobile) {
    if (pendingAdminRequests[mobile]) {
        pendingAdminRequests[mobile].status = 'rejected';
        pendingAdminRequests[mobile].rejectedAt = new Date().toISOString();
        console.log('Admin rejected:', mobile);
        alert('❌ Admin request for ' + mobile + ' has been rejected.');
        return true;
    }
    return false;
}

// Function to view pending requests (for super admin)
function viewPendingAdminRequests() {
    console.log('Pending Admin Requests:', pendingAdminRequests);
    const pending = Object.entries(pendingAdminRequests)
        .filter(([_, req]) => req.status === 'pending')
        .map(([mobile, req]) => ({ mobile, ...req }));
    
    if (pending.length === 0) {
        alert('No pending admin requests');
    } else {
        console.table(pending);
        alert('Check console for pending requests. Use approveAdmin(mobile) or rejectAdmin(mobile) to manage.');
    }
}
