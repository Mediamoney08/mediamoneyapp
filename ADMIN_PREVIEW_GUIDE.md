# 🎯 Admin Dashboard Preview Access Guide

## ✅ Quick Start - 3 Simple Steps

### Step 1: Create Test Admin Account

**Option A: Use Signup Page (Recommended)**

1. Go to the signup page: `http://localhost:5173/signup`
2. Fill in the form with these exact credentials:
   ```
   Email:    admin@preview.test
   Username: testadmin
   Password: Admin123!Preview
   Phone:    +1234567890
   ```
3. Click "Sign Up"
4. Complete any email verification if required

**Option B: Use Existing Admin Account**

If you already have admin credentials, skip to Step 3 and use your existing email/password.

---

### Step 2: Promote User to Admin Role

After creating the account, you need to promote it to admin:

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run this query:

```sql
UPDATE profiles 
SET role = 'admin'
WHERE email = 'admin@preview.test';
```

4. Verify the update:

```sql
SELECT id, email, username, role 
FROM profiles 
WHERE email = 'admin@preview.test';
```

You should see `role: "admin"` in the result.

---

### Step 3: Access Admin Dashboard

**Method 1: Quick Login (Fastest) ⚡**

1. Go to: `http://localhost:5173/admin`
2. Look for the **"PREVIEW MODE"** section (highlighted in blue)
3. Click the **"Quick Login"** button
4. You'll be automatically logged in and redirected to the dashboard!

**Method 2: Manual Login**

1. Go to: `http://localhost:5173/admin`
2. Enter credentials manually:
   - Email: `admin@preview.test`
   - Password: `Admin123!Preview`
3. Click "Sign in as Admin"

**Method 3: Copy & Paste**

1. Go to: `http://localhost:5173/admin`
2. Click the **Copy** button (📋 icon) in the Preview Mode section
3. Paste credentials into the login form
4. Click "Sign in as Admin"

---

## 🎨 Admin Dashboard Features

Once logged in, you'll have access to:

### Dashboard Overview (`/admin/dashboard`)
- 📊 **Statistics Cards** - Users, orders, revenue, services
- 📈 **Charts & Graphs** - Revenue trends, order analytics
- 📋 **Recent Activity** - Latest orders and user registrations
- 🔔 **System Notifications** - Important alerts and updates

### User Management
- 👥 View all registered users
- 🔍 Search and filter users
- ✏️ Edit user profiles
- 💰 Manage user wallets
- 🚫 Ban/unban users
- 🔄 View user activity history

### Order Management
- 📦 View all orders
- 🔍 Filter by status (pending, completed, failed)
- ✏️ Update order status
- 💳 Process refunds
- 📊 Order analytics
- 📥 Export order data

### Service Management
- 🎮 Manage game recharge services
- 📱 Manage app subscriptions
- 🎬 Manage streaming services
- 🎁 Manage gift cards
- ➕ Add new services
- ✏️ Edit service details
- 💰 Update pricing
- 📦 Manage stock inventory

### Stock Inventory
- 📊 View stock levels
- ➕ Add new stock items
- 🔄 Automatic order fulfillment
- ⚠️ Low stock alerts
- 📈 Stock usage analytics

### Financial Management
- 💰 View revenue reports
- 📊 Transaction history
- 💳 Payment processing
- 📈 Financial analytics
- 📥 Export financial data

### Notifications
- 📢 Send system-wide announcements
- 👤 Send user-specific notifications
- 📧 Email notifications
- 🔔 Push notifications
- 📊 Notification analytics

### API Management
- 🔑 View API keys
- 📊 API usage statistics
- 🔒 Manage API permissions
- 📈 Rate limit monitoring

### Settings
- ⚙️ System configuration
- 🎨 Customize appearance
- 💱 Currency settings
- 🌍 Multi-language settings
- 🔒 Security settings

---

## 🔐 Test Credentials Reference

### Test Admin Account
```
Email:    admin@preview.test
Password: Admin123!Preview
Username: testadmin
Role:     admin
```

### Existing Admin Accounts (if available)
```
Email:    mediamoney@miaoda.com
Username: mediamoney
Role:     admin
Note:     Password unknown - use test account instead
```

```
Email:    mediamoney01@gmail.com
Username: admin
Role:     admin
Note:     Password unknown - use test account instead
```

---

## 🎯 Preview Mode Features

### Visual Indicators

When you visit `/admin`, you'll see:

