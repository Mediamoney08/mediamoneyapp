# 🎯 QUICK REFERENCE - Supabase Setup

## ✅ Connection Status: CONNECTED

Your app is connected to Supabase!  
**Project**: hbqeslmfietqvdbkaqsy

---

## 🚀 2-Step Setup (REQUIRED)

### 1️⃣ Setup Database (5 min)

1. Go to: https://supabase.com/dashboard/project/hbqeslmfietqvdbkaqsy/sql
2. Click "New Query"
3. Copy content from `COMBINED_MIGRATION.sql`
4. Paste and click "Run"
5. Wait for "Success"

### 2️⃣ Create Admin (2 min)

```bash
# Start app
npm run dev

# Go to: http://localhost:5173/signup
# Sign up with your email

# Then in Supabase SQL Editor:
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

# Login at: http://localhost:5173/admin
```

---

## ⚡ Quick Test Admin

**Fastest way to test:**

1. Signup at `/signup` with:
   ```
   Email:    admin@preview.test
   Password: Admin123!Preview
   Username: testadmin
   ```

2. Promote to admin:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@preview.test';
   ```

3. Go to `/admin` and click **"Quick Login"**

---

## 📋 Verify Setup

```sql
-- Check tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Check admin account
SELECT email, role FROM profiles WHERE role = 'admin';
```

---

## 🔗 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/hbqeslmfietqvdbkaqsy
- **SQL Editor**: https://supabase.com/dashboard/project/hbqeslmfietqvdbkaqsy/sql
- **Admin Login**: http://localhost:5173/admin
- **Admin Dashboard**: http://localhost:5173/admin/dashboard

---

## 📚 Full Guides

- `CONNECTION_SUCCESS.md` - Complete summary
- `SUPABASE_CONNECTION_COMPLETE.md` - Detailed setup
- `QUICK_SETUP_SUPABASE.md` - Quick start
- `ADMIN_PREVIEW_GUIDE.md` - Admin access guide

---

## 🆘 Troubleshooting

**Connection errors?**
```bash
# Restart dev server
Ctrl+C
npm run dev
```

**Tables not found?**
- Run `COMBINED_MIGRATION.sql` in SQL Editor

**Can't login as admin?**
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

**Status**: ✅ Connected | ⏳ Database Setup Required  
**Next**: Run `COMBINED_MIGRATION.sql` → Create Admin → Start Building! 🚀
