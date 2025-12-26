# Two-Factor Authentication (2FA) & Security System

## Overview

Recharge Hub now includes a comprehensive security system with Two-Factor Authentication (2FA), profile management, password changes, email updates, and activity monitoring to protect all users.

---

## 🔐 Features Implemented

### 1. Two-Factor Authentication (2FA)

#### What is 2FA?
Two-Factor Authentication adds an extra layer of security by requiring two forms of verification:
1. **Something you know** - Your password
2. **Something you have** - Your phone with an authenticator app

#### Supported Authenticator Apps
- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Any TOTP-compatible app

#### How to Enable 2FA

**Step 1: Navigate to Profile Settings**
- Click your profile icon in the header
- Select "Profile Settings"
- Go to the "2FA" tab

**Step 2: Start Setup**
- Click "Enable 2FA" button
- A QR code will be generated

**Step 3: Scan QR Code**
- Open your authenticator app
- Scan the QR code displayed on screen
- The app will start generating 6-digit codes

**Step 4: Verify**
- Enter the 6-digit code from your authenticator app
- Click "Verify and Enable"
- 2FA is now active!

**Step 5: Save Backup Codes**
- 10 backup codes will be displayed
- Download or copy these codes
- Store them in a safe place
- Each code can be used once if you lose access to your authenticator

#### How to Disable 2FA
1. Go to Profile Settings → 2FA tab
2. Click "Disable 2FA"
3. Confirm the action
4. 2FA will be removed from your account

---

### 2. Profile Management

#### Update Username
1. Go to Profile Settings → Profile tab
2. Enter new username
3. Click "Update"
4. Username is changed immediately

#### View Account Information
- Email address
- Account type (user/admin)
- Member since date
- Wallet balance

---

### 3. Password Management

#### Change Password

**Requirements:**
- Current password
- New password (minimum 8 characters)
- Confirmation of new password

**Steps:**
1. Go to Profile Settings → Security tab
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click "Update Password"

**Password Requirements:**
- Minimum 8 characters
- Recommended: Mix of uppercase, lowercase, numbers, and symbols

---

### 4. Email Management

#### Change Email Address

**Steps:**
1. Go to Profile Settings → Security tab
2. Enter new email address
3. Click "Request Email Change"
4. Check your new email for verification link
5. Click the verification link
6. Email is updated after verification

**Important:**
- You will receive verification emails at both old and new addresses
- The change is not complete until you verify the new email
- You can still login with your old email until verification is complete

---

### 5. Login History & Activity Monitoring

#### View Login History
1. Go to Profile Settings → Activity tab
2. See recent login attempts including:
   - Success/failure status
   - IP address
   - Date and time
   - Device information

#### What to Look For
- **Suspicious logins** - Logins from unknown locations
- **Failed attempts** - Multiple failed login attempts
- **Unusual times** - Logins at times you weren't active

#### If You See Suspicious Activity
1. Change your password immediately
2. Enable 2FA if not already enabled
3. Review all recent account activity
4. Contact support if needed

---

## 🗄️ Database Schema

### New Tables Created

#### 1. `two_factor_auth`
Stores 2FA configuration for users.

```sql
- user_id (UUID) - Reference to user
- secret (TEXT) - TOTP secret key
- is_enabled (BOOLEAN) - Whether 2FA is active
- backup_codes (TEXT[]) - Array of backup codes
- created_at (TIMESTAMP)
- enabled_at (TIMESTAMP)
- last_used_at (TIMESTAMP)
```

#### 2. `login_history`
Tracks all login attempts.

```sql
- user_id (UUID) - Reference to user
- ip_address (TEXT) - IP address of login
- user_agent (TEXT) - Browser/device information
- location (TEXT) - Geographic location
- device_type (TEXT) - Device type
- success (BOOLEAN) - Whether login succeeded
- failure_reason (TEXT) - Reason for failure
- created_at (TIMESTAMP)
```

#### 3. `security_events`
Logs security-related events.

```sql
- user_id (UUID) - Reference to user
- event_type (TEXT) - Type of event
- description (TEXT) - Event description
- ip_address (TEXT) - IP address
- metadata (JSONB) - Additional data
- created_at (TIMESTAMP)
```

#### 4. `email_change_requests`
Manages email change requests.

```sql
- user_id (UUID) - Reference to user
- old_email (TEXT) - Current email
- new_email (TEXT) - Requested new email
- verification_token (TEXT) - Verification token
- status (TEXT) - Request status
- expires_at (TIMESTAMP) - Token expiration
- created_at (TIMESTAMP)
- verified_at (TIMESTAMP)
```

#### 5. `password_reset_tokens`
Manages password reset tokens.

```sql
- user_id (UUID) - Reference to user
- token (TEXT) - Reset token
- expires_at (TIMESTAMP) - Token expiration
- used (BOOLEAN) - Whether token was used
- created_at (TIMESTAMP)
- used_at (TIMESTAMP)
```

---

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS policies ensuring:
- Users can only access their own data
- Admins can view all data for support purposes
- System can log events without user permission

### Backup Codes
- 10 unique codes generated per user
- Each code can be used once
- Codes are hashed before storage
- Can be regenerated if lost

### Password Security
- Passwords are hashed using bcrypt
- Minimum 8 characters required
- Password history prevents reuse
- Secure password reset flow

### Email Verification
- Email changes require verification
- Verification tokens expire after 24 hours
- Old email receives notification
- New email must be confirmed

