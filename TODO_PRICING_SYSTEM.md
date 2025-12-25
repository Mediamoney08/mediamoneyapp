# Task: Advanced Pricing & User Level System

## Plan

- [x] Step 1: Database Schema Design
  - [x] Create providers table (API provider info)
  - [x] Create provider_products table (imported products)
  - [x] Create user_levels table (Bronze, Silver, Gold, etc.)
  - [x] Create custom_rates table (user-specific pricing)
  - [x] Update products table (add provider fields, base_price, profit_margin)
  - [x] Update profiles table (add user_level_id)

- [x] Step 2: Backend API Functions
  - [x] Add provider management functions (CRUD)
  - [x] Add user level management functions (CRUD)
  - [x] Add custom rate management functions (CRUD)
  - [x] Add price calculation function (base + margin - discount)
  - [x] Add product import from provider API

- [x] Step 3: Admin UI - Provider Management
  - [x] Create ProviderManagement component
  - [x] Add provider list view
  - [x] Add provider create/edit form
  - [x] Add API connection test
  - [x] Add product import interface

- [x] Step 4: Admin UI - Profit Margin Settings
  - [x] Add global profit margin setting
  - [x] Add per-product profit margin override
  - [x] Show calculated prices preview

- [x] Step 5: Admin UI - User Level System
  - [x] Create UserLevelManagement component
  - [x] Add level list view (Bronze, Silver, Gold, etc.)
  - [x] Add level create/edit form with discount percentage
  - [x] Add user level assignment interface

- [x] Step 6: Admin UI - Custom Rates
  - [x] Create CustomRateManagement component
  - [x] Add custom rate list view
  - [x] Add custom rate create/edit form
  - [x] Show price comparison (normal vs custom)

- [x] Step 7: Price Display Updates
  - [x] Update product display to show user-specific prices
  - [x] Show discount badges for user levels
  - [x] Show savings amount

- [x] Step 8: Invoice Generation
  - [x] Create invoice template component
  - [x] Add "Generate Invoice" button to orders
  - [x] Implement PDF generation
  - [x] Add invoice download functionality

- [x] Step 9: Integration & Testing
  - [x] Database functions tested and working
  - [x] Admin UI components integrated
  - [x] Price calculations verified
  - [x] User level discounts implemented
  - [x] Custom rates functional
  - [x] Invoice generation working
  - [x] All TypeScript errors fixed
  - [x] Lint checks passing

- [x] Step 10: Admin Panel Updates
  - [x] Add Providers tab
  - [x] Add User Levels tab
  - [x] Add Custom Rates tab
  - [x] Add Profit Margins tab
  - [x] Update AdminManagementPage with new tabs

## Notes
- Pricing hierarchy: Custom Rate > User Level Discount > Base Price + Profit Margin
- Provider API should support standard format or be configurable
- Invoices should include company info, order details, and payment info
- User levels can have multiple benefits (discount, priority support, etc.)
- Invoice component supports multiple items per order
- Invoice can be printed or downloaded as PDF

## Completed Features
✅ Database schema with 4 new tables (providers, provider_products, user_levels, custom_rates)
✅ Database functions (get_price_details, calculate_user_price, auto_upgrade_user_level, update_user_spending)
✅ 30+ API functions for CRUD operations
✅ 4 admin UI components (ProviderManagement, ProfitMarginSettings, UserLevelManagement, CustomRateManagement)
✅ Admin panel integration with 4 new tabs
✅ User-specific pricing display on HomePage
✅ Discount badges and savings display
✅ User level badge display
✅ Invoice generation with print/download
✅ All TypeScript types properly defined
✅ All lint checks passing (101 files, 0 errors)

## System Ready For
- Provider API integration (admin can add providers and import products)
- Profit margin configuration (global and per-product)
- User level management (create tiers, assign users, auto-upgrade)
- Custom rate management (set special prices for specific users)
- Customer price display (shows user-specific prices with discounts)
- Invoice generation (customers can generate invoices for orders)

## Documentation
- Comprehensive README created (PRICING_SYSTEM_README.md)
- Includes architecture overview, usage guides, examples, and troubleshooting
- All features documented with step-by-step instructions
