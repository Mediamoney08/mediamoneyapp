# Recharge Services Website Requirements Document

## 1. Website Overview

### 1.1 Website Name
Recharge Hub

### 1.2 Website Description
A comprehensive online platform for digital recharge services, offering game top-ups, app subscriptions, streaming service subscriptions (Netflix, Shahid, etc.), and gift cards. Users can recharge through player IDs and manage transactions via personal wallets.

### 1.3 Reference Website
play4cards.com

### 1.4 Reference Images
- Screenshot2025-12-25 195356.png: Category layout reference
- Screenshot 2025-12-25 195350.png: Service card design reference
- Screenshot 2025-12-25 195327.png: Main category structure reference

## 2. Core Features

### 2.1 Service Categories Structure
- **Unified Service Grouping**: All services with the same name are grouped into one category, allowing customers to choose from available options within that category\n- **Category Main Image**: Each category displays a unified main image representing all services within that category
- **Game Recharge**\n  - 50+ game categories (e.g., Action Games, RPG Games, Battle Royale, etc.)
  - Each category contains multiple service options with the same game name
  - Some categories include subcategories with their own services
  - Recharge via player ID\n\n- **App Recharge**
  - Multiple app categories\n  - Each category contains service options grouped by app name
  - Some categories include subcategories\n  - Recharge via player ID

- **Streaming Subscriptions**
  - Multiple streaming platform categories (Netflix, Shahid, etc.)
  - Each category contains subscription service options
  - Some categories include subcategories (e.g., plan types, regions)
\n- **Gift Cards**
  - Multiple gift card categories
  - Each category contains card service options
  - Some categories include subcategories (e.g., denominations, regions)

### 2.2 User System
- User registration and login\n- Personal wallet system\n- Balance top-up functionality
- Order history tracking
- Security settings\n- **Wallet-only purchase requirement: All purchases must be made using wallet balance**

### 2.3 Transaction Features
- Automatic order fulfillment from stock inventory
- Real-time stock management
- Multi-currency support
- **Wallet-based payment processing only**

### 2.4 Notification System
- Order completion alerts
- Order failure notifications
- Service price updates
- Site news and announcements
- Push notifications\n
### 2.5 Support System
- Ticket support for customer inquiries
\n### 2.6 API System
- GET and POST API endpoints for integration
\n### 2.7 Interface Features
- Dark mode and light mode toggle
- Multi-language support
- Slide bar navigation
- Navigation bar\n- Header section
- Attractive animations

### 2.8 Admin Management System
- **Admin Login Page**: Dedicated secure login page exclusively for administrators
- **Full Site Management**: Complete control over all website aspects
- **Content Management**: Edit any content, categories, services, and pages
- **Order Management**: View, process, update, and manage all customer orders
- **User Management**: Manage user accounts, permissions, wallet balances, and activity\n- **Service Management**: Add, edit, delete services and categories; update pricing and availability
- **Stock Inventory Control**: Manage gift card stock, track inventory levels, add new stock
- **Payment Verification**: Review and approve/reject balance top-up requests with payment proofs
- **Category & Image Management**: Upload and assign main images for each category; organize service groupings
- **Notification Management**: Send announcements, alerts, and updates to users
- **Analytics Dashboard**: View site statistics, revenue reports, popular services, and user activity
- **API Management**: Configure API settings and monitor API usage
- **Support Ticket Management**: View and respond to customer support tickets
- **Settings Control**: Configure site settings, payment methods, currencies, and languages

## 3. Website Pages

### 3.1 Customer-Facing Pages
1. **Home** - Main landing page with service categories
2. **Wallet** - User wallet management and balance display
3. **Add Balance** - Wallet recharge page with multiple payment methods
4. **My Orders** - Order history and status tracking
5. **Security** - Account security settings\n6. **API** - API documentation and access
7. **About Us** - Company information and contact details
8. **Service Category Pages** - Dedicated pages for each main service type (Games, Apps, Streaming, Gift Cards) with category/subcategory navigation and unified category images

### 3.2 Admin-Only Pages
1. **Admin Login** - Secure authentication page for administrators only
2. **Admin Dashboard** - Overview of site statistics and quick access to management tools
3. **Order Management** - Interface for managing all customer orders
4. **User Management** - Interface for managing user accounts and permissions
5. **Service Management** - Interface for managing services, categories, and pricing
6. **Stock Management** - Interface for inventory control\n7. **Payment Verification** - Interface for reviewing balance top-up requests
8. **Category Management** - Interface for organizing services and uploading category main images
9. **Support Management** - Interface for handling customer tickets
10. **Site Settings** - Interface for configuring all site parameters

## 4. Add Balance Payment System

### 4.1 Payment Methods
- Support for 15+ payment methods including:
  - Credit/Debit Cards\n  - PayPal
  - Bank Transfer
  - Mobile Wallets\n  - Cryptocurrency
  - Local payment gateways
  - Other regional payment options

### 4.2 Payment Submission Process
For each balance top-up request, customers must:
1. Select preferred payment method from available options
2. Upload payment proof photo\n3. Enter transaction details\n4. Provide transaction ID\n5. Submit for verification

### 4.3 Payment Verification
- Admin review of submitted payment proofs through admin panel
- Balance credited after verification
- Notification sent upon approval or rejection
\n## 5. Technical Requirements

### 5.1 Backend & Database
- Database system for user data, orders, inventory, transactions, payment submissions, and admin accounts
- Backend server for business logic and API handling
- Category and subcategory management system with image storage
- Payment proof storage and verification workflow
- Admin authentication and authorization system
- Role-based access control for admin functions

### 5.2 Stock Inventory System
- Automated gift card delivery from stock upon purchase
- Real-time inventory tracking and management
- Stock management across categories and subcategories
- Admin interface for stock updates and monitoring

### 5.3 Category Management
- Hierarchical category structure (Category → Subcategory → Service)
- Unified service grouping by name within categories
- Dynamic category display based on service type
- Category filtering and search functionality
- Main image assignment for each category
- Admin tools for category organization and image uploads

### 5.4 Currency & Language\n- Multi-currency payment support
- Multi-language interface options
\n### 5.5 Admin System Security
- Secure admin login with encryption
- Session management and timeout controls
- Activity logging for admin actions
- Two-factor authentication option for admin accounts
\n## 6. Design Style\n
### 6.1 Visual Design
- Card-based layout for categories with unified main images representing each service group
- Vibrant blue and purple gradient accents on clean backgrounds
- Smooth animations for category navigation and transitions
- Professional admin panel interface with clear data visualization
\n### 6.2 Interactive Elements
- Expandable category menus with service option selection
- Hover effects on service cards\n- Animated payment method selection interface
- Image upload preview for payment proofs
- Drag-and-drop functionality in admin panel for category management
- Real-time data updates in admin dashboard

### 6.3 Theme Options
- Light mode: White background with soft shadows and colorful category cards with main images
- Dark mode: Deep dark background with neon highlights and glowing category borders
- Admin panel: Clean, data-focused interface with customizable dashboard widgets