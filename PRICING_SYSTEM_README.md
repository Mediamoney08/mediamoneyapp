# Advanced Pricing & User Level System

## Overview

This application features a comprehensive pricing system that allows administrators to:
- Import services from external API providers
- Add profit margins to provider prices
- Create user level tiers with discount percentages
- Set custom rates for specific users
- Generate invoices for customer orders

## System Architecture

### Database Schema

#### 1. **Providers Table**
Stores information about external API providers.
- `name`: Provider name
- `api_url`: Provider API endpoint
- `api_key`: Authentication key (encrypted)
- `is_active`: Enable/disable provider

#### 2. **Provider Products Table**
Stores products imported from providers.
- `provider_id`: Reference to provider
- `external_id`: Product ID from provider
- `name`, `description`: Product details
- `base_price`: Original price from provider
- `last_synced_at`: Last import timestamp

#### 3. **User Levels Table**
Defines membership tiers with benefits.
- `name`: Level name (Bronze, Silver, Gold, Platinum, etc.)
- `discount_percentage`: Discount applied to all products
- `min_spending`: Minimum spending to reach this level
- `is_active`: Enable/disable level

#### 4. **Custom Rates Table**
User-specific pricing overrides.
- `user_id`: Target user
- `product_id`: Target product
- `custom_price`: Override price
- `is_active`: Enable/disable rate

#### 5. **Products Table (Extended)**
Enhanced with pricing fields:
- `base_price`: Cost from provider
- `profit_margin`: Percentage markup (per-product)
- `use_global_margin`: Use global margin instead
- `provider_id`: Source provider (if imported)

#### 6. **Profiles Table (Extended)**
User profiles with level tracking:
- `user_level_id`: Current membership level
- `total_spending`: Lifetime spending amount

### Pricing Hierarchy

The system calculates prices in the following order:

1. **Base Price**: Original price from provider or manual entry
2. **Profit Margin**: Admin markup (global or per-product)
3. **User Level Discount**: Automatic discount based on membership tier
4. **Custom Rate**: Manual override for specific user-product combinations

**Priority**: Custom Rate > User Level Discount > Profit Margin > Base Price

### Database Functions

#### `get_price_details(user_id, product_id)`
Returns complete pricing breakdown:
```json
{
  "base_price": 10.00,
  "profit_margin": 15.00,
  "price_with_margin": 11.50,
  "user_level_discount": 10.00,
  "custom_rate": null,
  "final_price": 10.35,
  "savings": 1.15,
  "discount_percentage": 10.00,
  "discount_reason": "Gold Level Discount"
}
```

#### `calculate_user_price(user_id, product_id)`
Returns final price only (for quick calculations).

#### `auto_upgrade_user_level(user_id)`
Automatically upgrades user level based on total spending.
Called after each order completion.

#### `update_user_spending(user_id, amount)`
Updates user's total spending and triggers level upgrade check.

## Admin Features

### 1. Provider Management
**Location**: Admin Panel → Providers Tab

**Features**:
- Add/edit/delete providers
- Configure API credentials
- Test API connection
- Import products from provider
- View sync history

**Usage**:
1. Click "Add Provider"
2. Enter provider details (name, API URL, API key)
3. Click "Test Connection" to verify
4. Click "Import Products" to sync catalog
5. Products appear in Products tab with provider reference

### 2. Profit Margin Settings
**Location**: Admin Panel → Margins Tab

**Features**:
- Set global profit margin (applies to all products)
- Override margin for specific products
- Preview calculated prices
- Bulk update margins

**Usage**:
1. Set "Global Profit Margin" (e.g., 15%)
2. All products using global margin will update automatically
3. For specific products, go to product row and set custom margin
4. Toggle "Use Global" to switch between global/custom

### 3. User Level Management
**Location**: Admin Panel → Levels Tab

**Features**:
- Create membership tiers (Bronze, Silver, Gold, etc.)
- Set discount percentage per level
- Define minimum spending requirements
- Auto-upgrade users based on spending
- Assign users to levels manually

**Usage**:
1. Click "Add User Level"
2. Enter level details:
   - Name: "Gold"
   - Discount: 10%
   - Min Spending: $500
3. Users automatically upgrade when they reach spending threshold
4. Manually assign users via "Assign Users" button

### 4. Custom Rate Management
**Location**: Admin Panel → Rates Tab

**Features**:
- Set special prices for specific users
- Override normal pricing logic
- View price comparison (normal vs custom)
- Bulk import custom rates
- Expiration dates (optional)

**Usage**:
1. Click "Add Custom Rate"
2. Select user and product
3. Enter custom price
4. Custom rate takes priority over all other discounts
5. Toggle "Active" to enable/disable

## Customer Features

### 1. User-Specific Pricing
**Location**: Home Page → Product Cards

**Features**:
- Automatic price calculation based on user level
- Discount badges showing percentage off
- Original price strikethrough
- Savings amount display
- Discount reason (e.g., "Gold Level Discount")

**Display**:
```
$10.35  [10% OFF]
$11.50  (strikethrough)
Gold Level Discount
```