```
┌─────────────────────────────────────────────────┐
│  🛡️  Admin Login                                │
│                                                  │
│  Email:    [                    ]               │
│  Password: [                    ]               │
│  [Sign in as Admin]                             │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ ⚡ PREVIEW MODE    For Testing Only      │  │
│  │                                           │  │
│  │ Test Admin Credentials:                  │  │
│  │                                           │  │
│  │ Email: admin@preview.test                │  │
│  │ Password: Admin123!Preview               │  │
│  │                                           │  │
│  │ [⚡ Quick Login]  [📋]                   │  │
│  │                                           │  │
│  │ ⚠️ Test account for preview purposes     │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Quick Actions

1. **⚡ Quick Login Button**
   - One-click login
   - Auto-fills credentials
   - Instant access to dashboard

2. **📋 Copy Button**
   - Copies credentials to clipboard
   - Shows checkmark when copied
   - Paste into any field

3. **👁️ Show/Hide Password**
   - Toggle password visibility
   - Verify credentials before login

---

## 🚀 Navigation Guide

### Admin Routes

```
/admin                    → Admin Login Page
/admin/dashboard          → Main Admin Dashboard (requires admin login)
/admin/old               → Alternative Dashboard View
/admin/manage            → Admin Management Page
```

### Quick Navigation

Once logged in as admin:

1. **Dashboard** - Click logo or "Dashboard" in sidebar
2. **Users** - Sidebar → "Users" or "User Management"
3. **Orders** - Sidebar → "Orders" or "Order Management"
4. **Services** - Sidebar → "Services" or "Service Management"
5. **Settings** - Sidebar → "Settings" or gear icon

---

## 🔍 Troubleshooting

### Issue: "Access Denied" Error

**Problem**: Logged in but getting "Access Denied"

**Solution**:
1. Check user role in database:
   ```sql
   SELECT email, role FROM profiles WHERE email = 'admin@preview.test';
   ```
2. If role is not 'admin', run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@preview.test';
   ```
3. Log out and log in again

---

### Issue: "Invalid Email or Password"

**Problem**: Login fails with credentials error

**Solution**:
1. Verify account exists:
   ```sql
   SELECT * FROM profiles WHERE email = 'admin@preview.test';
   ```
2. If account doesn't exist, sign up first at `/signup`
3. Use exact credentials (case-sensitive):
   - Email: `admin@preview.test`
   - Password: `Admin123!Preview`

---

### Issue: Quick Login Button Not Working

**Problem**: Quick Login button does nothing

**Solution**:
1. Check browser console for errors (F12)
2. Ensure account exists and is promoted to admin
3. Try manual login instead
4. Clear browser cache and cookies
5. Try in incognito/private mode

---

### Issue: Redirected Back to Login

**Problem**: Logs in but immediately redirected back

**Solution**:
1. Check if user role is 'admin':
   ```sql
   SELECT email, role FROM profiles WHERE email = 'admin@preview.test';
   ```
2. Ensure ProtectedRoute is working correctly
3. Check browser console for auth errors
4. Try clearing localStorage: `localStorage.clear()`

---

### Issue: Can't Access Certain Admin Pages

**Problem**: Some admin pages show 404 or redirect

**Solution**:
1. Verify you're logged in as admin
2. Check the route exists in `src/routes.tsx`
3. Ensure `requireAdmin: true` is set for admin routes
4. Check ProtectedRoute component is working

---

## 🛡️ Security Notes

### For Preview/Testing

✅ **Safe for Development**
- Test credentials are clearly marked
- Preview mode is visually distinct
- No production data at risk

⚠️ **Not for Production**
- Test account has full admin access
- Credentials are visible in code
- No rate limiting on test account

### Before Production Deployment

**CRITICAL: Remove Preview Mode**

1. **Delete Test Admin Account**
   ```sql
   DELETE FROM profiles WHERE email = 'admin@preview.test';
   ```

2. **Remove Preview Mode Code**
   
   Edit `src/pages/AdminLoginPage.tsx`:
   
   ```typescript
   // Comment out or delete these lines:
   
   // Lines 15-17: Test credentials
   const TEST_ADMIN_EMAIL = 'admin@preview.test';
   const TEST_ADMIN_PASSWORD = 'Admin123!Preview';
   
   // Lines 30-51: Quick login functions
   const handleQuickLogin = async () => { ... };
   const copyCredentials = () => { ... };
   
   // Lines 207-267: Preview Mode UI section
   {/* PREVIEW MODE - Test Credentials */}
   <div className="mt-6">...</div>
   ```

