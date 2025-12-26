# Language & Currency Settings - User Guide

## 🌍 Overview

Language and currency settings have been moved to your **Profile Settings** page for easier management. You can now change your preferred language and currency from one convenient location.

---

## 📍 Where to Find Settings

### Location
**Profile Settings → Preferences Tab**

### How to Access
1. Click on your profile icon in the header
2. Select "Profile Settings" from the dropdown
3. Click on the "Preferences" tab
4. You'll see Language and Currency options

---

## 🗣️ Language Settings

### Supported Languages (20)

| Language | Native Name |
|----------|-------------|
| English | English |
| Arabic | العربية |
| Spanish | Español |
| French | Français |
| German | Deutsch |
| Italian | Italiano |
| Portuguese | Português |
| Russian | Русский |
| Chinese | 中文 |
| Japanese | 日本語 |
| Korean | 한국어 |
| Hindi | हिन्दी |
| Turkish | Türkçe |
| Dutch | Nederlands |
| Polish | Polski |
| Swedish | Svenska |
| Indonesian | Bahasa Indonesia |
| Thai | ไทย |
| Vietnamese | Tiếng Việt |
| Hebrew | עברית |

### How to Change Language

1. Go to **Profile Settings → Preferences**
2. Find the **Language** dropdown
3. Click to open the list of languages
4. Select your preferred language
5. The interface will update immediately
6. Your preference is saved automatically

### RTL Support

Arabic and Hebrew languages automatically switch the interface to **Right-to-Left (RTL)** layout for better readability.

---

## 💰 Currency Settings

### Supported Currencies (20)

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

### How to Change Currency

1. Go to **Profile Settings → Preferences**
2. Find the **Currency** dropdown
3. Click to open the list of currencies
4. Select your preferred currency
5. All prices will update immediately
6. Your preference is saved automatically

### Currency Conversion

- All prices are stored in **USD** (base currency)
- Prices are automatically converted to your selected currency
- Exchange rates are updated regularly
- Conversion is accurate and real-time

---

## ⚙️ How It Works

### Automatic Saving

Your language and currency preferences are:
- ✅ Saved to your account automatically
- ✅ Applied immediately when you change them
- ✅ Synced across all your devices
- ✅ Persistent across sessions

### For Logged-In Users

When you're logged in:
- Preferences are saved to the database
- They sync across all devices
- They persist even if you clear browser data
- They're loaded automatically on login

### For Guest Users

If you're not logged in:
- Preferences are saved to browser localStorage
- They persist on the same device
- They're lost if you clear browser data
- They don't sync across devices

---

## 🎯 Current Settings Display

The Preferences tab shows your current settings:

```
Current Settings
├── Language: [Your selected language]
└── Currency: [Your selected currency symbol and code]
```

This helps you quickly see what's currently active.

---

## 📱 Mobile Experience

The language and currency settings work perfectly on mobile:
- ✅ Touch-friendly dropdowns
- ✅ Scrollable lists
- ✅ Responsive design
- ✅ Fast switching
- ✅ RTL support on mobile

---

## 🔄 Switching Between Languages

### What Happens When You Change Language

1. **Immediate Update**: The entire interface updates instantly
2. **RTL Switch**: If you select Arabic or Hebrew, layout switches to RTL
3. **Database Save**: Your preference is saved to your account
4. **Notification**: You see a success message
5. **Persistence**: The language stays selected on all devices

### What Gets Translated

- ✅ Navigation menus
- ✅ Button labels
- ✅ Form fields
- ✅ Error messages
- ✅ Success messages
- ✅ Page titles
- ✅ Descriptions
- ✅ Notifications
- ✅ Tooltips
- ✅ Help text

### What Doesn't Get Translated

- ❌ User-generated content (usernames, comments, etc.)
- ❌ Product names (unless specifically translated)
- ❌ Some technical terms

---

## 💱 Currency Conversion Details

### How Prices Are Converted

1. **Base Price**: All products have a price in USD
2. **Exchange Rate**: System loads current exchange rate
3. **Conversion**: Price × Exchange Rate = Your Currency Price
4. **Display**: Shows with your currency symbol

### Example

