# MediaMoney API Documentation

## Overview

MediaMoney provides two API endpoints for different use cases:
1. **Admin API v2** - For administrative operations with granular permissions
2. **Customer API** - For customer-facing operations

## Admin API v2

### Base URL
```
https://[your-project-ref].supabase.co/functions/v1/admin-api-v2
```

### Authentication
All requests require an API key in the header:
```
X-API-Key: your_api_key_here
```

### Creating an API Key
1. Log in as admin
2. Navigate to Admin Management → API Keys
3. Click "Create API Key"
4. Enter name and note
5. Select permissions for the key
6. Copy the generated key (shown only once)

### Permissions

Each API key can have the following permissions:

**Orders**:
- `orders_edit_link` - View order details
- `orders_resend_order` - Resend order
- `orders_get_list` - Get order list
- `orders_view_provider_charge` - View provider charge
- `orders_view_external_id` - View external ID
- `orders_view_provider_response` - View provider response
- `orders_view_provider_url` - View provider URL
- `orders_change_status` - Change order status
- `orders_cancel_refund` - Cancel and refund
- `orders_set_partial` - Set partial
- `orders_pull_orders` - Pull orders
- `orders_update_orders` - Update orders
- `orders_request_cancel` - Request cancel
- `orders_pull_cancel_tasks` - Pull cancel tasks
- `orders_reject_cancel` - Reject cancel

**Refills**:
- `refills_refill` - Refill
- `refills_pull_tasks` - Pull refill tasks
- `refills_change_status` - Change refill status

**Payments**:
- `payments_add` - Add payment
- `payments_get_list` - Get payment list
- `payments_view_details` - View user details

**Users**:
- `users_add` - Add user
- `users_get_list` - Get user list
- `users_view_email` - View email
- `users_view_balance` - View balance
- `users_view_spent` - View spent
- `users_view_details` - View user details

**Tickets**:
- `tickets_get_list` - Get ticket list
- `tickets_get` - Get ticket
- `tickets_reply` - Reply to ticket
- `tickets_add` - Add ticket

### Endpoints

#### Orders

**Get Order List**
```bash
GET /admin-api-v2?endpoint=orders&action=list
X-API-Key: your_key

Response:
{
  "code": "SUCCESS",
  "message": "Success",
  "data": [...]
}
```

**Get Order Details**
```bash
GET /admin-api-v2?endpoint=orders&action=get&order_id=xxx
X-API-Key: your_key
```

**Update Order Status**
```bash
POST /admin-api-v2?endpoint=orders&action=update_status
X-API-Key: your_key
Content-Type: application/json

{
  "order_id": "xxx",
  "status": "completed"
}
```

**Cancel Order**
```bash
POST /admin-api-v2?endpoint=orders&action=cancel
X-API-Key: your_key
Content-Type: application/json

{
  "order_id": "xxx"
}
```

#### Payments

**Get Payment List**
```bash
GET /admin-api-v2?endpoint=payments&action=list
X-API-Key: your_key
```

**Add Payment**
```bash
POST /admin-api-v2?endpoint=payments&action=add
X-API-Key: your_key
Content-Type: application/json

{
  "user_id": "xxx",
  "amount": 100,
  "payment_method_id": "xxx",
  "proof_url": "xxx"
}
```

#### Users

**Get User List**
```bash
GET /admin-api-v2?endpoint=users&action=list
X-API-Key: your_key
```

**Get User Details**
```bash
GET /admin-api-v2?endpoint=users&action=get&user_id=xxx
X-API-Key: your_key
```

**Add User**
```bash
POST /admin-api-v2?endpoint=users&action=add
X-API-Key: your_key
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "full_name": "John Doe"
}
```

#### Tickets

**Get Ticket List**
```bash
GET /admin-api-v2?endpoint=tickets&action=list
X-API-Key: your_key
```

**Get Ticket Details**
```bash
GET /admin-api-v2?endpoint=tickets&action=get&ticket_id=xxx
X-API-Key: your_key
```

**Reply to Ticket**
```bash
POST /admin-api-v2?endpoint=tickets&action=reply
X-API-Key: your_key
Content-Type: application/json

{
  "ticket_id": "xxx",
  "message": "Your reply here"
}
```

