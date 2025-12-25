# Admin Panel Access Guide

## How to Access the Admin Panel

### Step 1: Create a User Account

1. **Go to the Login Page**:
   - Navigate to `/login` in your browser
   - Or click "Sign In" from the homepage

2. **Register a New Account**:
   - Click on the "Sign Up" tab
   - Enter your desired username
   - Enter a password (minimum 6 characters)
   - Confirm your password
   - Click "Sign Up"

3. **Verify Registration**:
   - You should see a success message
   - You will be automatically logged in

### Step 2: Set Your Account as Admin

Since this is a new installation, you need to manually set your user role to 'admin' in the database.

#### Option A: Using Supabase Dashboard (Recommended)

1. **Access Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to the "Table Editor" section

2. **Open Profiles Table**:
   - Find and click on the `profiles` table
   - You should see your newly created user account

3. **Update User Role**:
   - Find your user row (look for your username)
   - Click on the `role` field
   - Change the value from `user` to `admin`
   - Save the changes

4. **Refresh Your Browser**:
   - Log out and log back in
   - Or simply refresh the page

#### Option B: Using SQL Query

1. **Access SQL Editor**:
   - Go to your Supabase project dashboard
   - Navigate to the "SQL Editor" section

2. **Run This Query**:
   ```sql
   -- Replace 'your_username' with your actual username
   UPDATE public.profiles
   SET role = 'admin'
   WHERE username = 'your_username';
   ```

3. **Verify the Update**:
   ```sql
   -- Check if the role was updated
   SELECT username, role FROM public.profiles WHERE username = 'your_username';
   ```

4. **Refresh Your Browser**:
   - Log out and log back in
   - Or simply refresh the page

### Step 3: Access Admin Features

Once your account has the 'admin' role:

1. **Log In**:
   - Go to `/login`
   - Enter your username and password
   - Click "Sign In"

2. **Access Admin Panel**:
   - Click on your profile icon in the top-right corner
   - You should now see admin menu options:
     - **Payment Approvals** → `/admin`
     - **Admin Management** → `/admin/manage`

3. **Or Navigate Directly**:
   - Payment Approvals: `http://your-domain/admin`
   - Admin Management: `http://your-domain/admin/manage`

## Admin Panel Features

### Payment Approvals (`/admin`)
- Review pending payment proofs
- Approve or reject user payment submissions
- View payment proof images
- Add admin notes
- Automatically credit user wallets on approval

### Admin Management (`/admin/manage`)
Full site management with 6 tabs:

1. **Categories Tab**:
   - Create, edit, delete categories
   - Upload category images
   - Set display order
   - Toggle active/inactive status

2. **Products Tab**:
   - Manage all products
   - Set prices and stock quantities
   - Assign to categories
   - Set service names (Global, Prime, etc.)

3. **Users Tab**:
   - View all registered users
   - Toggle admin roles
   - Adjust wallet balances
   - View user activity

4. **Orders Tab**:
   - View all orders
   - Update order status
   - Process refunds
   - View order details

5. **Payments Tab**:
   - Same as Payment Approvals page
   - Review and approve payment proofs

6. **Methods Tab**:
   - Manage payment methods
   - Set instructions
   - Configure account details
   - Toggle availability

## Troubleshooting

### "Access Denied" Message
**Problem**: You see "Access Denied" when trying to access admin pages.

**Solution**:
1. Verify your role is set to 'admin' in the database
2. Log out and log back in
3. Clear browser cache
4. Check browser console for errors

### Admin Menu Not Showing
**Problem**: You don't see admin options in the profile menu.

**Solution**:
1. Confirm you're logged in
2. Verify your role is 'admin' in the database
3. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
4. Try logging out and back in

### Can't Update Role in Database
**Problem**: You don't have access to update the database.

**Solution**:
1. Make sure you're the project owner in Supabase
2. Check your Supabase project permissions
3. Use the service role key if needed (be careful with this)

## Security Best Practices

### Protect Your Admin Account
1. **Use a Strong Password**:
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Don't reuse passwords

2. **Don't Share Credentials**:
   - Each admin should have their own account
   - Never share your admin username/password

3. **Regular Security Checks**:
   - Review admin users regularly
   - Remove admin access when no longer needed
   - Monitor admin activity logs

### Creating Additional Admins

To create more admin users:

1. **Have them register normally** through the sign-up page
2. **Update their role** using SQL:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE username = 'new_admin_username';
   ```
3. **Notify them** to log out and back in

## Quick Reference

### Database Structure
```
profiles table:
- id: UUID (primary key)
- username: TEXT (unique)
- email: TEXT
- role: user_role ('user' or 'admin')
- wallet_balance: NUMERIC
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Role Values
- `user` - Regular user (default)
- `admin` - Administrator with full access

### Admin Routes
- `/admin` - Payment approvals
- `/admin/manage` - Full admin management

### SQL Queries

**Check your role**:
```sql
SELECT username, role FROM public.profiles WHERE username = 'your_username';
```

**Set admin role**:
```sql
UPDATE public.profiles SET role = 'admin' WHERE username = 'your_username';
```

**List all admins**:
```sql
SELECT username, email, created_at FROM public.profiles WHERE role = 'admin';
```

**Remove admin role**:
```sql
UPDATE public.profiles SET role = 'user' WHERE username = 'username_to_demote';
```

## First-Time Setup Checklist

- [ ] Register a user account through the website
- [ ] Access Supabase dashboard
- [ ] Update user role to 'admin' in profiles table
- [ ] Log out and log back in
- [ ] Verify admin menu appears in profile dropdown
- [ ] Access `/admin/manage` successfully
- [ ] Create initial categories
- [ ] Add products to categories
- [ ] Configure payment methods
- [ ] Test the admin features

## Need Help?

If you're still having trouble accessing the admin panel:

1. **Check Browser Console**:
   - Press F12 to open developer tools
   - Look for error messages in the Console tab
   - Share any errors for troubleshooting

2. **Verify Database Connection**:
   - Make sure your Supabase project is active
   - Check that environment variables are set correctly
   - Verify the database URL is correct

3. **Check Authentication**:
   - Ensure you can log in as a regular user first
   - Verify your session is active
   - Try clearing cookies and logging in again

---

**Last Updated**: 2025-12-25
**Version**: 1.0
