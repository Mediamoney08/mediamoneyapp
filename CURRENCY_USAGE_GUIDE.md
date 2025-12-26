# Currency System - Usage Guide

## ✅ Currency System Fixed

The currency system is now fully functional with the following improvements:

### What Was Fixed

1. **Exchange Rate Conversion** - Properly converts DECIMAL to Number
2. **Currency Symbol** - Now included in the hook return value
3. **Synchronous formatPrice** - Changed from async to sync for better performance
4. **Error Handling** - Added fallback values for all currency operations
5. **Wallet Balance** - Now displays in user's selected currency

---

## 🎯 How to Use Currency Conversion

### Import the Hook

```typescript
import { useCurrency } from '@/components/LanguageCurrencySwitcher';
```

### Use in Your Component

```typescript
function ProductCard({ product }) {
  const { formatPrice, convertPrice, currencySymbol, currentCurrency } = useCurrency();
  
  return (
    <div>
      <h3>{product.name}</h3>
      {/* Display formatted price with symbol */}
      <p className="text-lg font-bold">
        {formatPrice(product.price_usd)}
      </p>
      
      {/* Or convert and display manually */}
      <p>
        {currencySymbol}{convertPrice(product.price_usd).toFixed(2)}
      </p>
      
      {/* Show currency code */}
      <p className="text-sm text-muted-foreground">
        Price in {currentCurrency}
      </p>
    </div>
  );
}
```

---

## 📊 Hook Return Values

### `useCurrency()` Returns:

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `currentCurrency` | string | Current currency code | "EUR" |
| `exchangeRate` | number | Exchange rate vs USD | 0.92 |
| `currencySymbol` | string | Currency symbol | "€" |
| `convertPrice` | function | Convert USD to current currency | `convertPrice(100)` → 92 |
| `formatPrice` | function | Format price with symbol | `formatPrice(100)` → "€92.00" |

---

## 💡 Usage Examples

### Example 1: Product Price Display

```typescript
import { useCurrency } from '@/components/LanguageCurrencySwitcher';

function ProductPrice({ priceUSD }: { priceUSD: number }) {
  const { formatPrice } = useCurrency();
  
  return (
    <div className="text-2xl font-bold text-primary">
      {formatPrice(priceUSD)}
    </div>
  );
}
```

### Example 2: Price Comparison

```typescript
function PriceComparison({ originalPrice, salePrice }) {
  const { formatPrice } = useCurrency();
  
  return (
    <div className="flex gap-2 items-center">
      <span className="line-through text-muted-foreground">
        {formatPrice(originalPrice)}
      </span>
      <span className="text-xl font-bold text-primary">
        {formatPrice(salePrice)}
      </span>
      <span className="text-sm text-green-600">
        Save {formatPrice(originalPrice - salePrice)}
      </span>
    </div>
  );
}
```

### Example 3: Shopping Cart Total

```typescript
function CartTotal({ items }) {
  const { formatPrice, currentCurrency } = useCurrency();
  
  const total = items.reduce((sum, item) => sum + item.price_usd * item.quantity, 0);
  
  return (
    <div className="border-t pt-4">
      <div className="flex justify-between text-lg font-bold">
        <span>Total ({currentCurrency})</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
```

### Example 4: Wallet Balance

```typescript
function WalletBalance({ balance }) {
  const { formatPrice, currencySymbol } = useCurrency();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {formatPrice(balance)}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Available balance in {currencySymbol}
        </p>
      </CardContent>
    </Card>
  );
}
```

### Example 5: Price Range Filter

```typescript
function PriceRangeFilter() {
  const { convertPrice, currencySymbol } = useCurrency();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  
  return (
    <div className="space-y-4">
      <Label>Price Range</Label>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={convertPrice(minPrice)}
          onChange={(e) => setMinPrice(Number(e.target.value) / exchangeRate)}
          placeholder="Min"
        />
        <span>-</span>
        <Input
          type="number"
          value={convertPrice(maxPrice)}
          onChange={(e) => setMaxPrice(Number(e.target.value) / exchangeRate)}
          placeholder="Max"
        />
        <span>{currencySymbol}</span>
      </div>
    </div>
  );
}
```

