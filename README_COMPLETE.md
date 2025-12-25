# Recharge Hub - Complete Setup Guide

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev
```

## 📋 Overview

Recharge Hub is a comprehensive digital recharge services platform similar to play4cards.com, offering:
- Game top-ups (PUBG, Free Fire, Mobile Legends, etc.)
- Streaming subscriptions (Netflix, Shahid, Disney+, etc.)
- Gift cards (iTunes, Google Play, PlayStation, Xbox, Steam, etc.)
- App subscriptions

## 🎯 Key Features

### 1. Category & Subcategory System
- **42 Categories** across 4 service types:
  - 20 Game categories (PUBG Mobile, Free Fire, Mobile Legends, COD Mobile, Genshin Impact, Roblox, Fortnite, Valorant, League of Legends, Clash of Clans, etc.)
  - 10 Streaming categories (Netflix, Shahid VIP, Disney+, HBO Max, Amazon Prime Video, Apple TV+, YouTube Premium, Spotify, OSN, Starzplay)
  - 8 Gift Card categories (iTunes, Google Play, PlayStation, Xbox, Steam, Amazon, Razer Gold, Nintendo eShop)
  - 4 App categories (Social Media, Productivity, Entertainment, Education)

- **Subcategories** for detailed organization:
  - PUBG Mobile: UC Top-up, Royal Pass, Bundles
  - Free Fire: Diamonds, Elite Pass, Bundles
  - Netflix: Basic Plan, Standard Plan, Premium Plan

### 2. Manual Payment System (18 Payment Methods)
Instead of direct Stripe payments, users submit payment proofs for manual verification:

**Payment Methods Available:**
1. Bank Transfer
2. PayPal
3. Wise (TransferWise)
4. Western Union
5. MoneyGram
6. Skrill
7. Neteller
8. Perfect Money
9. Payoneer
10. Cryptocurrency (Bitcoin)
11. Cryptocurrency (Ethereum)
12. Cryptocurrency (USDT)
13. Vodafone Cash
14. Orange Money
15. MTN Mobile Money
16. Cash App
17. Venmo
18. Zelle

**Payment Proof Workflow:**
1. User selects payment method
2. User completes payment externally
3. User uploads payment proof (screenshot/receipt)
4. User enters transaction ID and details
5. Admin reviews and approves/rejects
6. Upon approval, balance is added to user's wallet

### 3. Wallet-Only Purchases
- All product purchases MUST be made using wallet balance
- No direct card payment for products
- Users must add funds to wallet first
- Instant order fulfillment when sufficient balance

### 4. Admin Dashboard
- Review pending payment proofs
- Approve or reject payments with notes
- View payment history (pending, approved, rejected)
- Automatic wallet balance update on approval
- User notification on payment status change

## 🗄️ Database Structure

### New Tables

#### `categories`
- Organizes products by service type
- Fields: name, service_type, description, image_url, icon, display_order, is_active

#### `subcategories`
- Sub-organization within categories
- Fields: category_id, name, description, image_url, display_order, is_active

#### `payment_methods`
- Available payment options
- Fields: name, description, icon_url, instructions, account_details, is_active, display_order

#### `payment_proofs`
- User-submitted payment evidence
- Fields: user_id, payment_method_id, amount, currency, transaction_id, transaction_details, proof_image_url, status, admin_notes, reviewed_by, reviewed_at

#### Updated `products` Table
- Added: category_id, subcategory_id
- Links products to category hierarchy

### Storage Bucket
- **Bucket Name:** `app-8herke1wtngh_payment_proofs`
- **Purpose:** Store payment proof images
- **Access:** Users can upload their own, admins can view all
- **File Limit:** 1MB per image

## 🔐 User Roles & Permissions

### Regular Users
- Browse categories and products
- Submit payment proofs
- View own payment history
- Purchase with wallet balance
- View own orders and transactions

### Admin Users
- All regular user permissions
- Access admin dashboard (/admin)
- Review and approve/reject payment proofs
- View all user payment submissions
- Manage user balances

**First registered user automatically becomes admin!**

## 📱 Pages

### Public Pages
- **Home (/)** - Category navigation, product browsing
- **About (/about)** - Company information
- **API Docs (/api-docs)** - API documentation
- **Login (/login)** - User authentication

### User Pages (Requires Login)
- **Checkout (/checkout)** - Wallet-only purchase flow
- **Wallet (/wallet)** - Balance and transaction history
- **Add Balance (/add-balance)** - Payment proof submission
- **My Orders (/orders)** - Order history
- **Notifications (/notifications)** - System notifications
- **Security (/security)** - Account settings
- **Support (/support)** - Ticket system

### Admin Pages (Requires Admin Role)
- **Admin Dashboard (/admin)** - Payment proof management

## 🎨 UI/UX Features

### Category Navigation
- Service type tabs (Games, Streaming, Gift Cards, Apps)
- Category sidebar with 40+ categories
- Subcategory filtering
- Real-time product filtering
- Search functionality

### Payment Proof Upload
- Drag-and-drop image upload
- Image preview before submission
- Transaction ID and details fields
- Payment method selection
- Real-time status tracking

### Checkout Experience
- Wallet balance display
- Insufficient balance warning
- Quick "Add Balance" redirect
- Player ID input for games
- Instant order completion

## 🔧 Technical Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI Library:** shadcn/ui + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Storage:** Supabase Storage
- **Authentication:** Supabase Auth
- **State Management:** React Context + Hooks

## 📊 Database API Functions

### Categories
- `getCategories(serviceType?)` - Get all categories
- `getCategory(id)` - Get single category
- `getSubcategories(categoryId)` - Get subcategories
- `getProductsByCategory(categoryId)` - Get products in category
- `getProductsBySubcategory(subcategoryId)` - Get products in subcategory

### Payment Methods
- `getPaymentMethods()` - Get all active payment methods

### Payment Proofs
- `createPaymentProof(proof)` - Submit payment proof
- `getPaymentProofs(userId)` - Get user's payment proofs
- `getAllPaymentProofs()` - Get all proofs (admin)
- `updatePaymentProofStatus(proofId, status, notes)` - Approve/reject (admin)

### Wallet
- `purchaseWithWallet(productId, quantity, playerId)` - Buy with wallet
- `addWalletTransaction(userId, amount, type, description)` - Add transaction

## 🚦 Getting Started

### 1. First Time Setup
```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev
```

### 2. Create Admin Account
1. Register a new account (first user becomes admin)
2. Login with your credentials
3. Access admin dashboard from user menu

### 3. Test Payment Flow
1. Go to "Add Balance"
2. Select a payment method
3. Enter amount and transaction details
4. Upload a payment proof image
5. Submit for review
6. As admin, go to /admin to approve
7. Check wallet balance update

### 4. Test Purchase Flow
1. Browse categories on homepage
2. Select a product
3. Click "Buy Now"
4. Enter quantity and player ID (if applicable)
5. Complete purchase with wallet balance
6. Check order in "My Orders"

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- User-specific data access
- Admin-only payment verification
- Secure file upload with size limits
- Encrypted password storage
- Protected API endpoints

## 📈 Admin Workflow

### Reviewing Payment Proofs
1. Access admin dashboard (/admin)
2. View pending payments count
3. Click "Review" on any payment
4. View payment details and proof image
5. Add admin notes (optional)
6. Click "Approve" or "Reject"
7. User receives notification
8. If approved, balance added automatically

### Payment Proof Details Shown
- Amount and currency
- Payment method used
- Transaction ID
- Transaction details
- Proof image
- Submission date
- User information

## 🎯 Key Differences from Original

### Before (Stripe Direct Payment)
- Users paid directly with credit card
- Instant payment processing
- Automatic balance update
- No manual verification

### After (Manual Payment Proof)
- Users pay via 18 different methods
- Manual admin verification required
- Payment proof upload mandatory
- Admin approves before balance update
- More payment flexibility
- Better for international users

## 📝 Important Notes

1. **Payment Proof Images**
   - Maximum size: 1MB
   - Accepted formats: PNG, JPG, JPEG
   - Stored in Supabase Storage
   - Accessible to user and admins only

2. **Wallet Balance**
   - All purchases require sufficient wallet balance
   - No direct card payment for products
   - Balance updates only after admin approval

3. **Category System**
   - Products must be linked to categories
   - Subcategories are optional
   - Categories can be filtered by service type

4. **Admin Access**
   - First registered user = admin
   - Admin link appears in user menu
   - Only admins can access /admin route

## 🐛 Troubleshooting

### Payment Proof Upload Fails
- Check file size (must be < 1MB)
- Ensure file is an image (PNG/JPG)
- Verify user is logged in

### Cannot Purchase Product
- Check wallet balance
- Ensure product has stock
- Verify user is logged in

### Admin Dashboard Not Accessible
- Verify user has admin role
- Check if first registered user
- Try logging out and back in

## 🔄 Future Enhancements

- Multi-language support
- Multi-currency support
- Automatic payment verification (for some methods)
- Category management UI for admins
- Product management UI for admins
- Bulk payment approval
- Payment analytics dashboard

## 📞 Support

For issues or questions:
1. Check the Support page (/support)
2. Submit a ticket
3. Contact admin

---

**Version:** 2.0.0  
**Last Updated:** 2025-12-25  
**License:** MIT
