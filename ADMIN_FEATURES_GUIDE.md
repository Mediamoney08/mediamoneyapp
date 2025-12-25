# New Features Guide - Admin Documentation

## Overview
This guide explains the new features added to the MediaMoney platform, including dynamic product fields, customizable logo, and banner carousel management.

---

## 1. Dynamic Product Fields

### What is it?
Admin can now add unlimited custom fields to any product. These fields appear on product cards and can contain any information like:
- Player ID requirements
- Region availability
- Platform compatibility
- Delivery time
- Special instructions

### How to use:

1. **Access the Feature**
   - Go to Admin Panel
   - Click on the "Fields" tab

2. **Select a Product**
   - Choose a product from the dropdown menu
   - All existing custom fields for that product will be displayed

3. **Add a New Field**
   - Click "Add Field" button
   - Enter Field Name (e.g., "Player ID", "Region", "Platform")
   - Enter Field Value (e.g., "Required", "Global", "PC/Mobile")
   - Set Display Order (lower numbers appear first)
   - Click "Add Field" to save

4. **Edit a Field**
   - Click the edit icon (pencil) next to any field
   - Modify the name, value, or order
   - Click "Update Field" to save changes

5. **Delete a Field**
   - Click the delete icon (trash) next to any field
   - Confirm the deletion

### Example Use Cases:
- **Game Top-up**: Add fields for "Player ID: Required", "Server: Asia/EU/NA", "Delivery: Instant"
- **Streaming Service**: Add fields for "Region: Worldwide", "Duration: 1 Month", "Devices: 4 Screens"
- **Gift Card**: Add fields for "Denomination: $50", "Region: US Only", "Expiry: No Expiration"

---

## 2. Dynamic Logo Management

### What is it?
You can now customize the site logo and choose between image, GIF, or video formats.

### How to use:

1. **Access the Feature**
   - Go to Admin Panel
   - Click on the "Site" tab
   - Find the "Site Logo" section

2. **Configure Logo**
   - **Logo Type**: Select "Image/GIF" or "Video"
   - **Logo URL**: Enter the full URL of your logo file
     - For images: `https://example.com/logo.png`
     - For GIFs: `https://example.com/logo.gif`
     - For videos: `https://example.com/logo.mp4`

3. **Preview**
   - The logo preview will appear below the URL field
   - Check that it displays correctly

4. **Save**
   - Click "Save Logo Settings" to apply changes
   - The new logo will appear on the homepage immediately

### Tips:
- **Image/GIF**: Best for static or simple animated logos (recommended size: 200x80px)
- **Video**: Best for dynamic branding (recommended: short loop, 3-5 seconds, muted)
- Use high-quality images with transparent backgrounds (PNG format)
- Keep file sizes small for faster loading

---

## 3. Banner Carousel & Ads Management

### What is it?
A rotating banner carousel that displays promotional ads, announcements, or special offers on the homepage. The static tagline has been replaced with this dynamic banner system.

### How to use:

1. **Access the Feature**
   - Go to Admin Panel
   - Click on the "Site" tab
   - Find the "Banner Carousel" section

2. **Add a New Banner**
   - Click "Add Banner" button
   - Fill in the form:
     - **Title**: Banner name (for internal reference)
     - **Media URL**: Full URL to the banner image or GIF
       - Example: `https://example.com/promo-banner.jpg`
     - **Media Type**: Select "Image" or "GIF"
     - **Link URL** (Optional): Where users go when clicking the banner
       - Example: `https://example.com/special-offer`
     - **Display Order**: Set the sequence (lower numbers appear first)
     - **Active**: Toggle on to show, off to hide
   - Click "Create Banner" to save

3. **Edit a Banner**
   - Click the edit icon (pencil) next to any banner
   - Modify any field
   - Click "Update Banner" to save

4. **Activate/Deactivate**
   - Click "Activate" or "Deactivate" button to toggle visibility
   - Inactive banners won't appear in the carousel

5. **Delete a Banner**
   - Click the delete icon (trash) next to any banner
   - Confirm the deletion

### Banner Behavior:
- **Auto-scroll**: Banners automatically rotate every 5 seconds
- **Manual Navigation**: Users can click left/right arrows to browse
- **Dots Indicator**: Shows current banner position
- **Clickable**: If a link URL is provided, clicking the banner opens that link
- **Responsive**: Adapts to mobile and desktop screens

### Best Practices:
- **Image Size**: Recommended 1200x200px for desktop, will auto-scale for mobile
- **File Format**: Use JPG for photos, PNG for graphics with transparency, GIF for animations
- **Content**: Keep text minimal and readable
- **Quantity**: 3-5 banners work best for rotation
- **Order**: Set display_order to control sequence (0, 1, 2, 3...)

### Example Banners:
1. **Seasonal Sale**: "Summer Sale - 20% Off All Games" → Links to sale page
2. **New Service**: "Now Available: Netflix Premium Subscriptions" → Links to Netflix category
3. **Announcement**: "Free Shipping on Orders Over $50" → No link needed
4. **Partnership**: "Official Partner of Epic Games" → Links to partnership page

---

## 4. Updated Search Bar

### What changed?
The search bar is now 2x smaller to save space and provide a cleaner interface:
- Reduced width from max-width-2xl to max-width-xl
- Reduced height from 12 to 10
- Smaller icon and text size
- More compact user level badge

### No action required
This is a visual improvement that doesn't require any configuration.

---

## Quick Start Checklist

### Initial Setup:
- [ ] Upload and configure site logo in "Site" tab
- [ ] Create 3-5 promotional banners for the carousel
- [ ] Add custom fields to your top products
- [ ] Test the homepage to see all changes

### Regular Maintenance:
- [ ] Update banners monthly for seasonal promotions
- [ ] Add custom fields when launching new products
- [ ] Deactivate outdated banners instead of deleting (for records)
- [ ] Monitor banner click-through rates (if analytics enabled)

---

## Troubleshooting

### Logo not displaying?
- Check that the URL is correct and publicly accessible
- Verify the file format matches the selected type
- Try a different image hosting service
- Clear browser cache and refresh

### Banner not showing?
- Ensure "Active" is toggled ON
- Check that the media URL is valid
- Verify at least one banner is active
- Check display order is set correctly

### Product fields not appearing?
- Confirm fields are saved for the correct product
- Check that the product has stock and is active
- Verify field_order is set (0 or higher)
- Refresh the product page

---

## Support

For technical issues or questions:
1. Check this documentation first
2. Review the TODO_NEW_FEATURES.md file for technical details
3. Contact the development team with specific error messages

---

**Last Updated**: 2025-12-25
**Version**: 1.0
