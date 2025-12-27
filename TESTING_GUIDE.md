# 🧪 Testing Your Admin System

## Step-by-Step Testing Guide

### ✅ Test 1: Create a Regular User Account

1. **Open your application** in a browser
2. **Navigate to** `/login`
3. **Click on "Sign Up" tab**
4. **Fill in the form:**
   - Username: `testuser`
   - Email: `testuser@example.com`
   - Phone: `1234567890` (optional)
   - Password: `TestUser123`
   - Confirm Password: `TestUser123`
5. **Click "Sign Up"**
6. **Expected Result:** ✅ Account created, automatically logged in

### ✅ Test 2: Verify Regular User Cannot Access Admin

1. **While logged in as testuser**
2. **Try to navigate to** `/admin/dashboard`
3. **Expected Result:** ❌ Redirected to home page with "Access Denied" message

### ✅ Test 3: Promote User to Admin

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Click "SQL Editor"

2. **Run this SQL:**
   ```sql
   UPDATE public.profiles
   SET role = 'admin'::user_role
   WHERE email = 'testuser@example.com';
   ```

3. **Verify the update:**
   ```sql
   SELECT id, email, username, role
   FROM public.profiles
   WHERE email = 'testuser@example.com';
   ```
   
4. **Expected Result:** Role should show as "admin"

### ✅ Test 4: Test Admin Access

1. **Log out** from your application
2. **Log back in** with:
   - Email/Username: `testuser@example.com` or `testuser`
   - Password: `TestUser123`
3. **Navigate to** `/admin/dashboard`
4. **Expected Result:** ✅ Admin dashboard loads successfully

### ✅ Test 5: Test Session Persistence

1. **While logged in as admin**
2. **Refresh the page** (F5 or Ctrl+R)
3. **Expected Result:** ✅ Still logged in, admin access maintained

### ✅ Test 6: Test Email Login

1. **Log out**
2. **Log in using email:** `testuser@example.com`
3. **Expected Result:** ✅ Login successful

### ✅ Test 7: Test Username Login

1. **Log out**
2. **Log in using username:** `testuser`
3. **Expected Result:** ✅ Login successful

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid login credentials"

**Possible Causes:**
- Wrong email/username
- Wrong password
- User doesn't exist

**Solution:**
1. Double-check your credentials
2. Try password reset (if implemented)
3. Create a new account

### Issue: "Access Denied" after promotion

**Cause:** Old session still cached

**Solution:**
1. Log out completely
2. Clear browser cache
3. Log back in
4. Role should now be updated

### Issue: Profile not created on signup

**Cause:** Trigger might not be working

**Solution:**
Run this SQL to manually create profile:
```sql
INSERT INTO public.profiles (id, email, username, role)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'username',
  'user'::user_role
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.profiles);
```

### Issue: Can't see admin dashboard

**Checklist:**
- [ ] User is logged in
- [ ] User role is 'admin' (check in database)
- [ ] Logged out and back in after promotion
- [ ] No console errors in browser
- [ ] Supabase connection is working

---

## 🔍 Debugging Commands

### Check if user exists:
```sql
SELECT id, email, created_at
FROM auth.users
WHERE email = 'testuser@example.com';
```

### Check user profile and role:
```sql
SELECT id, email, username, role, created_at
FROM public.profiles
WHERE email = 'testuser@example.com';
```

### List all admin users:
```sql
SELECT id, email, username, role, created_at
FROM public.profiles
WHERE role = 'admin'::user_role
ORDER BY created_at DESC;
```

### Check RLS policies:
```sql
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'profiles';
```

### Check if triggers are active:
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';
```

---

## 📊 Expected Database State

After creating a test user and promoting to admin:

### auth.users table:
```
id: [uuid]
email: testuser@example.com
created_at: [timestamp]
```

### public.profiles table:
```
id: [same uuid as auth.users]
email: testuser@example.com
username: testuser
role: admin
wallet_balance: 0
currency: USD
created_at: [timestamp]
```

---

## ✨ Success Criteria

Your admin system is working correctly if:

- ✅ Users can sign up with email and username
- ✅ Profiles are automatically created on signup
- ✅ Users can log in with email OR username
- ✅ Regular users cannot access `/admin/*` routes
- ✅ Admin users can access all admin routes
- ✅ Sessions persist across page refreshes
- ✅ Role changes take effect after re-login
- ✅ No console errors during authentication

---

## 🎯 Next Steps After Testing

Once all tests pass:

1. **Create your real admin account**
   - Use your actual email
   - Use a strong password
   - Promote to admin via SQL

2. **Remove test accounts**
   ```sql
   DELETE FROM auth.users WHERE email = 'testuser@example.com';
   -- Profile will be deleted automatically via CASCADE
   ```

3. **Secure your admin access**
   - Change default passwords
   - Enable 2FA (if implemented)
   - Limit admin promotions

4. **Start building admin features**
   - User management
   - Product management
   - Order management
   - Analytics dashboard

---

**🎉 Happy Testing!**

If all tests pass, your authentication system is fully functional and ready for production use.
