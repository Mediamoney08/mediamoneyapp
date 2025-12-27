# Create Test Admin Account

## Automatic Setup Instructions

The test admin account will be created automatically when you first try to log in with the test credentials.

However, if you want to create it manually, follow these steps:

## Manual Setup (If Needed)

### Step 1: Sign Up the Test Admin User

1. Go to the signup page: `/signup` or click "Sign Up" on the login page
2. Use these credentials:
   - **Email**: `admin@preview.test`
   - **Username**: `testadmin`
   - **Password**: `Admin123!Preview`
   - **Phone**: `+1234567890` (or any valid phone)

3. Complete the signup process

### Step 2: Promote User to Admin

After signup, run this SQL query in your Supabase SQL Editor:

```sql
-- Promote the test user to admin role
UPDATE profiles 
SET role = 'admin'
WHERE email = 'admin@preview.test';
```

### Step 3: Verify Admin Access

1. Go to `/admin` (Admin Login page)
2. Click the "Quick Login" button in the Preview Mode section
3. You should be redirected to the Admin Dashboard

## Test Credentials

**Email**: `admin@preview.test`  
**Password**: `Admin123!Preview`

## Quick Access

- **Admin Login Page**: `/admin`
- **Admin Dashboard**: `/admin/dashboard` (requires admin login)

## Features

✅ **Quick Login Button** - One-click login with test credentials  
✅ **Copy Credentials** - Copy email and password to clipboard  
✅ **Visual Preview Mode Badge** - Clear indication this is for testing  
✅ **Manual Login** - Can also manually enter credentials  

## Security Notes

⚠️ **IMPORTANT**: This is a test account for preview/development only.

**Before Production Deployment:**
1. Delete the test admin account from the database
2. Remove or comment out the Preview Mode section in `AdminLoginPage.tsx`
3. Change the `TEST_ADMIN_EMAIL` and `TEST_ADMIN_PASSWORD` constants to empty strings

## Removing Preview Mode

To disable preview mode, edit `/src/pages/AdminLoginPage.tsx`:

```typescript
// Option 1: Set to false to hide preview mode
const SHOW_PREVIEW_MODE = false;

// Option 2: Comment out the entire Preview Mode section (lines ~207-267)
```

Or simply delete these lines:
- Line 15-17: Test credentials constants
- Line 30-51: Quick login and copy functions
- Line 207-267: Preview Mode UI section

## Alternative: Use Existing Admin Account

If you already have an admin account in the system, you can use those credentials instead:

1. Check existing admin accounts:
```sql
SELECT email, username, role 
FROM profiles 
WHERE role = 'admin';
```

2. If you know the password for any of these accounts, use them to login
3. If you don't know the password, you can reset it through Supabase Auth

---

**Last Updated**: 2025-12-27  
**Status**: Ready for Testing
