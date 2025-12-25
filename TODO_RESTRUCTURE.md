# Task: Restructure Recharge Hub with Categories and Manual Payment System

## Plan
- [x] Step 1: Database Schema Updates
  - [x] Create categories table
  - [x] Create subcategories table
  - [x] Update products table with category/subcategory links
  - [x] Create payment_methods table
  - [x] Create payment_proofs table (for manual verification)
  - [x] Update RLS policies
  
- [x] Step 2: Payment Methods System
  - [x] Add 18 payment methods to database
  - [x] Create payment proof upload functionality
  - [x] Create admin payment verification page
  
- [x] Step 3: Category/Subcategory Navigation
  - [x] Update HomePage with category navigation
  - [x] Implement category sidebar
  - [x] Implement subcategory filtering
  - [x] Update product display with category hierarchy
  
- [x] Step 4: Update Purchase Flow
  - [x] Remove Stripe direct payment from checkout
  - [x] Update checkout to only use wallet balance
  - [x] Add insufficient balance handling
  
- [x] Step 5: Update Add Balance Page
  - [x] Add payment method selection (18 methods)
  - [x] Add payment proof upload
  - [x] Add transaction details form
  - [x] Create pending payment status
  - [x] Display payment history
  
- [x] Step 6: Admin Panel
  - [x] Create admin dashboard
  - [x] Create payment verification interface
  - [x] Add approve/reject payment functionality
  - [x] Add admin link to header
  
- [x] Step 7: Testing & Validation
  - [x] Test category navigation
  - [x] Test payment proof upload
  - [x] Test wallet-only purchases
  - [x] Run lint checks

## Completed Features
- ✅ 42 categories across 4 service types (20 games, 10 streaming, 8 gift cards, 4 apps)
- ✅ Subcategories for major categories (PUBG, Free Fire, Netflix)
- ✅ 18 payment methods (Bank Transfer, PayPal, Wise, Western Union, MoneyGram, Skrill, Neteller, Perfect Money, Payoneer, Bitcoin, Ethereum, USDT, Vodafone Cash, Orange Money, MTN Mobile Money, Cash App, Venmo, Zelle)
- ✅ Payment proof upload with image storage
- ✅ Manual payment verification by admin
- ✅ Wallet-only purchases
- ✅ Admin dashboard for payment management
- ✅ Category/subcategory navigation on homepage
- ✅ All lint checks passing

## Notes
- Similar structure to play4cards.com implemented
- Manual payment verification by admin working
- Wallet-only purchases for products enforced
- Category → Subcategory → Products hierarchy complete
- Storage bucket created for payment proof images
- All existing products linked to categories
