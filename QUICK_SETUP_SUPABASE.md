# 🚀 Quick Setup Guide - Supabase Connection

## ✅ Step 1: Connection Complete

Your app is now connected to Supabase!

```
✅ Supabase URL updated
✅ Anon Key configured
✅ Environment variables set
```

---

## 📋 Step 2: Setup Database (REQUIRED)

### Option A: Use Combined Migration Script (Easiest)

1. Open your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/hbqeslmfietqvdbkaqsy
   ```

2. Click **SQL Editor** in the left sidebar

3. Click **New Query**

4. Open the file `COMBINED_MIGRATION.sql` in this project

5. Copy ALL content and paste into the SQL Editor

6. Click **Run** (or press Ctrl+Enter)

7. Wait for completion (30-60 seconds)

8. You should see "Success. No rows returned"

### Option B: Run Migrations Individually

If the combined script fails, run each migration file separately in order:

```
supabase/migrations/00001_create_initial_schema.sql
supabase/migrations/00002_add_categories_and_payment_methods.sql
supabase/migrations/00003_restructure_for_admin_system.sql
... (continue with all 17 migrations)
```

---

## 🔐 Step 3: Create Admin Account

### 3.1 Start Your App

```bash
npm run dev
```

### 3.2 Sign Up

Go to: `http://localhost:5173/signup`

Create an account with your email.

### 3.3 Promote to Admin

In Supabase SQL Editor, run:

```sql
-- Replace with your email
UPDATE profiles 
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 3.4 Login as Admin

Go to: `http://localhost:5173/admin`

Login with your credentials.

---

## 🧪 Alternative: Use Test Admin (Quick Preview)

### Create Test Account

1. Go to: `http://localhost:5173/signup`
2. Use these credentials:
   ```
   Email:    admin@preview.test
   Password: Admin123!Preview
   Username: testadmin
   Phone:    +1234567890
   ```

### Promote to Admin

```sql
UPDATE profiles 
SET role = 'admin'
WHERE email = 'admin@preview.test';
```

### Quick Login

1. Go to: `http://localhost:5173/admin`
2. Click **"Quick Login"** button in Preview Mode section
3. Done! 🎉

---

## ✅ Verify Setup

### Check Tables Created

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see 25+ tables including:
- profiles
- categories
- products
- orders
- notifications
- banners
- api_keys
- support_tickets
- etc.

### Check Admin Account

```sql
SELECT id, email, username, role 
FROM profiles 
WHERE role = 'admin';
```

---

## 🎯 You're Ready!

Once database is set up and admin account created:

1. ✅ Access admin dashboard: `http://localhost:5173/admin`
2. ✅ Manage users, orders, products
3. ✅ Configure site settings
4. ✅ Start testing all features!

---

## 📚 Full Documentation

- **Complete Guide**: `SUPABASE_CONNECTION_COMPLETE.md`
- **Admin Preview**: `ADMIN_PREVIEW_GUIDE.md`
- **Visual Guide**: `ADMIN_VISUAL_GUIDE.md`

---

## 🆘 Troubleshooting

**Issue: Connection errors**
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check `.env` file has correct URL and key

**Issue: Table not found**
- Run the `COMBINED_MIGRATION.sql` script
- Verify tables exist with the SQL query above

**Issue: Can't login as admin**
- Check role is 'admin' in database
- Run the UPDATE query to promote your account

---

**Status**: ✅ Connected  
**Next**: Run database migrations  
**Then**: Create admin account  
**Finally**: Start building! 🚀