### Login Monitoring
- All login attempts are logged
- Failed attempts are tracked
- IP addresses are recorded
- Suspicious activity is flagged

---

## 🎯 User Experience

### Profile Settings Page

**Location:** `/profile`

**Tabs:**
1. **Profile** - Basic information and username
2. **Security** - Password and email changes
3. **2FA** - Two-factor authentication setup
4. **Activity** - Login history and security events

### Access Points

**From Header Menu:**
1. Click profile icon (top right)
2. Select "Profile Settings"

**From Security Page:**
- Link to Profile Settings for 2FA setup

---

## 👨‍💼 Admin Features

### Admin Can View
- All user 2FA status
- All login history
- All security events
- All email change requests

### Admin Cannot
- Disable user 2FA (users must do this themselves)
- View user backup codes
- Reset user passwords without verification

---

## 📱 Mobile Support

All security features are fully responsive:
- QR code scanning works on mobile
- Touch-friendly interface
- Mobile authenticator app integration
- Responsive tables and forms

---

## 🔧 Technical Implementation

### Frontend Components

**ProfileSettingsPage.tsx**
- Main profile settings interface
- 4 tabs for different settings
- Real-time updates
- Form validation

### Backend Functions

**generate_backup_codes()**
```sql
Generates 10 random backup codes
Returns: TEXT[]
```

**log_security_event()**
```sql
Logs a security event
Parameters: user_id, event_type, description, ip_address, metadata
Returns: UUID (event_id)
```

**log_login_attempt()**
```sql
Logs a login attempt
Parameters: user_id, ip_address, user_agent, success, failure_reason
Returns: UUID (login_id)
```

---

## 🚀 How to Use (For Users)

### First Time Setup

1. **Login to your account**
2. **Click profile icon** (top right)
3. **Select "Profile Settings"**
4. **Go to "2FA" tab**
5. **Click "Enable 2FA"**
6. **Scan QR code** with authenticator app
7. **Enter verification code**
8. **Save backup codes**
9. **Done!** Your account is now protected

### Daily Use

**With 2FA Enabled:**
1. Enter email and password
2. Enter 6-digit code from authenticator app
3. Login successful

**If You Lose Your Phone:**
1. Use one of your backup codes instead
2. After logging in, set up 2FA again with new device

---

## 🛡️ Security Best Practices

### For Users

1. **Enable 2FA** - Always enable 2FA for maximum security
2. **Strong Passwords** - Use unique, complex passwords
3. **Save Backup Codes** - Store them securely offline
4. **Monitor Activity** - Check login history regularly
5. **Update Email** - Keep email address current
6. **Secure Devices** - Use trusted devices only

### For Admins

1. **Mandatory 2FA** - Require 2FA for admin accounts
2. **Monitor Logs** - Review security events regularly
3. **Respond Quickly** - Act on suspicious activity immediately
4. **Educate Users** - Promote security best practices
5. **Regular Audits** - Review security settings periodically

---

## 📊 Statistics & Monitoring

### Admin Dashboard Metrics

Admins can view:
- **2FA Adoption Rate** - Percentage of users with 2FA enabled
- **Failed Login Attempts** - Number of failed logins
- **Security Events** - Recent security-related events
- **Email Changes** - Pending email change requests
- **Active Sessions** - Currently logged-in users

---

## 🔄 Migration & Rollout

### Existing Users

- 2FA is optional by default
- Users can enable at any time
- No forced migration required
- Gradual adoption encouraged

### New Users

- Prompted to enable 2FA after registration
- Optional during signup
- Can be enabled later from settings

---

## 🆘 Troubleshooting

### Lost Authenticator App

**Solution:**
1. Use a backup code to login
2. Go to Profile Settings → 2FA
3. Disable 2FA
4. Set up 2FA again with new device

### Backup Codes Not Working

**Possible Causes:**
- Code already used
- Code entered incorrectly
- 2FA was reset

**Solution:**
- Try another backup code
- Contact support if all codes fail

### Can't Change Email

**Possible Causes:**
- Email already in use
- Invalid email format
- Verification email not received

**Solution:**
- Check spam folder
- Try different email
- Contact support

### Password Change Failed

**Possible Causes:**
- Current password incorrect
- New password too weak
- Passwords don't match

**Solution:**
- Verify current password
- Use stronger password
- Ensure passwords match

---

## 📞 Support

### For Users
- **Email:** support@rechargehub.com
- **Profile Settings:** `/profile`
- **Security Help:** Available in app

### For Admins
- **Admin Dashboard:** `/admin`
- **Security Monitoring:** Check security events
- **User Support:** Help users with 2FA issues

---

## ✅ Checklist

### User Security Checklist
- [ ] 2FA enabled
- [ ] Backup codes saved
- [ ] Strong password set
- [ ] Email verified
- [ ] Login history reviewed
- [ ] Security settings configured

### Admin Security Checklist
- [ ] 2FA mandatory for admins
- [ ] Security monitoring active
- [ ] Login history reviewed
- [ ] Failed attempts monitored
- [ ] User support available
- [ ] Regular security audits

---

## 🎉 Summary

You now have a **complete security system** that includes:

✅ Two-Factor Authentication (2FA)  
✅ Profile management  
✅ Password changes  
✅ Email updates  
✅ Login history tracking  
✅ Security event monitoring  
✅ Backup codes  
✅ Activity logs  
✅ Admin oversight  
✅ Mobile support  

**Your users are now protected!** 🔐

---

*Last Updated: December 26, 2025*
*Version: 1.0.0*
