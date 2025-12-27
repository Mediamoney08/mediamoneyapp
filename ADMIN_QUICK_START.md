# 🚀 Quick Start: Admin Dashboard Access

## ⚡ 3-Step Quick Access

### 1️⃣ Create Test Admin
Go to signup page and create account:
- **Email**: `admin@preview.test`
- **Password**: `Admin123!Preview`
- **Username**: `testadmin`

### 2️⃣ Promote to Admin
Run in Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@preview.test';
```

### 3️⃣ Login
1. Go to: `http://localhost:5173/admin`
2. Click **"Quick Login"** button in Preview Mode section
3. Done! 🎉

---

## 🎯 Test Credentials

```
Email:    admin@preview.test
Password: Admin123!Preview
```

---

## 📍 Admin Routes

- `/admin` - Login page with Quick Login button
- `/admin/dashboard` - Main admin dashboard
- `/admin/manage` - Admin management

---

## 🔧 Troubleshooting

**Access Denied?**
```sql
-- Check role
SELECT email, role FROM profiles WHERE email = 'admin@preview.test';

-- Fix if needed
UPDATE profiles SET role = 'admin' WHERE email = 'admin@preview.test';
```

**Account doesn't exist?**
1. Sign up at `/signup` first
2. Then run the SQL to promote to admin

---

## ⚠️ Before Production

**REMOVE PREVIEW MODE:**

1. Delete test admin:
```sql
DELETE FROM profiles WHERE email = 'admin@preview.test';
```

2. Remove from `AdminLoginPage.tsx`:
   - Lines 15-17: Test credentials constants
   - Lines 30-51: Quick login functions  
   - Lines 207-267: Preview Mode UI section

---

## 📚 Full Documentation

See `ADMIN_PREVIEW_GUIDE.md` for complete documentation.

---

**Status**: ✅ Ready for Testing  
**Last Updated**: 2025-12-27
