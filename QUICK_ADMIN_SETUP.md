# Quick Admin Setup - 3 Steps

## Step 1: Register an Account
```
1. Go to /login
2. Click "Sign Up" tab
3. Enter username and password
4. Click "Sign Up"
```

## Step 2: Make Yourself Admin
```
1. Open Supabase Dashboard
2. Go to Table Editor → profiles table
3. Find your username
4. Change role from "user" to "admin"
5. Save
```

**OR use SQL**:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE username = 'your_username';
```

## Step 3: Access Admin Panel
```
1. Refresh your browser
2. Click profile icon (top-right)
3. Click "Admin Management"
4. You're in! 🎉
```

## Admin URLs
- **Full Management**: `/admin/manage`
- **Payment Approvals**: `/admin`

## Important Notes
- Default role for new users is `user`
- Only users with role `admin` can access admin panel
- You must manually set the first admin in the database
- After that, admins can promote other users through the UI (Users tab)

## Troubleshooting
**Can't see admin menu?**
- Check your role in database: `SELECT role FROM profiles WHERE username = 'your_username';`
- Log out and log back in
- Clear browser cache

**Access denied?**
- Your role must be exactly `admin` (lowercase)
- Refresh the page after changing role
- Check browser console for errors

---

For detailed instructions, see **ADMIN_ACCESS_GUIDE.md**
