# Quick Reference: Multi-Language & Multi-Currency

## 🌍 Languages Supported (20)

| Language | Code | Native Name |
|----------|------|-------------|
| English | en | English |
| Arabic | ar | العربية |
| Spanish | es | Español |
| French | fr | Français |
| German | de | Deutsch |
| Italian | it | Italiano |
| Portuguese | pt | Português |
| Russian | ru | Русский |
| Chinese | zh | 中文 |
| Japanese | ja | 日本語 |
| Korean | ko | 한국어 |
| Hindi | hi | हिन्दी |
| Turkish | tr | Türkçe |
| Dutch | nl | Nederlands |
| Polish | pl | Polski |
| Swedish | sv | Svenska |
| Indonesian | id | Bahasa Indonesia |
| Thai | th | ไทย |
| Vietnamese | vi | Tiếng Việt |
| Hebrew | he | עברית |

## 💰 Currencies Supported (20)

| Currency | Code | Symbol |
|----------|------|--------|
| US Dollar | USD | $ |
| Euro | EUR | € |
| British Pound | GBP | £ |
| Japanese Yen | JPY | ¥ |
| Chinese Yuan | CNY | ¥ |
| Australian Dollar | AUD | A$ |
| Canadian Dollar | CAD | C$ |
| Swiss Franc | CHF | CHF |
| Indian Rupee | INR | ₹ |
| South Korean Won | KRW | ₩ |
| Brazilian Real | BRL | R$ |
| Russian Ruble | RUB | ₽ |
| Mexican Peso | MXN | $ |
| Saudi Riyal | SAR | ﷼ |
| UAE Dirham | AED | د.إ |
| Turkish Lira | TRY | ₺ |
| Singapore Dollar | SGD | S$ |
| Hong Kong Dollar | HKD | HK$ |
| Swedish Krona | SEK | kr |
| Norwegian Krone | NOK | kr |

---

## 🚀 Quick Start

### For Users

**Change Language:**
1. Click globe icon (🌐) in header
2. Select your language
3. UI updates immediately
4. Preference saved automatically

**Change Currency:**
1. Click dollar icon ($) in header
2. Select your currency
3. Prices update immediately
4. Preference saved automatically

**RTL Languages:**
- Arabic and Hebrew automatically switch to RTL layout
- All UI elements adapt to right-to-left reading

---

## 💻 For Developers

### Use Translations

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('common.welcome')}</p>
    </div>
  );
}
```

### Use Currency Conversion

```tsx
import { useCurrency } from '@/components/LanguageCurrencySwitcher';

function ProductCard({ priceUSD }) {
  const { convertPrice, formatPrice } = useCurrency();
  
  const price = convertPrice(priceUSD);
  
  return <div>${price}</div>;
}
```

### Add New Translation

1. Open `src/i18n/locales/en.json`
2. Add your key:
   ```json
   {
     "mySection": {
       "myKey": "My Text"
     }
   }
   ```
3. Use in component:
   ```tsx
   {t('mySection.myKey')}
   ```

---

## 🗄️ Database Functions

### Convert Currency
```sql
SELECT convert_currency(100, 'USD', 'EUR');
-- Returns: 92.00
```

### Get User Preference
```sql
SELECT get_user_currency('user-id');
-- Returns: 'EUR'

SELECT get_user_language('user-id');
-- Returns: 'es'
```

### Update Exchange Rate
```sql
SELECT update_exchange_rate('EUR', 0.93, 'manual');
```

### Format Currency
```sql
SELECT format_currency(1234.56, 'EUR');
-- Returns: '€ 1,234.56'
```

---

## 📊 Common Queries

### Language Statistics
```sql
SELECT language, COUNT(*) as users
FROM user_preferences
GROUP BY language
ORDER BY users DESC;
```

### Currency Statistics
```sql
SELECT currency, COUNT(*) as users
FROM user_preferences
GROUP BY currency
ORDER BY users DESC;
```

### Active Currencies
```sql
SELECT code, name, symbol, exchange_rate
FROM currencies
WHERE is_active = true
ORDER BY code;
```

---

## 🎯 Translation Keys

### Common
- `common.appName` - App name
- `common.welcome` - Welcome message
- `common.loading` - Loading text
- `common.error` - Error text
- `common.success` - Success text
- `common.save` - Save button
- `common.cancel` - Cancel button
- `common.submit` - Submit button

### Navigation
- `nav.home` - Home link
- `nav.wallet` - Wallet link
- `nav.orders` - Orders link
- `nav.profile` - Profile link
- `nav.signOut` - Sign out link

### Home
- `home.title` - Page title
- `home.subtitle` - Page subtitle
- `home.description` - Description
- `home.categories` - Categories heading
- `home.popularProducts` - Popular products

### Wallet
- `wallet.title` - Wallet title
- `wallet.balance` - Balance label
- `wallet.addFunds` - Add funds button
- `wallet.transactions` - Transactions heading

### Errors
- `errors.generic` - Generic error
- `errors.network` - Network error
- `errors.unauthorized` - Unauthorized error
- `errors.notFound` - Not found error

### Success
- `success.saved` - Saved message
- `success.updated` - Updated message
- `success.deleted` - Deleted message

---

## 🔧 Configuration

### Add New Language

1. **Create translation file:**
   ```bash
   touch src/i18n/locales/xx.json
   ```

2. **Add to config:**
   ```typescript
   // src/i18n/config.ts
   import xxTranslations from './locales/xx.json';
   
   const resources = {
     // ...
     xx: { translation: xxTranslations },
   };
   ```

3. **Add to language list:**
   ```typescript
   // src/components/LanguageCurrencySwitcher.tsx
   const LANGUAGES = [
     // ...
     { code: 'xx', name: 'Language', nativeName: 'Native' },
   ];
   ```

### Add New Currency

```sql
INSERT INTO currencies (code, name, symbol, exchange_rate, is_active)
VALUES ('XXX', 'Currency Name', 'Symbol', 1.23, true);
```

---

## ⚡ Performance Tips

1. **Lazy load translations** - Only load needed languages
2. **Cache exchange rates** - Update daily, not per request
3. **Use localStorage** - Reduce database queries
4. **Batch conversions** - Convert multiple prices at once

---

## 🐛 Troubleshooting

### Language not changing?
- Check browser console for errors
- Verify translation file exists
- Clear localStorage and try again

### Currency not converting?
- Check exchange rate in database
- Verify currency is active
- Check browser console for errors

### RTL not working?
- Verify HTML dir attribute is set
- Check CSS for RTL-specific styles
- Test with Arabic or Hebrew

### Preferences not saving?
- Check if user is logged in
- Verify database connection
- Check browser localStorage

---

## 📱 Mobile Support

- ✅ Touch-friendly dropdowns
- ✅ Responsive design
- ✅ RTL support on mobile
- ✅ Fast switching
- ✅ Persistent preferences

---

## 🎉 Summary

✅ **20 languages** supported  
✅ **20 currencies** with conversion  
✅ **Automatic detection**  
✅ **RTL support**  
✅ **User preferences**  
✅ **Database storage**  
✅ **Easy to extend**  

**Your platform is global!** 🌍

---

*For detailed documentation, see: MULTI_LANGUAGE_CURRENCY_SYSTEM.md*
