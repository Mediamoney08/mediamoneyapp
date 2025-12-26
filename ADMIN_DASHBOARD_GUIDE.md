# Admin Dashboard - Complete Implementation Guide

## Overview

The Recharge Hub admin dashboard is a comprehensive management interface that connects all backend functionality with an intuitive frontend. It provides complete control over products, orders, users, payments, and system settings.

---

## Access

### URL
```
/admin
```

### Requirements
- Must be logged in
- User role must be `admin`
- Automatic redirect to home page if not authorized

---

## Dashboard Structure

The admin dashboard uses a tabbed interface with 7 main sections:

### 1. Overview Tab
**Real-time Statistics Dashboard**

**Features:**
- Total Revenue (from all orders)
- Total Orders Count
- Total Users Count
- Total Products Count
- Order Status Breakdown (Pending/Completed/Failed)
- Recent Orders List (last 5 orders)
- Pending Payments Alert

**Data Sources:**
- `orders` table - for revenue and order counts
- `profiles` table - for user count
- `products` table - for product count
- `payment_requests` table - for pending payments

**Auto-refresh:** Data loads on component mount

---

### 2. Products Tab

#### Sub-tabs:
- **Products** - Product management
- **Categories** - Category management
- **Stock** - Inventory management

#### Products Management

**Features:**
- ✅ Create new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Search products by name/description
- ✅ View product details
- ✅ Toggle active/inactive status
- ✅ Manage stock quantity

**Fields:**
- Name (required)
- Description
- Price (required)
- Category (required): game, app, streaming, giftcard
- Stock Quantity
- Image URL
- Active Status

**API Functions:**
- `getAllProductsAdmin()` - Get all products
- `createProduct(data)` - Create new product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product

#### Categories Management

**Features:**
- ✅ Create new categories
- ✅ Edit existing categories
- ✅ Delete categories
- ✅ Set display order
- ✅ Add icons/emojis
- ✅ Toggle active/inactive status

**Fields:**
- Name (required)
- Description
- Icon (emoji or URL)
- Display Order
- Active Status

**API Functions:**
- `getAllCategoriesAdmin()` - Get all categories
- `createCategory(data)` - Create new category
- `updateCategory(id, data)` - Update category
- `deleteCategory(id)` - Delete category

---

### 3. Orders Tab

**Order Management Interface**

**Features:**
- ✅ View all orders
- ✅ Search by order ID or user ID
- ✅ Filter by status (all, pending, completed, failed)
- ✅ View order details
- ✅ Update order status
- ✅ Refund orders
- ✅ Real-time status updates

**Order Information Displayed:**
- Order ID
- User ID
- Product Name
- Amount
- Status
- Creation Date

**Actions:**
- View Details - Opens dialog with full order information
- Change Status - Update order status (pending/completed/failed)
- Refund Order - Process refund and credit user wallet

**API Functions:**
- `getAllOrdersAdmin()` - Get all orders
- `updateOrderStatus(id, status)` - Update order status
- `refundOrder(id)` - Process refund

---

### 4. Users Tab

**User Management Interface**

**Features:**
- ✅ View all registered users
- ✅ Search by email, username, or ID
- ✅ Update user roles (user/admin)
- ✅ Manage wallet balance (add/deduct)
- ✅ View user registration date
- ✅ View current balance

**User Information Displayed:**
- Username
- User ID
- Email
- Role (user/admin)
- Wallet Balance
- Join Date

**Actions:**
- Update Role - Change user to admin or vice versa
- Update Balance - Add or deduct balance from user wallet

**API Functions:**
- `getAllUsers()` - Get all users
- `updateUserProfile(id, data)` - Update user role
- `updateUserBalance(id, amount, description)` - Update wallet balance

---

### 5. Payments Tab

**Payment Verification Interface**

**Features:**
- ✅ View all payment proofs
- ✅ Filter by status (pending/approved/rejected)
- ✅ View payment proof images
- ✅ Approve payments
- ✅ Reject payments with notes
- ✅ Add admin notes
- ✅ Track verification history

**Payment Proof Information:**
- User ID
- Amount
- Payment Method
- Status
- Submission Date
- Transaction ID
- Proof Image

**Actions:**
- View Details - Opens dialog with full payment information
- Approve - Approve payment and credit user wallet
- Reject - Reject payment with reason

**API Functions:**
- `getAllPaymentProofs()` - Get all payment proofs
- `updatePaymentProofStatus(id, status, notes)` - Approve/reject payment

