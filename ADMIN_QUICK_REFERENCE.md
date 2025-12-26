# Admin Dashboard - Quick Reference

## Access
- **URL**: `/admin`
- **Requirement**: Admin role required
- **Login**: Must be authenticated

---

## Dashboard Tabs

### 1. 📊 Overview
- View real-time statistics
- Monitor revenue and orders
- Track pending payments
- See recent activity

### 2. 📦 Products
**Products Sub-tab:**
- Add/Edit/Delete products
- Search products
- Manage stock
- Toggle active status

**Categories Sub-tab:**
- Add/Edit/Delete categories
- Set display order
- Add icons

**Stock Sub-tab:**
- Manage inventory
- Track stock levels

### 3. 🛒 Orders
- View all orders
- Search by ID
- Filter by status
- Update order status
- Process refunds

### 4. 👥 Users
- View all users
- Search users
- Update roles (user/admin)
- Manage wallet balance

### 5. 💳 Payments
- Verify payment proofs
- View proof images
- Approve/Reject payments
- Add admin notes

### 6. 🎨 Content
- Manage banners
- Upload images
- Set display order

### 7. ⚙️ Settings
- Site configuration
- API keys
- Payment providers
- User levels
- Custom rates
- Profit margins

---

## Quick Actions

### Add Product
1. Products tab → Add Product
2. Fill: Name, Price, Category
3. Click Create

### Verify Payment
1. Payments tab → Click eye icon
2. Review proof image
3. Click Approve/Reject

### Update User Balance
1. Users tab → Click $ icon
2. Enter amount (+/-)
3. Click Update

### Process Refund
1. Orders tab → Click eye icon
2. Click Refund Order
3. Confirm

### Change User Role
1. Users tab → Click shield icon
2. Select role
3. Click Update

---

## Search & Filter

**Products**: Search by name/description  
**Orders**: Search by order ID or user ID  
**Users**: Search by email, username, or ID  
**Payments**: Filter by status  
**Orders**: Filter by status  

---

## Status Indicators

### Orders
- 🟡 **Pending** - Awaiting processing
- 🟢 **Completed** - Successfully fulfilled
- 🔴 **Failed** - Requires attention

### Payments
- 🟡 **Pending** - Awaiting verification
- 🟢 **Approved** - Payment verified
- 🔴 **Rejected** - Payment declined

### Products/Categories
- 🟢 **Active** - Visible to users
- ⚫ **Inactive** - Hidden from users

---

## Important Notes

⚠️ **Before Deleting:**
- Categories: Affects all products in category
- Products: Cannot be undone
- Users: Not recommended

✅ **Best Practices:**
- Add admin notes when rejecting payments
- Verify payment proofs carefully
- Use search before bulk operations
- Refresh data after major changes

🔒 **Security:**
- Only admins can access dashboard
- All actions are logged
- User data is protected

---

## Keyboard Shortcuts

- `Tab` - Navigate between fields
- `Enter` - Submit forms
- `Esc` - Close dialogs
- `Ctrl+F` - Browser search

---

## Need Help?

📖 **Full Guide**: See `ADMIN_DASHBOARD_GUIDE.md`  
🎫 **Support**: Create ticket in Support page  
📚 **API Docs**: Visit `/api-docs`  

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-25
