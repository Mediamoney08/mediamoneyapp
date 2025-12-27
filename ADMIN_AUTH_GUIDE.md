# 🔐 Admin Authentication System - Complete Guide

## ✅ System Status

Your Recharge Hub application now has a **fully functional admin authentication system** powered by Supabase Auth.

### What's Already Set Up:

1. ✅ **Supabase Authentication** - Email/password login system
2. ✅ **User Profiles Table** - With role-based access control
3. ✅ **Role System** - `user` (default) and `admin` roles
4. ✅ **Protected Routes** - Admin dashboard requires admin role
5. ✅ **Auto Profile Creation** - Profiles created automatically on signup
6. ✅ **Session Persistence** - Auth state persists on page refresh
7. ✅ **RLS Policies** - Row-level security for data protection

---

## 🚀 Quick Start: Create Your Admin Account

### Method 1: Promote Existing User (RECOMMENDED)

This is the easiest method:

1. **Sign up** through your website at `/login`
   - Use your real email address
   - Create a strong password
   - Complete the signup process

2. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `recharge-hub`
   - Click on "SQL Editor" in the left sidebar

3. **Run the Promotion SQL**
   ```sql
   UPDATE public.profiles
   SET role = 'admin'::user_role
   WHERE email = 'your-email@example.com';  -- Replace with your email
   ```

4. **Verify it worked**
   ```sql
   SELECT id, email, username, role
   FROM public.profiles
   WHERE email = 'your-email@example.com';
   ```
   You should see `role: "admin"` in the results

5. **Log out and log back in**
   - Go to your website
   - Log out if you're logged in
   - Log in again with your credentials
   - Navigate to `/admin/dashboard`
   - You should now have access! 🎉

### Method 2: Create Admin User Directly

If you want to create a dedicated admin account:

1. Open Supabase SQL Editor
2. Use the `CREATE_ADMIN_USER.sql` file in your project root
3. Modify the email and password in the script
4. Run the entire script
5. Login with the credentials you set

---

## 🔑 How Authentication Works

### User Flow:
```
1. User signs up → Supabase creates auth.users entry
2. Trigger fires → Profile created in public.profiles (role: 'user')
3. User logs in → Session created and stored
4. User navigates → AuthContext provides user + profile data
5. Protected routes → Check if user is logged in
```

### Admin Flow:
```
1. Admin logs in → Same as user flow
2. Admin navigates to /admin/* → ProtectedRoute checks role
3. If role = 'admin' → Access granted ✅
4. If role = 'user' → Redirected to home ❌
```

---

## 🛡️ Security Features

### 1. **Row Level Security (RLS)**
- Users can only view/edit their own profile
- Admins can view/edit all profiles
- Enforced at database level

### 2. **Role Protection**
- Users cannot change their own role
- Only database admins can promote users
- Role changes require direct SQL access

### 3. **Session Management**
- Sessions persist across page refreshes
- Automatic token refresh
- Secure logout clears all session data

### 4. **Protected Routes**
The `ProtectedRoute` component:
- Checks authentication status
- Verifies admin role when required
- Shows loading state during verification
- Redirects unauthorized users

---

## 📁 Key Files

### Frontend:
- **`/src/contexts/AuthContext.tsx`** - Authentication state management
- **`/src/components/ProtectedRoute.tsx`** - Route protection logic
- **`/src/pages/AdminDashboard.tsx`** - Main admin interface
- **`/src/pages/LoginPage.tsx`** - Login/signup interface
- **`/src/db/api.ts`** - Database API functions

### Backend:
- **`/supabase/migrations/`** - Database schema and policies
- **Supabase Auth** - Handles user authentication
- **RLS Policies** - Enforce access control

---

## 🧪 Testing Your Setup

### Test 1: Regular User Access
1. Create a new account (don't promote to admin)
2. Try to access `/admin/dashboard`
3. You should be redirected to home page
4. You should see "Access Denied" toast message

### Test 2: Admin Access
1. Use your promoted admin account
2. Navigate to `/admin/dashboard`
3. You should see the full admin dashboard
4. All admin features should be accessible

### Test 3: Session Persistence
1. Log in as admin
2. Refresh the page
3. You should remain logged in
4. Admin access should still work

---

## 🔧 Troubleshooting

### Problem: "Access Denied" even after promotion

**Solution:**
1. Log out completely
2. Clear browser cache/cookies
3. Log back in
4. The new role should now be loaded

### Problem: Can't access Supabase SQL Editor

**Solution:**
1. Make sure you're logged into Supabase
2. Select the correct project
3. You need project owner/admin access
4. Check your Supabase account permissions

### Problem: Profile not created on signup

**Solution:**
1. Check if triggers are enabled:
   ```sql
   SELECT * FROM information_schema.triggers
   WHERE event_object_table = 'users';
   ```
2. Manually create profile if needed:
   ```sql
   INSERT INTO public.profiles (id, email, role)
   SELECT id, email, 'user'::user_role
   FROM auth.users
   WHERE id NOT IN (SELECT id FROM public.profiles);
   ```

### Problem: "Failed to verify access permissions"

**Solution:**
1. Check browser console for errors
2. Verify Supabase connection in `.env` file
3. Ensure RLS policies are active:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

---

## 🎯 Next Steps

Now that authentication is working, you can:

1. **Customize Admin Dashboard**
   - Add more admin features
   - Create management interfaces
   - Build analytics dashboards

2. **Add More Roles**
   - Modify the `user_role` enum
   - Create role-specific permissions
   - Build role management UI

3. **Enhance Security**
   - Add 2FA (two-factor authentication)
   - Implement password reset
   - Add email verification
   - Set up audit logging

4. **User Management**
   - Build user list interface
   - Add user search/filter
   - Create user detail pages
   - Implement user actions (ban, promote, etc.)

---

## 📞 Quick Reference

### Admin Routes:
- `/admin` - Admin login page
- `/admin/dashboard` - Main admin dashboard
- `/admin/manage` - Admin management page

### User Routes:
- `/login` - User login/signup
- `/profile` - User profile settings
- `/wallet` - User wallet
- `/orders` - User orders

### SQL Commands:

**Promote user to admin:**
```sql
UPDATE public.profiles SET role = 'admin'::user_role WHERE email = 'user@example.com';
```

**Demote admin to user:**
```sql
UPDATE public.profiles SET role = 'user'::user_role WHERE email = 'admin@example.com';
```

**List all admins:**
```sql
SELECT id, email, username, role, created_at FROM public.profiles WHERE role = 'admin'::user_role;
```

**Check user role:**
```sql
SELECT email, role FROM public.profiles WHERE email = 'user@example.com';
```

---

## ✨ Features Summary

### ✅ Implemented:
- Email/password authentication
- Role-based access control (user/admin)
- Protected admin routes
- Session persistence
- Auto profile creation
- RLS security policies
- Admin dashboard
- User profile management

### 🎨 Preview Mode:
- Quick login for development
- Test accounts available
- Easy role switching for testing

---

## 🔒 Security Best Practices

1. **Never commit credentials** - Keep passwords secure
2. **Use strong passwords** - Especially for admin accounts
3. **Regular audits** - Check admin user list periodically
4. **Limit admin access** - Only promote trusted users
5. **Monitor activity** - Track admin actions
6. **Backup regularly** - Protect your data
7. **Update dependencies** - Keep Supabase client updated

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React Context API](https://react.dev/reference/react/useContext)
- [React Router Protected Routes](https://reactrouter.com/en/main/start/overview)

---

**🎉 Your admin system is ready to use!**

Follow the Quick Start guide above to create your first admin account and start managing your Recharge Hub platform.
