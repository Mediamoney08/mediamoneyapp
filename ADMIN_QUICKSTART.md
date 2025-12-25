# Admin Quick Start Guide

## Accessing the Admin Panel

1. **Login as Admin**:
   - Go to `/login`
   - Use your admin credentials
   - Your account must have `role = 'admin'` in the database

2. **Navigate to Admin Panel**:
   - Click on your profile icon in the header
   - Select "Admin Management" from the dropdown menu
   - Or directly visit: `/admin/manage`

## Admin Panel Overview

The admin panel has 6 main sections accessible via tabs:

### 1. Categories Tab
**Purpose**: Manage product categories (PUBG Mobile, Free Fire, Netflix, etc.)

**Actions**:
- **Add Category**: Click "Add Category" button
  - Enter name (e.g., "PUBG Mobile")
  - Select service type (game/streaming/gift_card/app)
  - Add description
  - Paste image URL (this image will be shared by all products in this category)
  - Set display order (lower numbers appear first)
  - Toggle active/inactive
  - Click "Save Category"

- **Edit Category**: Click edit icon on any category
  - Modify any field
  - Click "Save Category"

- **Delete Category**: Click delete icon
  - Confirm deletion
  - Note: This will affect all products in this category

**Important**: The category image URL will be used for all products under this category if they don't have their own image.

### 2. Products Tab
**Purpose**: Manage individual products/services

**Key Fields**:
- **Name**: Full product name (e.g., "PUBG Mobile Global 60 UC")
- **Category**: Select which category this belongs to
- **Service Name**: Variant name (e.g., "Global", "Prime", "Prime Plus")
  - This appears as a badge on the product card
  - Products with same category but different service_name are displayed together
- **Price**: Product price in USD
- **Stock Quantity**: Available inventory
- **Image URL**: Optional (uses category image if not provided)

**Example Setup**:
```
Category: PUBG Mobile (image: pubg-main.jpg)
├── Product 1: "60 UC Global" (service_name: "Global")
├── Product 2: "60 UC Prime" (service_name: "Prime")
└── Product 3: "60 UC Prime Plus" (service_name: "Prime Plus")
```

All three products will show the same PUBG Mobile category image.

### 3. Users Tab
**Purpose**: Manage user accounts

**Actions**:
- View all registered users
- Toggle user roles (admin/user)
- Adjust wallet balances
- View user order history
- Ban/unban users

**Adjusting Balance**:
1. Click on user
2. Enter amount (positive to add, negative to deduct)
3. Enter description (e.g., "Bonus credit", "Refund for issue")
4. User receives notification automatically

### 4. Orders Tab
**Purpose**: Manage customer orders

**Actions**:
- View all orders with status
- Update order status (pending/completed/cancelled)
- View order details
- Process refunds

**Refund Process**:
1. Find the order
2. Click "Refund" button
3. Confirm refund
4. System automatically:
   - Updates order status to "refunded"
   - Credits amount back to user's wallet
   - Sends notification to user

### 5. Payments Tab
**Purpose**: Review and approve payment proofs

**Workflow**:
1. User submits payment proof with:
   - Payment method
   - Amount
   - Transaction ID
   - Screenshot/proof image
   
2. Admin reviews:
   - Click on pending payment
   - View payment details and proof image
   - Add admin notes (optional)
   - Click "Approve" or "Reject"

3. On approval:
   - User wallet is credited automatically
   - User receives notification
   - Payment proof status updated

4. On rejection:
   - User receives notification with reason
   - No wallet credit

### 6. Methods Tab
**Purpose**: Manage available payment methods

**Actions**:
- Add new payment methods (Bank Transfer, PayPal, Crypto, etc.)
- Edit existing methods
- Set instructions for users
- Add account details
- Toggle active/inactive
- Set display order

**Example Payment Method**:
```
Name: Bank Transfer
Description: Direct bank transfer
Instructions: "Please transfer to the account below and upload proof"
Account Details: "Bank: ABC Bank, Account: 123456789, Name: Recharge Hub"
Active: Yes
Display Order: 1
```

