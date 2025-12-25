# Task: Admin API v2, Stock Management, and Homepage Updates

## Plan

- [x] Step 1: Update Website Branding
  - [x] Change website name from "Recharge Hub" to "MediaMoney"
  - [x] Update HomePage hero section (reduce height)
  - [x] Move search field below hero section
  - [x] Update all references in code

- [x] Step 2: Database Schema for Stock Management
  - [x] Create stock_items table (for gift cards, codes, etc.)
  - [x] Add fields: product_id, code/key, status (available/sold/reserved), sold_to_user_id, sold_at
  - [x] Create stock_uploads table (track bulk uploads)
  - [x] Add RLS policies
  - [x] Apply migration

- [x] Step 3: Database Schema for API Keys
  - [x] Create api_keys table
  - [x] Add fields: key, name, note, status, permissions (JSON)
  - [x] Add version field (v1/v2)
  - [x] Add RLS policies
  - [x] Apply migration

- [x] Step 4: TypeScript Types
  - [x] Add StockItem interface
  - [x] Add StockUpload interface
  - [x] Add ApiKey interface
  - [x] Add ApiPermissions interface
  - [x] Update types.ts

- [x] Step 5: Stock Management API Functions
  - [x] uploadStockItems (bulk upload)
  - [x] getStockItems (with filters)
  - [x] getAvailableStock (by product)
  - [x] reserveStockItem (when order placed)
  - [x] releaseStockItem (if order cancelled)
  - [x] markStockItemSold (when order completed)
  - [x] deleteStockItem

- [x] Step 6: API Key Management Functions
  - [x] createApiKey
  - [x] getApiKeys
  - [x] getApiKeyById
  - [x] updateApiKey
  - [x] deleteApiKey
  - [x] toggleApiKeyStatus
  - [x] validateApiKey (for API requests)

- [x] Step 7: Stock Management UI (Admin)
  - [x] StockManagement component
  - [x] Upload stock (CSV/manual entry)
  - [x] View stock by product
  - [x] Filter by status (available/sold/reserved)
  - [x] Delete stock items
  - [x] Export stock report

- [x] Step 8: API Key Management UI (Admin)
  - [x] ApiKeyManagement component
  - [x] Create/edit API key with permissions
  - [x] Permission checkboxes for all endpoints
  - [x] View API key list
  - [x] Toggle status
  - [x] Delete API key

- [x] Step 9: Integrate Stock with Orders
  - [x] Modify order creation to reserve stock
  - [x] Modify order completion to mark stock as sold
  - [x] Modify order cancellation to release stock
  - [x] Display code/key to customer after purchase
  - [x] Add stock check before allowing purchase

- [x] Step 10: Admin API v2 Endpoints (Edge Functions)
  - [x] Create admin-api-v2 edge function
  - [x] Implement authentication via API key
  - [x] Implement permission checking
  - [x] Orders endpoints (list, get, update, cancel, refund, etc.)
  - [x] Payments endpoints (list, add, view details)
  - [x] Users endpoints (list, add, view details)
  - [x] Tickets endpoints (list, get, reply, add)
  - [x] Refill endpoints (list, update status)

- [x] Step 11: Customer API Endpoints (Edge Functions)
  - [x] Create customer-api edge function
  - [x] Authentication via API key or user token
  - [x] Get products
  - [x] Create order
  - [x] Get order status
  - [x] Get user balance
  - [x] Add balance

- [x] Step 12: Add to Admin Panel
  - [x] Add "Stock" tab to AdminManagementPage
  - [x] Add "API Keys" tab to AdminManagementPage
  - [x] Update grid layout for new tabs

- [x] Step 13: Testing & Validation
  - [x] Test stock upload
  - [x] Test order with stock
  - [x] Test API key creation
  - [x] Test API endpoints
  - [x] Run lint checks

## Notes
- Stock items are product-specific (gift cards, codes, etc.)
- Each stock item can only be sold once
- When an order is placed, stock is reserved
- When payment is completed, stock is marked as sold
- When an order is cancelled, reserved stock is released
- Customers can view their purchased codes in the Orders page

## API Endpoints

### Admin API v2 (Edge Function: admin-api-v2)
**Authentication**: X-API-Key header with v2 API key
**Base URL**: `https://[project-ref].supabase.co/functions/v1/admin-api-v2`

**Orders Endpoints**:
- `?endpoint=orders&action=list` - Get order list (requires: orders_get_list)
- `?endpoint=orders&action=get&order_id=xxx` - Get order details (requires: orders_edit_link)
- `?endpoint=orders&action=update_status` - Update order status (requires: orders_change_status)
  - Body: `{ "order_id": "xxx", "status": "completed" }`
- `?endpoint=orders&action=cancel` - Cancel order (requires: orders_request_cancel)
  - Body: `{ "order_id": "xxx" }`

**Payments Endpoints**:
- `?endpoint=payments&action=list` - Get payment list (requires: payments_get_list)
- `?endpoint=payments&action=add` - Add payment (requires: payments_add)
  - Body: Payment proof object

**Users Endpoints**:
- `?endpoint=users&action=list` - Get user list (requires: users_get_list)
- `?endpoint=users&action=get&user_id=xxx` - Get user details (requires: users_view_details)
- `?endpoint=users&action=add` - Add user (requires: users_add)
  - Body: `{ "email": "xxx", "password": "xxx", ...profileData }`

**Tickets Endpoints**:
- `?endpoint=tickets&action=list` - Get ticket list (requires: tickets_get_list)
- `?endpoint=tickets&action=get&ticket_id=xxx` - Get ticket details (requires: tickets_get)
- `?endpoint=tickets&action=reply` - Reply to ticket (requires: tickets_reply)
  - Body: `{ "ticket_id": "xxx", "message": "xxx" }`
- `?endpoint=tickets&action=add` - Add ticket (requires: tickets_add)
  - Body: Ticket object

### Customer API (Edge Function: customer-api)
**Authentication**: X-API-Key header OR Authorization: Bearer [token]
**Base URL**: `https://[project-ref].supabase.co/functions/v1/customer-api`

**Endpoints**:
- `?action=get_products` - Get product list
  - Optional: `&category=xxx` to filter by category
- `?action=create_order` - Create order (user token only)
  - Body: `{ "product_id": "xxx", "quantity": 1, "player_id": "xxx" }`
- `?action=get_order&order_id=xxx` - Get order status (user token only)
  - Returns order with codes if completed
- `?action=get_balance` - Get user balance (user token only)
- `?action=add_balance` - Add balance (user token only)
  - Body: `{ "amount": 100, "payment_method_id": "xxx", "proof_url": "xxx" }`

## Usage Instructions

### For Admins:
1. Go to Admin Management → API Keys tab
2. Create a new API key with desired permissions
3. Copy the generated key
4. Use the key in X-API-Key header when calling admin-api-v2

### For Customers:
1. Use customer-api with either:
   - API key (for public endpoints like get_products)
   - User authentication token (for user-specific actions)
2. Create orders, check status, and view purchased codes

### Stock Management:
1. Go to Admin Management → Stock tab
2. Select a product
3. Upload codes (one per line or CSV)
4. Codes are automatically assigned when orders are completed
5. Customers can view their codes in Orders page after payment
- Stock is automatically reserved when order is placed
- Stock is marked as sold when order is completed
- Stock is released if order is cancelled
- API keys have granular permissions
- Admin API v2 requires API key authentication
- Customer API can use API key or user token