**Pending Payments Badge:**
- Shows count of pending payments
- Displayed prominently in header

---

### 6. Content Tab

**Banner Management**

**Features:**
- ✅ Create promotional banners
- ✅ Edit existing banners
- ✅ Delete banners
- ✅ Upload banner images
- ✅ Set display order
- ✅ Toggle active/inactive status
- ✅ Add links to banners

**Component:** `BannerManagement.tsx` (existing)

---

### 7. Settings Tab

#### Sub-tabs:
- **Site Settings** - General site configuration
- **API Keys** - API key management
- **Providers** - Payment provider settings
- **User Levels** - User tier management
- **Custom Rates** - Custom pricing rules
- **Profit Margins** - Profit margin settings

**Components:**
- `SiteSettingsManagement.tsx`
- `ApiKeyManagement.tsx`
- `ProviderManagement.tsx`
- `UserLevelManagement.tsx`
- `CustomRateManagement.tsx`
- `ProfitMarginSettings.tsx`

---

## Technical Implementation

### File Structure

```
src/
├── pages/
│   └── AdminDashboard.tsx          # Main admin dashboard page
├── components/
│   └── admin/
│       ├── DashboardOverview.tsx   # Statistics dashboard
│       ├── ProductManagement.tsx   # Product CRUD
│       ├── CategoryManagement.tsx  # Category CRUD
│       ├── OrderManagement.tsx     # Order management
│       ├── UserManagement.tsx      # User management
│       ├── PaymentVerification.tsx # Payment verification
│       ├── StockManagement.tsx     # Stock management (existing)
│       ├── BannerManagement.tsx    # Banner management (existing)
│       ├── ApiKeyManagement.tsx    # API key management (existing)
│       └── ... (other existing components)
```

### State Management

Each component manages its own state using React hooks:
- `useState` for local state
- `useEffect` for data loading
- `useToast` for notifications
- `useAuth` for authentication

### Data Flow

```
Component → API Function → Supabase Client → Database
                ↓
            Response
                ↓
         Update State
                ↓
          Re-render UI
```

### Error Handling

All components implement comprehensive error handling:
- Try-catch blocks for async operations
- Toast notifications for user feedback
- Loading states during operations
- Validation before API calls

### Loading States

All components show loading indicators:
- Spinner during initial data load
- Disabled buttons during operations
- Loading text for user feedback

---

## API Integration

### Database Tables Used

1. **profiles** - User accounts and roles
2. **products** - Product catalog
3. **categories** - Product categories
4. **orders** - Order records
5. **order_items** - Order line items
6. **payment_requests** - Payment proofs
7. **wallet_transactions** - Wallet history
8. **stock_items** - Inventory
9. **banners** - Promotional banners
10. **api_keys** - API access keys
11. **site_settings** - System configuration

### API Functions Used

**Profile APIs:**
- `getProfile(userId)` - Get user profile
- `getAllUsers()` - Get all users
- `updateUserProfile(userId, updates)` - Update user
- `updateUserBalance(userId, amount, description)` - Update balance

**Product APIs:**
- `getAllProductsAdmin()` - Get all products
- `createProduct(data)` - Create product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product

**Category APIs:**
- `getAllCategoriesAdmin()` - Get all categories
- `createCategory(data)` - Create category
- `updateCategory(id, data)` - Update category
- `deleteCategory(id)` - Delete category

**Order APIs:**
- `getAllOrdersAdmin()` - Get all orders
- `updateOrderStatus(id, status)` - Update status
- `refundOrder(id)` - Process refund

**Payment APIs:**
- `getAllPaymentProofs()` - Get payment proofs
- `updatePaymentProofStatus(id, status, notes)` - Verify payment

---

## Security

### Access Control

**Role-Based Access:**
- Only users with `role = 'admin'` can access
- Automatic redirect for unauthorized users
- Profile check on component mount

**Implementation:**
```typescript
const checkAdminAccess = async () => {
  if (!user) {
    navigate('/login');
    return;
  }

  const profile = await getProfile(user.id);
  if (!profile || profile.role !== 'admin') {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access the admin dashboard',
      variant: 'destructive',
    });
    navigate('/');
    return;
  }
  setIsAdmin(true);
};
```

### Data Protection

- All API calls use authenticated Supabase client
- Row Level Security (RLS) enforced on database
- Admin-only operations protected by role checks
- Sensitive data masked in UI (user IDs truncated)

---

## User Interface

### Design System

**Components Used:**
- shadcn/ui components
- Tailwind CSS for styling
- Lucide React for icons
- Responsive design for all screen sizes

