# 🚀 QUICK START - Admin Access

## 📋 3-Step Setup

### Step 1: Sign Up
Go to `/login` and create an account with your email

### Step 2: Promote to Admin
Run this in Supabase SQL Editor:
```sql
UPDATE public.profiles
SET role = 'admin'::user_role
WHERE email = 'your-email@example.com';
```

### Step 3: Login
Log out, log back in, go to `/admin/dashboard`

---

## 🔑 Quick Commands

### Promote User:
```sql
UPDATE public.profiles SET role = 'admin'::user_role WHERE email = 'user@example.com';
```

### Check Role:
```sql
SELECT email, role FROM public.profiles WHERE email = 'user@example.com';
```

### List Admins:
```sql
SELECT email, username, role FROM public.profiles WHERE role = 'admin'::user_role;
```

---

## 🌐 Routes

- `/login` - User login/signup
- `/admin` - Admin login page
- `/admin/dashboard` - Admin dashboard (requires admin role)

---

## 🔧 Troubleshooting

**Access Denied?**
1. Log out
2. Clear cache
3. Log back in

**Profile not created?**
Check triggers are active:
```sql
SELECT * FROM information_schema.triggers WHERE event_object_table = 'users';
```

---

## 📚 Full Documentation

- **Complete Guide:** `ADMIN_AUTH_GUIDE.md`
- **Testing Guide:** `TESTING_GUIDE.md`
- **SQL Scripts:** `PROMOTE_USER_TO_ADMIN.sql`

---

**✅ System Status: READY**

Your authentication system is fully configured and ready to use!
