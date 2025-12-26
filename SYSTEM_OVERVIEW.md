# Recharge Hub - Complete System Overview

## 🏗️ System Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Icons**: Lucide React

### Backend Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime (subscriptions)
- **Edge Functions**: Supabase Edge Functions (Deno)

---

## 📁 Project Structure

```
app-8herke1wtngh/
├── src/
│   ├── components/
│   │   ├── admin/              # 36 Admin components
│   │   ├── layouts/            # Header, Footer, Layout
│   │   ├── notifications/      # Notification system
│   │   └── ui/                 # shadcn/ui components
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── db/
│   │   └── api.ts              # Database API functions
│   ├── hooks/
│   │   └── use-toast.ts        # Toast notifications
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   └── utils.ts            # Utility functions
│   ├── pages/                  # All page components
│   ├── types/
│   │   └── types.ts            # TypeScript type definitions
│   ├── routes.tsx              # Route configuration
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
├── supabase/
│   ├── functions/              # Edge functions
│   └── migrations/             # Database migrations
└── public/                     # Static assets
```

---

## 🗄️ Database Schema

### Core Tables

#### 1. **profiles**
User profile information
- user_id (FK to auth.users)
- username
- email
- wallet_balance
- role (user/admin)
- user_level_id (FK)
- created_at, updated_at

#### 2. **categories**
Service categories (Games, Streaming, etc.)
- id, name, description
- service_type (game/streaming/gift_card/app)
- image_url, icon
- is_active, display_order

#### 3. **products**
Products/services for sale
- id, name, description
- category_id (FK)
- price, cost_price
- stock_quantity
- is_active, requires_player_id

#### 4. **orders**
Customer orders
- id, user_id (FK)
- product_id (FK)
- quantity, total_amount
- status (pending/completed/failed/refunded)
- player_id, custom_fields
- created_at, completed_at

#### 5. **payments**
Payment transactions
- id, user_id (FK)
- amount, payment_method
- status (pending/approved/rejected)
- transaction_id, proof_url

#### 6. **stock_items**
Inventory management
- id, product_id (FK)
- code, serial_number
- status (available/sold/reserved)
- order_id (FK when sold)

#### 7. **user_levels**
User tier system
- id, name, description
- discount_percentage
- min_orders, min_spent

#### 8. **custom_rates**
Special pricing rules
- id, user_id (FK)
- product_id (FK)
- custom_price, discount_percentage

#### 9. **notifications**
User notifications
- id, user_id (FK)
- type, title, message
- is_read, created_at

#### 10. **banners**
Homepage carousel banners
- id, title, image_url
- link_url, display_order
- is_active

#### 11. **site_settings**
Site configuration
- id, setting_key, setting_value
- setting_type, description

#### 12. **api_keys**
API access management
- id, user_id (FK)
- api_key, api_secret
- is_active, last_used_at

#### 13. **tickets**
Support tickets
- id, user_id (FK)
- subject, message
- status (open/in_progress/closed)
- priority, category

#### 14. **ticket_replies**
Ticket responses
- id, ticket_id (FK)
- user_id (FK)
- message, is_admin_reply

#### 15. **subscriptions**
Recurring subscriptions
- id, user_id (FK)
- product_id (FK)
- interval (daily/weekly/monthly)
- next_billing_date, status

#### 16. **drip_feed_orders**
Gradual delivery orders
- id, order_id (FK)
- total_quantity, delivered_quantity
- delivery_speed, status

#### 17. **refill_requests**
Refill system
- id, order_id (FK)
- reason, status
- processed_at

#### 18. **affiliates**
Affiliate program
- id, user_id (FK)
- referral_code
- commission_rate
- total_earnings

#### 19. **child_panels**
Sub-panel management
- id, owner_id (FK)
- panel_name, domain
- api_access, revenue_share

#### 20. **activity_logs**
System activity tracking
- id, user_id (FK)
- action, details
- ip_address, created_at

---

## 🎨 User Interface Pages

### Public Pages
1. **Home** (`/`) - Service categories, products, banners
2. **About** (`/about`) - Company information
3. **Login** (`/login`) - User authentication
4. **Register** (`/register`) - New user registration
5. **Checkout** (`/checkout`) - Order placement

### User Pages (Authenticated)
6. **Wallet** (`/wallet`) - Balance management, top-up
7. **Add Balance** (`/add-balance`) - Payment methods
8. **My Orders** (`/orders`) - Order history
9. **Security** (`/security`) - Account security settings
10. **API** (`/api`) - API documentation and keys

### Admin Pages (Admin Role)
11. **Admin Dashboard** (`/admin`) - Complete admin panel

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. User registers with email/password
2. Supabase Auth creates user account
3. Trigger creates profile in profiles table
4. User receives confirmation email
5. User logs in with credentials
6. JWT token stored in session