### 2. User Level Badge
**Location**: Home Page → Above Search Bar

**Features**:
- Shows current membership tier
- Trophy icon indicator
- Visible only to logged-in users

**Display**:
```
🏆 Gold Member
```

### 3. Invoice Generation
**Location**: Orders Page → Order Row → Invoice Button

**Features**:
- Generate professional invoices
- Itemized order details
- Company branding
- Print functionality
- Download as PDF

**Usage**:
1. Go to Orders page
2. Find completed order
3. Click "Invoice" button
4. Review invoice details
5. Click "Print" or "Download"

## API Integration

### Provider API Format

The system expects providers to return products in this format:

```json
{
  "products": [
    {
      "id": "external_product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 10.00,
      "category": "game",
      "stock": 100
    }
  ]
}
```

### Import Process

1. Admin configures provider credentials
2. System calls provider API endpoint
3. Products are mapped to internal schema
4. Base prices are stored from provider
5. Profit margins are applied automatically
6. Products appear in catalog

### Sync Strategy

- **Manual Sync**: Admin clicks "Import Products"
- **Scheduled Sync**: Can be configured via cron job
- **Incremental Updates**: Only new/changed products are updated
- **Price History**: Previous prices are logged for auditing

## Pricing Examples

### Example 1: Regular User (No Level)
- Base Price: $10.00
- Profit Margin: 15%
- User Level: None
- **Final Price: $11.50**

### Example 2: Gold Member
- Base Price: $10.00
- Profit Margin: 15%
- Price with Margin: $11.50
- User Level: Gold (10% discount)
- **Final Price: $10.35**
- **Savings: $1.15**

### Example 3: Custom Rate
- Base Price: $10.00
- Profit Margin: 15%
- Price with Margin: $11.50
- User Level: Gold (10% discount)
- Custom Rate: $9.00
- **Final Price: $9.00** (Custom rate overrides all)
- **Savings: $2.50**

## User Level Auto-Upgrade

Users are automatically upgraded when they reach spending thresholds:

1. User completes order for $50
2. `update_user_spending()` adds $50 to total
3. `auto_upgrade_user_level()` checks thresholds
4. If total spending ≥ $500, upgrade to Gold
5. User receives Gold benefits on next purchase

**Thresholds** (configurable):
- Bronze: $0
- Silver: $100
- Gold: $500
- Platinum: $1000

## Security Considerations

### API Key Storage
- Provider API keys are stored encrypted
- Only accessible via Supabase RLS policies
- Admin-only access to provider credentials

### Price Manipulation Prevention
- All price calculations done server-side
- Database functions use SECURITY DEFINER
- Client cannot override calculated prices
- Audit logs track all price changes

### Custom Rate Approval
- Custom rates require admin approval
- Expiration dates prevent indefinite discounts
- Can be disabled without deletion

## Testing Checklist

### Provider Import
- [ ] Add provider with valid credentials
- [ ] Test API connection
- [ ] Import products successfully
- [ ] Verify products appear in catalog
- [ ] Check base prices are correct

### Profit Margins
- [ ] Set global margin to 15%
- [ ] Verify all products reflect margin
- [ ] Override margin for one product
- [ ] Verify override takes precedence
- [ ] Check price preview accuracy

### User Levels
- [ ] Create Bronze, Silver, Gold levels
- [ ] Set discount percentages
- [ ] Assign user to Gold level
- [ ] Verify user sees discounted prices
- [ ] Test auto-upgrade on spending threshold

### Custom Rates
- [ ] Create custom rate for user
- [ ] Verify custom price overrides discount
- [ ] Disable custom rate
- [ ] Verify user reverts to level discount
- [ ] Test expiration date functionality

### Invoice Generation
- [ ] Complete an order
- [ ] Generate invoice
- [ ] Verify all order details present
- [ ] Test print functionality
- [ ] Test download functionality

## Troubleshooting

### Prices Not Updating
1. Check if product uses global margin
2. Verify global margin setting exists
3. Clear browser cache
4. Check RLS policies allow price calculation

### User Level Not Applying
1. Verify user has level assigned
2. Check level is active
3. Verify discount percentage is set
4. Check user is logged in

### Custom Rate Not Working
1. Verify custom rate is active
2. Check expiration date hasn't passed
3. Verify user and product IDs match
4. Check RLS policies allow access

### Provider Import Failing
1. Test API connection
2. Verify API key is correct
3. Check API response format
4. Review error logs in console

## Future Enhancements

- [ ] Bulk import custom rates via CSV
- [ ] Scheduled price sync with providers
- [ ] Price history tracking and charts
- [ ] Promotional codes and coupons
- [ ] Time-limited flash sales
- [ ] Tiered pricing (volume discounts)
- [ ] Referral program integration
- [ ] Loyalty points system

## Support

For questions or issues with the pricing system:
1. Check this documentation
2. Review database function logs
3. Contact system administrator
4. Submit support ticket

---

**Last Updated**: 2025-12-25
**Version**: 1.0.0
