# Notification System & Banner Management Guide

## Overview
The Recharge Hub now includes a comprehensive notification system and top banner management for announcements and promotions.

## Features

### 1. Notification System

#### For Users:
- **Notification Bell**: Located in the header (top-right), shows unread count
- **Notification Panel**: Click the bell icon to view all notifications
- **Auto-refresh**: Checks for new notifications every 30 seconds
- **Actions**: Mark as read, delete individual notifications, or mark all as read

#### Notification Types:
- **Order Completed**: When an order is successfully completed
- **Order Canceled**: When an order is canceled
- **Order Refunded**: When an order is refunded
- **Wallet Credited**: When funds are added to wallet
- **Wallet Debited**: When funds are deducted from wallet
- **Payment Approved**: When payment proof is approved
- **Payment Rejected**: When payment proof is rejected
- **API Key Changed**: When API key is modified
- **System Announcement**: General system announcements

#### Automatic Triggers:
Notifications are automatically created when:
- Order status changes (completed, canceled, refunded)
- Payment proof status changes (approved, rejected)
- Wallet balance is updated
- API key is changed

### 2. Top Banner System

#### For Visitors:
- **Location**: Top of every page, above the header
- **Features**:
  - Auto-rotates every 5 seconds (if multiple banners)
  - Navigation arrows for manual control
  - Dots indicator showing current banner
  - Close button (stays closed for the session)
  - Clickable links (if configured)
  - Custom colors and images

#### For Admins:
Access banner management via: **Admin Panel → Banners Tab**

**Banner Management Features:**
- Create new banners
- Edit existing banners
- Delete banners
- Toggle active/inactive status
- Set display order
- Preview colors

**Banner Configuration:**
- **Title**: Internal reference name
- **Content**: The text displayed to users
- **Image URL**: Optional icon/image (32x32px recommended)
- **Link URL**: Optional clickable link
- **Background Color**: Banner background color (hex code)
- **Text Color**: Text color (hex code)
- **Display Order**: Order in rotation (lower numbers first)
- **Active Status**: Enable/disable banner

## Admin Instructions

### Managing Banners

1. **Access Admin Panel**:
   - Navigate to `/admin`
   - Click on "Banners" tab

2. **Create a Banner**:
   - Click "Add Banner" button
   - Fill in the form:
     - Title: e.g., "Welcome Banner"
     - Content: e.g., "Welcome to Recharge Hub! Get 10% off your first order"
     - Image URL: (optional) e.g., "https://example.com/icon.png"
     - Link URL: (optional) e.g., "/products"
     - Background Color: Use color picker or enter hex code
     - Text Color: Use color picker or enter hex code
     - Display Order: 0 for first, 1 for second, etc.
     - Active: Check to enable immediately
   - Click "Create Banner"

3. **Edit a Banner**:
   - Click the edit icon (pencil) next to the banner
   - Modify fields as needed
   - Click "Update Banner"

4. **Toggle Banner Status**:
   - Click the eye icon to activate/deactivate
   - Active banners show "Active" with eye icon
   - Inactive banners show "Inactive" with eye-off icon

5. **Delete a Banner**:
   - Click the trash icon
   - Confirm deletion

### Best Practices

#### Banners:
- Keep content concise (under 100 characters)
- Use high-contrast colors for readability
- Test colors in both light and dark modes
- Use display order to prioritize important messages
- Limit active banners to 3-5 for best user experience
- Update regularly to keep content fresh

#### Notifications:
- Notifications are created automatically by the system
- Monitor user feedback on notification frequency
- Database triggers ensure consistent notification delivery
- Users can manage their own notification preferences

## Technical Details

### Database Tables:
- **notifications**: Stores user notifications
- **banners**: Stores banner configurations

### Database Triggers:
- `notify_order_status_change`: Creates notifications on order status changes
- `notify_payment_proof_status`: Creates notifications on payment proof status changes

### Components:
- `NotificationBell`: Header notification icon with badge
- `NotificationList`: Notification list display
- `TopBanner`: Top banner carousel
- `BannerManagement`: Admin banner management interface

### API Functions:
- Notification CRUD operations
- Banner CRUD operations
- Mark as read functionality
- Unread count tracking

## Troubleshooting

### Notifications not appearing:
1. Check if user is logged in
2. Verify database triggers are active
3. Check browser console for errors
4. Ensure notifications table has proper RLS policies

### Banners not showing:
1. Verify banner is marked as "Active"
2. Check if banner was closed (stored in session storage)
3. Refresh the page
4. Check browser console for errors

### Colors not displaying correctly:
1. Ensure hex codes are valid (e.g., #3b82f6)
2. Test in both light and dark modes
3. Use color picker for accurate selection

## Support

For technical issues or questions, please contact the development team or create a support ticket.