## Common Admin Tasks

### Task 1: Add a New Game Category
1. Go to Categories tab
2. Click "Add Category"
3. Fill in:
   - Name: "Mobile Legends"
   - Service Type: game
   - Description: "Mobile Legends top-up"
   - Image URL: [paste image URL]
   - Display Order: 10
   - Active: ✓
4. Click "Save Category"

### Task 2: Add Products for the New Category
1. Go to Products tab
2. Click "Add Product" (when UI is expanded)
3. For each variant:
   - Name: "Mobile Legends 100 Diamonds Global"
   - Category: Select "Mobile Legends"
   - Service Name: "Global"
   - Price: 2.99
   - Stock: 100
   - Active: ✓
4. Repeat for other variants (Prime, Premium, etc.)

### Task 3: Approve a Payment
1. Go to Payments tab
2. Find pending payment
3. Click to view details
4. Verify payment proof image
5. Add notes if needed
6. Click "Approve"
7. User wallet is credited automatically

### Task 4: Refund an Order
1. Go to Orders tab
2. Find the order
3. Click "Refund" button
4. Confirm
5. System handles the rest

### Task 5: Give User Bonus Credit
1. Go to Users tab
2. Find the user
3. Click "Adjust Balance"
4. Enter positive amount (e.g., 10)
5. Description: "Welcome bonus"
6. Click "Update"
7. User receives notification

## Important Notes

### Category Images
- Each category should have ONE main image
- All products under that category will use this image
- This creates a unified look (like play4cards.com)
- Products can optionally have their own images

### Service Names
- Use consistent service names across products
- Common examples: "Global", "Prime", "Premium", "Basic", "Standard"
- Service name appears as a badge on product cards
- Helps users distinguish between variants

### Stock Management
- Monitor stock quantities regularly
- Products with 0 stock can still be displayed but not purchased
- Consider setting up low stock alerts

### User Roles
- Only users with role='admin' can access admin panel
- Be careful when toggling user roles
- Don't accidentally remove your own admin role

### Payment Proofs
- Always verify payment proof images before approving
- Check transaction IDs match
- Add notes for record keeping
- Rejected proofs should include clear reason

## Security Best Practices

1. **Protect Admin Credentials**:
   - Use strong passwords
   - Don't share admin accounts
   - Change passwords regularly

2. **Verify Before Approving**:
   - Always check payment proofs carefully
   - Verify transaction IDs
   - Watch for duplicate submissions

3. **Monitor User Activity**:
   - Review orders regularly
   - Check for suspicious patterns
   - Monitor wallet transactions

4. **Backup Data**:
   - Regularly export important data
   - Keep records of major transactions
   - Document policy changes

## Troubleshooting

### Can't Access Admin Panel
- Check if your user role is 'admin' in database
- Try logging out and back in
- Clear browser cache

### Changes Not Showing
- Refresh the page
- Check if item is set to "active"
- Verify display order

### Payment Approval Not Working
- Check user exists
- Verify payment proof status is "pending"
- Check for error messages in console

### Images Not Displaying
- Verify image URL is correct and accessible
- Check image format (jpg, png, webp)
- Ensure URL starts with http:// or https://

## Support

For technical issues or questions:
- Check console for error messages
- Review database logs
- Contact development team

## Quick Reference

### Admin Routes
- Payment Approvals: `/admin`
- Full Management: `/admin/manage`

### Database Tables
- `categories` - Product categories
- `products` - Individual products
- `profiles` - User accounts
- `orders` - Customer orders
- `payment_proofs` - Payment submissions
- `payment_methods` - Available payment options
- `admin_settings` - Site configuration

### Key Concepts
- **Category**: Group of related products (e.g., PUBG Mobile)
- **Service Name**: Product variant (e.g., Global, Prime)
- **Payment Proof**: User-submitted payment evidence
- **Wallet**: User's account balance
- **Stock**: Available inventory quantity

---

**Last Updated**: 2025-12-25
**Version**: 1.0