**Color Scheme:**
- Primary: Blue/Purple gradient
- Success: Green
- Warning: Yellow
- Error: Red
- Neutral: Gray scale

### Responsive Design

**Desktop (≥1024px):**
- Full tabbed interface
- Side-by-side layouts
- Expanded tables
- All features visible

**Tablet (768px-1023px):**
- Stacked layouts
- Scrollable tables
- Compact navigation
- Touch-friendly buttons

**Mobile (<768px):**
- Single column layout
- Hamburger menu
- Simplified tables
- Large touch targets

---

## Usage Guide

### Getting Started

1. **Login as Admin:**
   - Navigate to `/login`
   - Sign in with admin credentials
   - Automatic redirect to home page

2. **Access Dashboard:**
   - Click "Admin" in navigation menu
   - Or navigate directly to `/admin`
   - Dashboard loads with Overview tab

3. **Navigate Sections:**
   - Click tabs to switch between sections
   - Use sub-tabs for detailed management
   - Search and filter data as needed

### Common Tasks

#### Add a New Product

1. Go to Products tab
2. Click "Add Product" button
3. Fill in product details:
   - Name (required)
   - Price (required)
   - Category (required)
   - Description (optional)
   - Image URL (optional)
   - Stock Quantity (optional)
4. Toggle "Active" if ready to sell
5. Click "Create"

#### Verify a Payment

1. Go to Payments tab
2. Find pending payment
3. Click eye icon to view details
4. Review payment proof image
5. Add admin notes if needed
6. Click "Approve" or "Reject"

#### Manage User Balance

1. Go to Users tab
2. Search for user
3. Click dollar icon
4. Enter amount (positive to add, negative to deduct)
5. Click "Update Balance"

#### Process a Refund

1. Go to Orders tab
2. Find order to refund
3. Click eye icon to view details
4. Click "Refund Order"
5. Confirm refund
6. User wallet automatically credited

---

## Troubleshooting

### Common Issues

**Issue: Can't access admin dashboard**
- **Solution**: Check user role in database
- **Query**: `SELECT role FROM profiles WHERE id = 'user_id'`
- **Fix**: Update role to 'admin' if needed

**Issue: Data not loading**
- **Solution**: Check browser console for errors
- **Check**: Network tab for failed API calls
- **Verify**: Supabase connection is working

**Issue: Changes not saving**
- **Solution**: Check form validation
- **Verify**: All required fields are filled
- **Check**: Console for error messages

**Issue: Images not displaying**
- **Solution**: Verify image URL is accessible
- **Check**: URL returns valid image
- **Try**: Different image URL

---

## Performance Optimization

### Data Loading

- **Lazy Loading**: Components load data only when needed
- **Caching**: Data cached in component state
- **Pagination**: Large datasets paginated (ready for implementation)
- **Search**: Client-side search for fast filtering

### Best Practices

1. **Refresh Data**: Click refresh button after bulk operations
2. **Search First**: Use search to find specific items
3. **Filter Status**: Use status filters to reduce data load
4. **Close Dialogs**: Close dialogs after completing actions

---

## Future Enhancements

### Planned Features

- [ ] Export data to CSV/Excel
- [ ] Bulk operations (delete, update)
- [ ] Advanced filtering options
- [ ] Data visualization charts
- [ ] Activity logs and audit trail
- [ ] Email notifications
- [ ] Scheduled reports
- [ ] API rate limiting dashboard
- [ ] Real-time updates with WebSockets
- [ ] Mobile app for admin

---

## Support

### Documentation

- **API Documentation**: `/api-docs`
- **Support Page**: `/support`
- **About Page**: `/about`

### Contact

For technical support or questions:
- Create a support ticket in the Support page
- Check the API documentation for integration help
- Review this guide for usage instructions

---

## Changelog

### Version 1.0.0 (2025-12-25)

**New Features:**
- ✅ Complete admin dashboard with tabbed interface
- ✅ Dashboard overview with real-time statistics
- ✅ Product management (CRUD)
- ✅ Category management (CRUD)
- ✅ Order management with refunds
- ✅ User management with role and balance control
- ✅ Payment verification system
- ✅ Integration with existing components

**Technical:**
- ✅ Full backend-frontend integration
- ✅ TypeScript type safety
- ✅ Error handling throughout
- ✅ Loading states for all operations
- ✅ Responsive design
- ✅ Role-based access control
- ✅ All lint checks passing

---

**Last Updated**: 2025-12-25  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