**Add Ticket**
```bash
POST /admin-api-v2?endpoint=tickets&action=add
X-API-Key: your_key
Content-Type: application/json

{
  "user_id": "xxx",
  "subject": "Issue subject",
  "message": "Issue description"
}
```

## Customer API

### Base URL
```
https://[your-project-ref].supabase.co/functions/v1/customer-api
```

### Authentication

Two authentication methods are supported:

**1. API Key (for public endpoints)**
```
X-API-Key: your_api_key
```

**2. User Token (for user-specific actions)**
```
Authorization: Bearer user_jwt_token
```

### Endpoints

#### Get Products

```bash
GET /customer-api?action=get_products
X-API-Key: your_key

# Optional: Filter by category
GET /customer-api?action=get_products&category=gift_cards
```

Response:
```json
{
  "code": "SUCCESS",
  "message": "Success",
  "data": [
    {
      "id": "xxx",
      "name": "Netflix Gift Card $50",
      "price": 50,
      "category": "gift_cards",
      "image_url": "...",
      "is_active": true
    }
  ]
}
```

#### Create Order

```bash
POST /customer-api?action=create_order
Authorization: Bearer user_token
Content-Type: application/json

{
  "product_id": "xxx",
  "quantity": 1,
  "player_id": "optional_player_id"
}
```

Response:
```json
{
  "code": "SUCCESS",
  "message": "Success",
  "data": {
    "id": "order_id",
    "status": "pending",
    "total_amount": 50,
    ...
  }
}
```

#### Get Order Status

```bash
GET /customer-api?action=get_order&order_id=xxx
Authorization: Bearer user_token
```

Response (if completed):
```json
{
  "code": "SUCCESS",
  "message": "Success",
  "data": {
    "id": "order_id",
    "status": "completed",
    "codes": [
      {
        "code": "XXXX-XXXX-XXXX-XXXX",
        "product_id": "xxx"
      }
    ]
  }
}
```

#### Get User Balance

```bash
GET /customer-api?action=get_balance
Authorization: Bearer user_token
```

Response:
```json
{
  "code": "SUCCESS",
  "message": "Success",
  "data": {
    "balance": 150.50
  }
}
```

#### Add Balance

```bash
POST /customer-api?action=add_balance
Authorization: Bearer user_token
Content-Type: application/json

{
  "amount": 100,
  "payment_method_id": "xxx",
  "proof_url": "https://..."
}
```

Response:
```json
{
  "code": "SUCCESS",
  "message": "Success",
  "data": {
    "id": "proof_id",
    "status": "pending",
    ...
  }
}
```

## Stock Management

### How It Works

1. **Admin uploads stock codes** via Admin Management → Stock tab
2. **Customer places order** - stock is automatically reserved
3. **Payment is completed** - reserved stock is marked as sold
4. **Customer views codes** - codes are displayed in Orders page
5. **Order is cancelled** - reserved stock is released back to available

### Stock Status Flow

```
available → reserved → sold
    ↑          ↓
    └─────────┘
   (if cancelled)
```

### Uploading Stock

1. Go to Admin Management → Stock tab
2. Select a product
3. Enter codes (one per line) or upload CSV
4. Click "Upload Stock"
5. Codes are now available for orders

### CSV Format

```csv
code
XXXX-XXXX-XXXX-XXXX
YYYY-YYYY-YYYY-YYYY
ZZZZ-ZZZZ-ZZZZ-ZZZZ
```

## Error Handling

All APIs return consistent error responses:

```json
{
  "code": "FAIL",
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad request (invalid parameters)
- `401` - Unauthorized (missing or invalid API key/token)
- `403` - Forbidden (insufficient permissions)
- `500` - Internal server error

## Rate Limiting

Currently, there are no rate limits. However, we recommend:
- Maximum 100 requests per minute per API key
- Implement exponential backoff for retries

## Best Practices

1. **Secure your API keys** - Never expose them in client-side code
2. **Use appropriate permissions** - Grant only necessary permissions
3. **Handle errors gracefully** - Always check response codes
4. **Cache product data** - Products don't change frequently
5. **Verify order status** - Check order status before displaying codes

## Support

For API support, please contact the MediaMoney team or create a ticket through the platform.
