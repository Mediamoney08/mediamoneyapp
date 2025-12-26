# Quick Start Guide - Admin Dashboard Access

## 🚀 How to Access the Admin Dashboard

### Step 1: Create an Admin Account

Since this is a development environment, you need to manually set a user as admin in the database.

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Table Editor → `profiles` table
3. Find your user record
4. Edit the `role` column and change it to `'admin'`
5. Save the changes

#### Option B: Using SQL Query
Run this SQL query in Supabase SQL Editor:

```sql
-- First, find your user_id
SELECT id, email FROM auth.users;

-- Then update the profile to admin
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = 'YOUR_USER_ID_HERE';

-- Verify the change
SELECT * FROM profiles WHERE role = 'admin';
```

### Step 2: Login to the Application

1. Open your browser and go to: `http://localhost:5173`
2. Click "Login" in the header
3. Enter your admin credentials
4. Click "Sign In"

### Step 3: Access Admin Dashboard

After logging in, you have two ways to access the admin dashboard:

#### Method 1: Direct URL
- Navigate to: `http://localhost:5173/admin`

#### Method 2: User Menu
1. Click on your profile icon/menu in the header (top right)
2. Look for "Admin Panel" option
3. Click "Admin Panel"

---

## 🎯 What You'll See

Once you access the admin dashboard, you'll see:

### Header Section
```
Admin Dashboard
Manage your recharge hub platform
```

### Navigation Tabs (17 Main Sections)
1. **Overview** - Dashboard statistics and metrics
2. **Users** - User management
3. **Orders** - Order processing and tracking
4. **Subscriptions** - Recurring subscriptions
5. **Drip-feed** - Gradual delivery system
6. **Refill** - Automatic refill management
7. **Services** - Service and product catalog
8. **Payments** - Payment verification
9. **Tickets** - Customer support
10. **Affiliates** - Affiliate program
11. **Child Panels** - Sub-panel management
12. **Security** - Security settings and monitoring
13. **System** - System health and monitoring
14. **Updates** - Announcements and updates
15. **Reports** - Analytics and reports
16. **Appearance** - Theme customization
17. **Settings** - Detailed configuration

---

## 🔐 Security Features

The admin dashboard includes:
- ✅ Automatic role verification
- ✅ Redirect to login if not authenticated
- ✅ Access denied message for non-admin users
- ✅ Session management
- ✅ Activity logging

---

## 📱 Responsive Design

The admin dashboard is fully responsive:
- **Desktop**: Full tab labels with icons
- **Mobile**: Icon-only tabs with horizontal scroll
- **Tablet**: Optimized layout for medium screens

---

## 🛠️ Troubleshooting

### Issue: "Access Denied" Message
**Solution**: Make sure your user role is set to 'admin' in the database

### Issue: Redirected to Homepage
**Solution**: Check if you're logged in. If yes, verify admin role in database

### Issue: Admin Panel Not Showing in Menu
**Solution**: The menu only shows "Admin Panel" if your role is 'admin'

### Issue: Page Not Loading
**Solution**: 
1. Check browser console for errors
2. Verify Supabase connection
3. Ensure all admin components are properly imported

---

## 📊 Quick Actions

Once in the admin dashboard, you can:

### Immediate Actions
- View real-time statistics on Overview tab
- Check pending orders in Orders tab
- Verify payments in Payments tab
- Respond to tickets in Tickets tab
- Monitor system health in System tab

### Configuration Tasks
- Set up service categories in Settings → Categories
- Add products in Settings → Products
- Configure payment methods in Settings → Site Settings
- Customize appearance in Appearance tab
- Set up email templates in Settings → Email Templates

### User Management
- View all users in Users tab
- Adjust user levels in Settings → User Levels
- Set custom rates in Settings → Custom Rates
- Manage admin users in Settings → Admin Users

---

## 🎨 Customization Options

From the admin dashboard, you can customize:

1. **Branding**
   - Upload logo (Settings → Site Settings)
   - Set site name and description
   - Configure theme colors (Appearance)

2. **Content**
   - Manage banners (Settings → Banners)
   - Create announcements (Updates)
   - Set up email templates (Settings → Email Templates)

3. **Features**
   - Enable/disable modules (Settings → Modules)
   - Configure integrations (Settings → Integrations)
   - Set up bonuses (Settings → Bonuses)

4. **Security**
   - Configure 2FA (Security)
   - Set IP whitelist (Security)
   - Manage sessions (Security)
   - View activity logs (Settings → Activity Logs)

---

## 📈 Monitoring & Analytics

### Real-time Monitoring
- **System Tab**: Server health, resource usage, API performance
- **Security Tab**: Login attempts, security events
- **Overview Tab**: Revenue, orders, user growth

### Reports
- **Reports Tab**: Generate custom reports
- Export data in CSV or PDF format
- Filter by date range
- View detailed analytics

---

## 💡 Pro Tips

1. **Bookmark the Admin URL**: Save `http://localhost:5173/admin` for quick access
2. **Use Keyboard Shortcuts**: Navigate tabs quickly
3. **Check Overview Daily**: Monitor key metrics
4. **Review Security Logs**: Regular security audits
5. **Export Reports**: Keep records of important data
6. **Test Features**: Use the system as a regular user to understand the flow

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Review the database connection in Supabase
3. Verify all environment variables are set
4. Check the network tab for failed API requests
5. Review the activity logs in Settings → Activity Logs

---

*For detailed feature documentation, see ADMIN_DASHBOARD_FEATURES.md*
