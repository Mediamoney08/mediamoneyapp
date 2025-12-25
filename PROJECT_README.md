# Recharge Hub - Digital Recharge Services Platform

A comprehensive online platform for digital recharge services, offering game top-ups, app subscriptions, streaming service subscriptions (Netflix, Shahid, etc.), and gift cards.

## Features

### Core Features
- **Service Categories**: Game Recharge, App Recharge, Streaming Subscriptions, Gift Cards
- **User System**: Registration, login, personal wallet, order history, security settings
- **Payment Integration**: Secure Stripe payment processing with instant balance updates
- **Wallet System**: Personal wallet with balance top-up and transaction history
- **Order Management**: Real-time order tracking and payment verification
- **Notification System**: Order completion alerts, price updates, and system notifications
- **Support System**: Ticket-based customer support
- **API Documentation**: Complete API endpoints for integration

### Technical Features
- **Authentication**: Username/password authentication with role-based access control
- **Admin Panel**: First registered user becomes admin with full access
- **Dark/Light Mode**: Theme toggle with persistent preference
- **Responsive Design**: Desktop-first with mobile adaptation
- **Real-time Updates**: Automatic balance and order status updates
- **Secure Payments**: Stripe integration with PCI compliance

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Payment**: Stripe
- **Authentication**: Supabase Auth
- **Routing**: React Router v6

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- Stripe account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables (already set up in `.env`):
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. **Configure Stripe Secret Key** (REQUIRED for payments):
   
   You need to add your Stripe secret key to Supabase secrets:
   
   a. Get your Stripe secret key from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   
   b. Add it to Supabase using the Supabase CLI or Dashboard:
   ```bash
   # Using Supabase CLI
   supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here
   ```
   
   Or use the Supabase Dashboard:
   - Go to Project Settings > Edge Functions > Secrets
   - Add a new secret: `STRIPE_SECRET_KEY` with your Stripe secret key

5. Run the development server:
   ```bash
   pnpm run dev
   ```

## Database Schema

The application uses the following main tables:
- **profiles**: User profiles with wallet balance and role
- **products**: Digital products (games, subscriptions, gift cards)
- **orders**: Order records with payment status
- **wallet_transactions**: Transaction history
- **tickets**: Support tickets
- **notifications**: User notifications

## Payment Flow

1. User selects products and clicks "Buy Now"
2. System creates a Stripe checkout session via Edge Function
3. User is redirected to Stripe's hosted payment page
4. After payment, user is redirected to payment success page
5. System verifies payment and updates wallet balance
6. Notification is sent to user

## Admin Access

The first user to register will automatically be assigned the admin role. Admins have access to:
- Admin panel for user management
- View all orders and tickets
- Manage user roles
- Full system access

## API Endpoints

### Create Checkout Session
```
POST /functions/v1/create_stripe_checkout
```

### Verify Payment
```
POST /functions/v1/verify_stripe_payment
```

See the API Documentation page in the app for detailed information.

## Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication
- Encrypted passwords
- Secure payment processing via Stripe
- HTTPS-only communication

## Development

### Run Linter
```bash
pnpm run lint
```

### Build for Production
```bash
pnpm run build
```

## Important Notes

1. **Stripe Configuration**: Payment functionality requires `STRIPE_SECRET_KEY` to be configured in Supabase secrets
2. **First User**: The first registered user automatically becomes an admin
3. **Email Verification**: Disabled by default for easier testing
4. **Sample Data**: The database is pre-populated with sample products

## Support

For support, please use the in-app support ticket system or contact support@rechargehub.com

## License

© 2025 Recharge Hub. All rights reserved.
