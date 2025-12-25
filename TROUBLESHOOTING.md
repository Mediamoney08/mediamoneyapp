# Troubleshooting Guide

## Browser Cache Issues

If you encounter errors like:
```
Uncaught SyntaxError: The requested module '/src/db/api.ts' does not provide an export named 'getAllProducts'
```

This is a browser caching issue. The code is correct, but your browser is using an old cached version.

### Solution 1: Hard Refresh (Recommended)
- **Windows/Linux**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: Press `Cmd + Shift + R`

### Solution 2: Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Solution 3: Clear Site Data
1. Open Developer Tools (F12)
2. Go to Application tab
3. Click "Clear site data"
4. Refresh the page

### Solution 4: Restart Dev Server
```bash
# Stop the dev server (Ctrl+C)
# Then restart it
npm run dev
```

### Solution 5: Clear Vite Cache
```bash
# Remove Vite cache
rm -rf node_modules/.vite
# Restart dev server
npm run dev
```

## Common Issues

### Module Export Errors
If you see errors about missing exports, it's usually a cache issue. All exports in `/src/db/api.ts` are correct:
- ✅ `getAllProductsAdmin` (correct)
- ❌ `getAllProducts` (old, removed)

### TypeScript Errors
If TypeScript shows errors but the code runs fine, try:
1. Restart your IDE/editor
2. Run `npm run lint` to verify code is correct
3. Clear TypeScript cache in your editor

## Verification

To verify all exports are correct, run:
```bash
npm run lint
```

If lint passes with no errors, the code is correct and the issue is browser cache.