3. **Or Use Environment Variable**
   
   ```typescript
   // Add to .env
   VITE_SHOW_PREVIEW_MODE=false
   
   // In AdminLoginPage.tsx
   const SHOW_PREVIEW_MODE = import.meta.env.VITE_SHOW_PREVIEW_MODE === 'true';
   
   // Wrap Preview Mode section
   {SHOW_PREVIEW_MODE && (
     <div className="mt-6">
       {/* Preview Mode UI */}
     </div>
   )}
   ```

4. **Create Production Admin**
   
   - Sign up with secure email
   - Use strong password (16+ characters)
   - Promote to admin via SQL
   - Enable 2FA for admin account
   - Keep credentials in password manager

---

## 📊 Testing Checklist

### Before Testing Admin Dashboard

- [ ] Test admin account created (`admin@preview.test`)
- [ ] User promoted to admin role in database
- [ ] Can access `/admin` login page
- [ ] Preview Mode section is visible
- [ ] Quick Login button works
- [ ] Copy credentials button works
- [ ] Manual login works with test credentials

### Admin Dashboard Features to Test

- [ ] Dashboard loads successfully
- [ ] Statistics cards display data
- [ ] Charts and graphs render
- [ ] Can navigate to User Management
- [ ] Can navigate to Order Management
- [ ] Can navigate to Service Management
- [ ] Can navigate to Settings
- [ ] Sidebar navigation works
- [ ] Can log out successfully
- [ ] Non-admin users cannot access admin pages

### User Management Testing

- [ ] Can view list of users
- [ ] Can search/filter users
- [ ] Can view user details
- [ ] Can edit user profile
- [ ] Can update user wallet balance
- [ ] Can ban/unban users
- [ ] Changes save successfully

### Order Management Testing

- [ ] Can view list of orders
- [ ] Can filter by status
- [ ] Can view order details
- [ ] Can update order status
- [ ] Can process refunds
- [ ] Order statistics display correctly

### Service Management Testing

- [ ] Can view list of services
- [ ] Can add new service
- [ ] Can edit service details
- [ ] Can update pricing
- [ ] Can manage stock
- [ ] Can activate/deactivate services

---

## 🎓 Quick Tips

### Keyboard Shortcuts

- `Tab` - Navigate between fields
- `Enter` - Submit login form
- `Ctrl/Cmd + K` - Quick search (if implemented)
- `Esc` - Close modals/dialogs

### Browser DevTools

- `F12` - Open developer console
- Check Console tab for errors
- Check Network tab for API calls
- Check Application tab for localStorage

### Database Queries

**Check admin status:**
```sql
SELECT email, username, role FROM profiles WHERE role = 'admin';
```

**Promote user to admin:**
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL';
```

**View recent orders:**
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

**Check user count:**
```sql
SELECT COUNT(*) FROM profiles;
```

---

## 📞 Need Help?

### Common Questions

**Q: Can I use my own email for testing?**
A: Yes! Sign up with your email, then promote yourself to admin using SQL.

**Q: How do I reset the test admin password?**
A: Use Supabase Auth password reset, or delete and recreate the account.

**Q: Can I have multiple admin accounts?**
A: Yes! Promote any user to admin role using the SQL UPDATE query.

**Q: Is the preview mode secure?**
A: It's safe for development/testing but MUST be removed before production.

**Q: How do I disable preview mode temporarily?**
A: Comment out the Preview Mode section in AdminLoginPage.tsx (lines 207-267).

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Preview Mode section appears on `/admin` page  
✅ Quick Login button logs you in instantly  
✅ You're redirected to `/admin/dashboard`  
✅ Dashboard shows statistics and data  
✅ Sidebar navigation works  
✅ You can access all admin features  
✅ No console errors in browser DevTools  

---

## 📝 Summary

### What You Get

1. **Easy Access** - One-click login to admin dashboard
2. **Clear Credentials** - Test email and password displayed
3. **Quick Testing** - No need to remember credentials
4. **Visual Indicators** - Clear "Preview Mode" badge
5. **Copy Function** - Easy credential copying
6. **Production Ready** - Easy to remove before launch

### Next Steps

1. ✅ Create test admin account (Step 1)
2. ✅ Promote to admin role (Step 2)
3. ✅ Click Quick Login (Step 3)
4. 🎉 Start testing admin features!
5. 🧪 Test all admin functionality
6. 🚀 Remove preview mode before production

---

**Last Updated**: 2025-12-27  
**Version**: v1.0  
**Status**: ✅ READY FOR TESTING

---

## 🔗 Quick Links

- **Admin Login**: `http://localhost:5173/admin`
- **Admin Dashboard**: `http://localhost:5173/admin/dashboard`
- **Signup Page**: `http://localhost:5173/signup`
- **Main Site**: `http://localhost:5173/`

---

**Happy Testing! 🚀**
