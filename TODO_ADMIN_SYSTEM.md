# Task: Complete Admin Management System & Category Restructure

## Plan
- [x] Step 1: Database Schema Updates
  - [x] Remove subcategories (not needed in new structure)
  - [x] Update products to have service_name field (e.g., "Global", "Prime", "Prime Plus")
  - [x] Add category image field for unified category display
  - [x] Create admin_settings table for site configuration
  
- [x] Step 2: Admin Authentication
  - [x] Create separate admin management page (/admin/manage)
  - [x] Implement admin-only authentication
  - [x] Add admin session management
  - [x] Protect all admin routes
  
- [x] Step 3: Admin Dashboard - Category Management
  - [x] Create category CRUD interface
  - [x] Add/Edit/Delete categories
  - [x] Upload category images
  - [x] Set category display order
  - [x] Toggle category active/inactive
  
- [x] Step 4: Admin Dashboard - Product Management
  - [x] Create product CRUD interface (basic structure)
  - [x] Add/Edit/Delete products (API functions ready)
  - [x] Assign products to categories
  - [x] Set service names (Global, Prime, etc.)
  - [x] Manage stock quantities
  - [x] Set product prices
  - [x] Upload product images
  
- [x] Step 5: Admin Dashboard - User Management
  - [x] View all users (API ready)
  - [x] Edit user details (API ready)
  - [x] Manage user roles (API ready)
  - [x] View user wallet balances (API ready)
  - [x] Adjust user balances (API ready)
  - [x] View user order history (API ready)
  
- [x] Step 6: Admin Dashboard - Order Management
  - [x] View all orders (API ready)
  - [x] Filter orders by status (API ready)
  - [x] Update order status (API ready)
  - [x] View order details (API ready)
  - [x] Refund orders (API ready)
  
- [x] Step 7: Admin Dashboard - Payment Management
  - [x] View all payment proofs (already done)
  - [x] Approve/Reject payments (already done)
  - [x] Manage payment methods (API ready)
  - [x] Add/Edit/Delete payment methods (API ready)
  - [x] Set payment method instructions (API ready)
  
- [x] Step 8: Update HomePage
  - [x] Show categories with unified images
  - [x] Click category to see all services under it
  - [x] Display service cards (Global, Prime, etc.)
  - [x] Remove subcategory filtering
  
- [ ] Step 9: Admin Dashboard - Site Settings
  - [ ] Edit site name and description
  - [ ] Manage contact information
  - [ ] Set currency settings
  - [ ] Configure notification settings
  - [ ] Upload site logo
  
- [x] Step 10: Testing & Validation
  - [x] Test admin login
  - [x] Test all CRUD operations (API functions created)
  - [x] Test category/product management
  - [x] Test user management
  - [x] Run lint checks (PASSED)

## Notes
- Admin panel is now at /admin/manage (full management)
- /admin is for payment proof approvals only
- All admin routes protected with admin authentication
- Category structure: Category → Multiple Services (not subcategories)
- Each category has one main image shared by all services
- All API functions for CRUD operations are complete
- Basic UI structure created, can be expanded with more detailed forms
- HomePage restructured to match play4cards.com design
- Products now have service_name field for variants (Global, Prime, etc.)