```
Product Price: $100 USD
Your Currency: EUR (€)
Exchange Rate: 0.92
Converted Price: €92.00
```

### Exchange Rate Updates

- Exchange rates are updated regularly
- Rates are stored in the database
- Historical rates are tracked
- Admins can update rates manually

---

## 🛠️ Troubleshooting

### Language Not Changing?

**Solution:**
1. Refresh the page
2. Clear browser cache
3. Log out and log back in
4. Check if you're logged in (preferences save better when logged in)

### Currency Not Converting?

**Solution:**
1. Check if currency is active in the system
2. Refresh the page
3. Clear browser cache
4. Contact support if issue persists

### RTL Layout Issues?

**Solution:**
1. Refresh the page after selecting Arabic/Hebrew
2. Clear browser cache
3. Try a different browser
4. Report the issue to support

### Preferences Not Saving?

**Solution:**
1. Make sure you're logged in
2. Check your internet connection
3. Try again after a few seconds
4. Contact support if issue persists

---

## 💡 Tips & Best Practices

### For Best Experience

1. **Log In**: Always log in to save preferences across devices
2. **Update Regularly**: Check for new languages/currencies
3. **Test Prices**: Verify currency conversion is correct
4. **Report Issues**: Let us know if translations are incorrect

### For Multiple Devices

1. **Same Account**: Use the same account on all devices
2. **Auto-Sync**: Preferences sync automatically
3. **Wait a Moment**: Give it a few seconds to sync
4. **Refresh**: Refresh the page if needed

---

## 🎨 Visual Guide

### Preferences Tab Layout

```
┌─────────────────────────────────────┐
│ Language & Currency                 │
├─────────────────────────────────────┤
│                                     │
│ 🌐 Language                         │
│ [Dropdown: Select language]         │
│ Select your preferred language      │
│                                     │
│ ─────────────────────────────────   │
│                                     │
│ 💰 Currency                         │
│ [Dropdown: Select currency]         │
│ All prices will be displayed in     │
│ your selected currency              │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Current Settings                │ │
│ │ Language: English               │ │
│ │ Currency: $ USD                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ⚠️ Your preferences are saved       │
│    automatically                    │
└─────────────────────────────────────┘
```

---

## 📊 Statistics

### Most Popular Languages

1. English (en)
2. Arabic (ar)
3. Spanish (es)
4. French (fr)
5. German (de)

### Most Popular Currencies

1. US Dollar (USD)
2. Euro (EUR)
3. British Pound (GBP)
4. Saudi Riyal (SAR)
5. UAE Dirham (AED)

---

## 🔐 Privacy & Security

### Your Data

- Language preference is stored in your account
- Currency preference is stored in your account
- No sensitive data is collected
- Preferences can be changed anytime
- Data is encrypted in transit and at rest

### Sharing

- Your language/currency preferences are private
- They're not shared with other users
- They're not used for advertising
- They're only used to personalize your experience

---

## 📞 Need Help?

### Contact Support

If you have issues with language or currency settings:

1. **Check Documentation**: Read this guide first
2. **Try Troubleshooting**: Follow troubleshooting steps
3. **Contact Support**: Use the support ticket system
4. **Provide Details**: Include screenshots and error messages

### Common Questions

**Q: Can I use multiple languages?**
A: You can switch between languages anytime, but only one is active at a time.

**Q: Are all features translated?**
A: Most features are translated. Some technical terms may remain in English.

**Q: Can I suggest a new language?**
A: Yes! Contact support to request new languages.

**Q: Are exchange rates accurate?**
A: Yes, exchange rates are updated regularly from reliable sources.

**Q: Can I see prices in multiple currencies?**
A: You can only view prices in one currency at a time, but you can switch anytime.

---

## ✅ Summary

**Location**: Profile Settings → Preferences Tab

**Languages**: 20 supported languages with RTL support

**Currencies**: 20 supported currencies with real-time conversion

**Saving**: Automatic saving to database (when logged in)

**Syncing**: Automatic syncing across all devices

**Experience**: Seamless and instant updates

---

**Enjoy using Recharge Hub in your preferred language and currency!** 🌍💰

---

*Last Updated: December 27, 2025*
*Version: 2.0.0*