### Authorization Levels
- **Public**: Access to home, about, login, register
- **User**: Access to wallet, orders, security, API
- **Admin**: Full access to admin dashboard

### Security Features
- Password hashing (Supabase Auth)
- JWT token authentication
- Row Level Security (RLS) policies
- Two-factor authentication (2FA)
- IP whitelist
- Session management
- Activity logging

---

## 🚀 Key Features

### For Customers
✅ Browse service categories
✅ Search and filter products
✅ Add balance to wallet
✅ Place orders with player ID
✅ Track order status
✅ View order history
✅ Receive notifications
✅ Submit support tickets
✅ API access for integration

### For Admins
✅ Dashboard with analytics
✅ User management
✅ Order processing
✅ Payment verification
✅ Stock management
✅ Product catalog management
✅ Category management
✅ Banner management
✅ Pricing configuration
✅ User level system
✅ Custom rates
✅ Subscription management
✅ Drip-feed orders
✅ Refill system
✅ Ticket support
✅ Affiliate program
✅ Child panel management
✅ Security monitoring
✅ System monitoring
✅ Reports and analytics
✅ Appearance customization
✅ Email templates
✅ Activity logs

---

## 🎯 Business Logic

### Order Flow
1. User selects product
2. Enters player ID (if required)
3. Confirms order
4. Amount deducted from wallet
5. Order created with "pending" status
6. System checks stock availability
7. If stock available: Assigns stock item to order
8. Order status updated to "completed"
9. User receives notification
10. Stock item marked as "sold"

### Payment Flow
1. User initiates balance top-up
2. Selects payment method
3. Uploads payment proof (if manual)
4. Payment record created with "pending" status
5. Admin reviews payment
6. Admin approves/rejects payment
7. If approved: Wallet balance updated
8. User receives notification

### Pricing Logic
1. Base price from product
2. Check user level discount
3. Check custom rate for user
4. Apply highest discount
5. Calculate final price
6. Display to user

### Stock Management
1. Admin adds stock items
2. Items marked as "available"
3. When order placed: Item assigned
4. Item status changed to "sold"
5. Stock quantity decremented
6. Low stock alerts

---

## 🔔 Notification System

### Notification Types
- Order completed
- Order canceled
- Order refunded
- Wallet credited
- Wallet debited
- Payment approved
- Payment rejected
- API key changed
- System announcement

### Delivery Methods
- In-app notifications (bell icon)
- Email notifications (optional)
- Push notifications (optional)

---

## 📊 Analytics & Reporting

### Metrics Tracked
- Total revenue
- Total orders
- Total users
- Active subscriptions
- Pending payments
- Low stock alerts
- User growth rate
- Order completion rate
- Average order value
- Revenue by category
- Revenue by product
- User activity

### Report Types
- Revenue reports
- User analytics
- Order statistics
- Performance metrics
- Custom date ranges
- Export to CSV/PDF

---

## 🛠️ Development Tools

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Biome for fast linting

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
npm run preview      # Preview production build
```

---

## 🌐 Deployment

### Environment Variables Required
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ID=your_app_id
VITE_API_ENV=production
```

### Deployment Platforms
- Vercel (Recommended)
- Netlify
- Cloudflare Pages
- AWS Amplify

---

## 📈 Performance Optimizations

### Frontend
- Code splitting with React.lazy
- Image optimization
- Lazy loading
- Memoization with useMemo/useCallback
- Virtual scrolling for large lists

### Backend
- Database indexing
- Query optimization
- Connection pooling
- Caching strategies
- Edge functions for compute

---

## 🔄 Future Enhancements

### Planned Features
- [ ] Multi-language support (i18n)
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Automated testing suite
- [ ] Performance monitoring
- [ ] A/B testing framework
- [ ] Advanced fraud detection
- [ ] Blockchain integration
- [ ] AI-powered recommendations

---

## 📚 Documentation Files

1. **ADMIN_DASHBOARD_FEATURES.md** - Complete feature list
2. **ADMIN_ACCESS_GUIDE.md** - How to access admin panel
3. **SYSTEM_OVERVIEW.md** - This file
4. **README.md** - Project setup and installation

---

## 🆘 Support & Maintenance

### Regular Tasks
- Monitor system health
- Review security logs
- Process pending payments
- Respond to support tickets
- Update product catalog
- Manage stock inventory
- Review analytics
- Backup database

### Troubleshooting Resources
- Browser console logs
- Supabase logs
- Activity logs in admin panel
- Network tab for API calls
- Database query logs

---

*System Version: v27*
*Last Updated: 2025-12-25*
*Total Components: 137 files*
*Admin Features: 36 components*
*Database Tables: 20+ tables*
