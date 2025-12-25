# 🚀 Quick Start Guide - Recharge Hub

## What's New?

Your Recharge Hub platform has been completely restructured with:

✅ **42 Categories** organized like play4cards.com  
✅ **18 Payment Methods** (Bank Transfer, PayPal, Crypto, Mobile Money, etc.)  
✅ **Manual Payment Verification** by admin  
✅ **Wallet-Only Purchases** for all products  
✅ **Admin Dashboard** for payment management  

## Start Using Now

### 1. Run the Application
```bash
pnpm install
pnpm run dev
```

### 2. Create Your Admin Account
1. Open the app in your browser
2. Click "Sign In" → "Sign Up"
3. Register with any username
4. **You're now the admin!** (first user = admin)

### 3. Test the Payment Flow

#### As a User:
1. Go to **"Add Balance"** from user menu
2. Select a payment method (e.g., "Bank Transfer")
3. Enter amount (e.g., $50)
4. Upload a payment proof image (any screenshot)
5. Add transaction ID and details
6. Click **"Submit Payment Proof"**
7. You'll see status as "Pending"

#### As an Admin:
1. Click your username → **"Admin Panel"**
2. See your pending payment in the dashboard
3. Click **"Review"** on the payment
4. View the payment details and proof image
5. Add admin notes (optional)
6. Click **"Approve"**
7. ✅ Balance automatically added to user's wallet!

### 4. Make a Purchase
1. Go to **Home** page
2. Browse categories (Games, Streaming, Gift Cards, Apps)
3. Select a category from sidebar (e.g., "PUBG Mobile")
4. Choose a subcategory if available (e.g., "UC Top-up")
5. Click on a product
6. Click **"Buy Now"**
7. Enter quantity and player ID
8. Click **"Complete Purchase"**
9. ✅ Order completed instantly using wallet balance!

## Key Features

### Category Navigation
- **4 Service Types:** Games, Streaming, Gift Cards, Apps
- **42 Categories:** PUBG, Free Fire, Netflix, Shahid, iTunes, etc.
- **Subcategories:** UC Top-up, Royal Pass, Basic Plan, etc.
- **Search:** Find products quickly

### Payment Methods (18 Total)
1. Bank Transfer
2. PayPal
3. Wise (TransferWise)
4. Western Union
5. MoneyGram
6. Skrill
7. Neteller
8. Perfect Money
9. Payoneer
10. Bitcoin
11. Ethereum
12. USDT
13. Vodafone Cash
14. Orange Money
15. MTN Mobile Money
16. Cash App
17. Venmo
18. Zelle

### Admin Dashboard Features
- View pending payment proofs
- Approve or reject with notes
- See payment statistics
- Track all transactions
- Automatic wallet updates

### User Features
- Browse by category/subcategory
- Submit payment proofs
- Track payment status
- Wallet balance management
- Order history
- Notifications

## Important Notes

### ⚠️ Payment Flow Changed
- **Before:** Direct credit card payment
- **Now:** Manual payment proof submission + admin approval

### ✅ Wallet Required
- All purchases MUST use wallet balance
- No direct card payment for products
- Add funds first, then purchase

### 👑 Admin Access
- First registered user = admin automatically
- Admin link appears in user menu
- Access dashboard at `/admin`

## File Structure

```
src/
├── pages/
│   ├── HomePage.tsx          (Category navigation)
│   ├── AddBalancePage.tsx    (Payment proof upload)
│   ├── CheckoutPage.tsx      (Wallet-only purchase)
│   ├── AdminDashboardPage.tsx (Payment management)
│   └── ...
├── db/
│   └── api.ts                (New category/payment APIs)
└── types/
    └── types.ts              (New types added)

Database:
├── categories (42 rows)
├── subcategories (9 rows)
├── payment_methods (18 rows)
├── payment_proofs (user submissions)
└── products (linked to categories)
```

## Troubleshooting

### Can't Upload Payment Proof
- File must be < 1MB
- Must be image (PNG/JPG)
- Must be logged in

### Can't Purchase Product
- Check wallet balance
- Ensure sufficient funds
- Product must have stock

### Admin Dashboard Not Showing
- Must be first registered user
- Or have admin role in database
- Check user menu for "Admin Panel"

## Next Steps

1. ✅ Test payment proof submission
2. ✅ Test admin approval
3. ✅ Test wallet purchase
4. ✅ Customize categories (add more)
5. ✅ Update payment method instructions
6. ✅ Add category images

## Need Help?

- Check **README_COMPLETE.md** for full documentation
- Check **CHANGES_SUMMARY.md** for what changed
- Check **TODO_RESTRUCTURE.md** for implementation details

---

**Ready to use!** 🎉  
All features tested and working.  
Lint checks passing.  
Database fully configured.