---

## 🔄 How Currency Conversion Works

### Flow Diagram

```
User Selects Currency (e.g., EUR)
    ↓
Saved to localStorage & Database
    ↓
Custom Event Dispatched
    ↓
useCurrency Hook Listens
    ↓
Loads Exchange Rate from Database
    ↓
Updates State (exchangeRate, currencySymbol)
    ↓
Components Re-render with New Prices
    ↓
Prices Displayed in Selected Currency
```

### Conversion Formula

```typescript
// All prices stored in USD (base currency)
const priceUSD = 100;

// Get exchange rate from database
const exchangeRate = 0.92; // EUR rate

// Convert to user's currency
const convertedPrice = priceUSD * exchangeRate;
// Result: 92 EUR

// Format with symbol
const formattedPrice = `€${convertedPrice.toFixed(2)}`;
// Result: "€92.00"
```

---

## 🎨 UI Components with Currency

### Price Badge

```typescript
function PriceBadge({ price, variant = "default" }) {
  const { formatPrice } = useCurrency();
  
  return (
    <Badge variant={variant} className="text-lg px-3 py-1">
      {formatPrice(price)}
    </Badge>
  );
}
```

### Price Card

```typescript
function PriceCard({ title, price, features }) {
  const { formatPrice } = useCurrency();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="text-3xl font-bold text-primary">
          {formatPrice(price)}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
```

---

## 🔧 Advanced Usage

### Listen to Currency Changes

```typescript
useEffect(() => {
  const handleCurrencyChange = (event: CustomEvent) => {
    console.log('Currency changed to:', event.detail);
    // Reload data, update prices, etc.
    loadProducts();
  };
  
  window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
  
  return () => {
    window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
  };
}, []);
```

### Manual Currency Conversion

```typescript
import { supabase } from '@/lib/supabase';

async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string) {
  const { data, error } = await supabase.rpc('convert_currency', {
    p_amount: amount,
    p_from_currency: fromCurrency,
    p_to_currency: toCurrency
  });
  
  if (error) throw error;
  return data;
}

// Usage
const eurAmount = await convertCurrency(100, 'USD', 'EUR');
console.log(eurAmount); // 92.00
```

---

## 📱 Profile Settings - Icon-Only Tabs

### New Tab Design

The profile settings tabs now use **icon-only** design for a cleaner look:

```
┌─────────────────────────────────────┐
│  👤   🌐   🔒   🛡️   📜            │
└─────────────────────────────────────┘
```

**Icons:**
- 👤 User Icon - Profile
- 🌐 Globe Icon - Preferences (Language & Currency)
- 🔒 Lock Icon - Security
- 🛡️ Shield Icon - 2FA
- 📜 History Icon - Activity

### Benefits

✅ Cleaner interface  
✅ More space for content  
✅ Universal understanding  
✅ Mobile-friendly  
✅ Modern design  

---

## ✅ Testing Checklist

### Currency Conversion
- [x] Load exchange rates from database
- [x] Convert prices correctly
- [x] Display currency symbol
- [x] Format prices with 2 decimals
- [x] Handle currency changes
- [x] Update wallet balance
- [x] Sync across components

### Profile Settings
- [x] Icon-only tabs display
- [x] Language selector works
- [x] Currency selector works
- [x] Preferences save to database
- [x] RTL support for Arabic/Hebrew
- [x] Mobile responsive

---

## 🎯 Summary

**Currency System:**
- ✅ Fully functional
- ✅ Real-time conversion
- ✅ Proper exchange rates
- ✅ Symbol display
- ✅ Error handling
- ✅ Wallet balance conversion

**Profile Settings:**
- ✅ Icon-only tabs
- ✅ Cleaner design
- ✅ Better UX
- ✅ Mobile-friendly

**Usage:**
- ✅ Simple hook: `useCurrency()`
- ✅ Easy formatting: `formatPrice(price)`
- ✅ Manual conversion: `convertPrice(price)`
- ✅ Currency info: `currencySymbol`, `currentCurrency`

---

**The currency system is now production-ready!** 💰✨

---

*Last Updated: December 27, 2025*
*Version: 3.0.0*
