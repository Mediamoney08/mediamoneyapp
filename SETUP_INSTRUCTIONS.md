# Recharge Hub - Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Stripe (REQUIRED for payments)**
   
   The application is fully functional except for payment processing, which requires Stripe configuration.
   
   ### Steps to Configure Stripe:
   
   a. **Get Stripe Secret Key**
      - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
      - Copy your Secret Key (starts with `sk_test_` or `sk_live_`)
   
   b. **Add to Supabase Secrets**
      
      Option 1 - Using Supabase Dashboard (Recommended):
      - Go to your Supabase project: https://supabase.com/dashboard/project/ufaljqeldjuquuazubam
      - Navigate to: Project Settings > Edge Functions > Secrets
      - Click "Add new secret"
      - Name: `STRIPE_SECRET_KEY`
      - Value: Your Stripe secret key
      - Click "Save"
      
      Option 2 - Using Supabase CLI:
      ```bash
      supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here --project-ref ufaljqeldjuquuazubam
      ```

3. **Run Development Server**
   ```bash
   pnpm run dev
   ```

4. **Access the Application**
   - Open your browser to the URL shown in the terminal
   - Register a new account (first user becomes admin)
   - Start using the platform!

## Features Available

### Without Stripe Configuration
✅ User registration and login
✅ Browse products and services
✅ View product details
✅ Access all pages (Home, About, API Docs, Support)
✅ Dark/Light mode toggle
✅ Responsive design
✅ User profile management
✅ Security settings
✅ Support ticket system
✅ Notifications system

### With Stripe Configuration
✅ All above features PLUS:
✅ Add balance to wallet
✅ Purchase products
✅ Payment processing
✅ Order fulfillment
✅ Transaction history
✅ Payment verification

## Default Credentials

The application uses username-based authentication. Simply register with any username (letters, numbers, and underscores only).

**First registered user automatically becomes admin!**

## Database

The database is already configured with:
- User profiles table
- Products table (pre-populated with 30+ sample products)
- Orders table
- Wallet transactions table
- Tickets table
- Notifications table
- All necessary RLS policies

## Pages Included

1. **Home** - Product catalog with category filters
2. **Login/Register** - User authentication
3. **Checkout** - Product purchase flow
4. **Wallet** - Balance and transaction history
5. **Add Balance** - Top-up wallet
6. **My Orders** - Order history and tracking
7. **Notifications** - System notifications
8. **Security** - Account security settings
9. **About Us** - Company information
10. **API Documentation** - API endpoints guide
11. **Support** - Ticket support system
12. **Payment Success** - Payment confirmation

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Payment**: Stripe
- **Authentication**: Supabase Auth

## Project Structure

```
src/
├── components/
│   ├── layouts/        # Header, Footer
│   ├── common/         # RouteGuard
│   └── ui/            # shadcn/ui components
├── contexts/          # AuthContext
├── db/               # Database API layer
├── hooks/            # Custom hooks (useTheme, useToast)
├── pages/            # All application pages
├── types/            # TypeScript types
└── lib/              # Utilities

supabase/
└── functions/        # Edge Functions
    ├── create_stripe_checkout/
    └── verify_stripe_payment/
```

## Important Notes

1. **Stripe is Optional for Testing**: You can test all features except payment without Stripe configuration
2. **Admin Access**: First user to register gets admin role automatically
3. **Sample Data**: Database includes 30+ sample products across all categories
4. **Dark Mode**: Theme preference is saved in localStorage
5. **Responsive**: Works on desktop, tablet, and mobile devices

## Support

If you encounter any issues:
1. Check that all dependencies are installed
2. Verify Supabase connection in browser console
3. For payment issues, ensure Stripe secret key is configured
4. Check browser console for any error messages

## Next Steps

After setup:
1. Register your first account (becomes admin)
2. Browse the product catalog
3. Configure Stripe to enable payments
4. Test the complete purchase flow
5. Explore admin features (if you're the first user)

Enjoy using Recharge Hub! 🚀
