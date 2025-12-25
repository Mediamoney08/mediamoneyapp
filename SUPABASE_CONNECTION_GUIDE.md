# Supabase Connection Guide

## Overview

Your Recharge Hub application is now connected to Supabase with multiple import options for flexibility and convenience.

---

## ✅ Supabase Client Files Created

### Primary File (Main Configuration)
- **Location**: `src/db/supabase.ts`
- **Purpose**: Main Supabase client configuration
- **Features**:
  - Environment variable validation
  - Type-safe database client
  - Auto-refresh tokens
  - Session persistence
  - Comprehensive documentation

### Alternative Import Locations

1. **`src/lib/supabase.ts`**
   - Re-exports from main client
   - For lib-based imports
   
2. **`src/supabase.ts`**
   - Re-exports from main client
   - For root-level imports
   
3. **`src/lib/supabaseClient.ts`**
   - Re-exports with multiple names
   - Supports both `supabase` and `supabaseClient` naming

4. **`src/types/database.types.ts`**
   - TypeScript types for database schema
   - Provides type safety for queries

---

## 📦 Import Options

You can now import the Supabase client using any of these methods:

### Option 1: From Database Directory (Recommended)
```typescript
import { supabase } from '@/db/supabase';
```

### Option 2: From Lib Directory
```typescript
import { supabase } from '@/lib/supabase';
```

### Option 3: From Root
```typescript
import { supabase } from '@/supabase';
```

### Option 4: Using Client Naming
```typescript
import { supabaseClient } from '@/lib/supabaseClient';
// or
import supabaseClient from '@/lib/supabaseClient';
```

### Option 5: Default Import
```typescript
import supabase from '@/db/supabase';
```

---

## 🔧 Configuration

### Environment Variables

Your Supabase connection requires these environment variables in `.env`:

```env
VITE_SUPABASE_URL=https://ufaljqeldjuquuazubam.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Current Configuration

✅ **URL**: `https://ufaljqeldjuquuazubam.supabase.co`  
✅ **Anon Key**: Configured in `.env`  
✅ **Auto-refresh**: Enabled  
✅ **Session Persistence**: Enabled  
✅ **Session Detection**: Enabled  

---

## 🎯 Usage Examples

### Authentication

```typescript
import { supabase } from '@/db/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### Database Queries

```typescript
import { supabase } from '@/db/supabase';

// Select data
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'game');

// Insert data
const { data, error } = await supabase
  .from('orders')
  .insert({
    user_id: userId,
    product_id: productId,
    amount: 10.00,
  });

// Update data
const { data, error } = await supabase
  .from('profiles')
  .update({ username: 'newname' })
  .eq('id', userId);

// Delete data
const { data, error } = await supabase
  .from('orders')
  .delete()
  .eq('id', orderId);
```

### Storage Operations

```typescript
import { supabase } from '@/db/supabase';

// Upload file
const { data, error } = await supabase.storage
  .from('payment-proofs')
  .upload(`${userId}/${fileName}`, file);

// Get public URL
const { data } = supabase.storage
  .from('payment-proofs')
  .getPublicUrl(filePath);

// Download file
const { data, error } = await supabase.storage
  .from('payment-proofs')
  .download(filePath);

// Delete file
const { data, error } = await supabase.storage
  .from('payment-proofs')
  .remove([filePath]);
```

### Edge Functions

```typescript
import { supabase } from '@/db/supabase';

// Invoke edge function
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { key: 'value' },
});
```

---

## 🏗️ File Structure

```
src/
├── db/
│   ├── supabase.ts          ← Primary client (main configuration)
│   └── api.ts               ← API functions using supabase client
├── lib/
│   ├── supabase.ts          ← Alternative import (re-export)
│   └── supabaseClient.ts    ← Alternative naming (re-export)
├── types/
│   └── database.types.ts    ← Database type definitions
└── supabase.ts              ← Root-level import (re-export)
```

---

## 🔐 Security Features

### Environment Variable Validation
The main client validates that required environment variables are present:

```typescript
if (!supabaseUrl) {
  throw new Error("Missing environment variable: VITE_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: VITE_SUPABASE_ANON_KEY");
}
```

### Type Safety
The client is configured with TypeScript types for compile-time safety:

```typescript
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  // configuration
});
```

### Authentication Options
- ✅ Auto-refresh tokens
- ✅ Persistent sessions
- ✅ Session URL detection
- ✅ Secure cookie storage

---

## 📊 Current Usage in Application

The Supabase client is currently used in:

### Authentication
- `src/contexts/AuthContext.tsx` - User authentication management

### Database Operations
- `src/db/api.ts` - All database queries and mutations

### File Uploads
- `src/pages/AddBalancePage.tsx` - Payment proof uploads
- `src/hooks/use-supabase-upload.ts` - Upload hook

### Pages
- All protected pages use authentication
- Admin pages use database queries
- User pages use wallet and order queries

---

## 🧪 Testing Connection

### Test 1: Check Environment Variables
```typescript
import { supabase } from '@/db/supabase';

console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Client initialized:', !!supabase);
```

### Test 2: Test Authentication
```typescript
import { supabase } from '@/db/supabase';

const { data, error } = await supabase.auth.getSession();
console.log('Session:', data.session);
```

### Test 3: Test Database Query
```typescript
import { supabase } from '@/db/supabase';

const { data, error } = await supabase
  .from('categories')
  .select('*')
  .limit(1);

console.log('Query result:', data);
```

---

## 🔄 Migration from Other Patterns

If you have existing code using different import patterns, here's how to migrate:

### From Direct createClient Calls
```typescript
// Before
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);

// After
import { supabase } from '@/db/supabase';
```

### From Different File Locations
```typescript
// Before
import { supabase } from '../../../db/supabase';

// After
import { supabase } from '@/db/supabase';
```

### From Different Naming
```typescript
// Before
import { client } from './supabase';

// After
import { supabase } from '@/db/supabase';
// or
import { supabaseClient } from '@/lib/supabaseClient';
```

---

## 📚 Additional Resources

### Supabase Documentation
- [JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Authentication](https://supabase.com/docs/guides/auth)
- [Database](https://supabase.com/docs/guides/database)
- [Storage](https://supabase.com/docs/guides/storage)
- [Edge Functions](https://supabase.com/docs/guides/functions)

### TypeScript Support
- [Type Generation](https://supabase.com/docs/guides/api/generating-types)
- [TypeScript Guide](https://supabase.com/docs/guides/api/typescript-support)

### Best Practices
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Performance](https://supabase.com/docs/guides/database/performance)
- [Security](https://supabase.com/docs/guides/platform/security)

---

## ✅ Verification Checklist

- [x] Primary client created at `src/db/supabase.ts`
- [x] Alternative imports created for flexibility
- [x] Environment variables configured
- [x] Type definitions created
- [x] Validation added for required variables
- [x] Authentication options configured
- [x] Documentation provided
- [x] Usage examples included
- [x] Security features implemented
- [x] Currently used in application

---

## 🎉 Summary

Your Supabase connection is now fully configured with:

✅ **Multiple Import Options**: 5 different ways to import  
✅ **Type Safety**: TypeScript types for database  
✅ **Environment Validation**: Checks for required variables  
✅ **Security**: Auto-refresh, session persistence  
✅ **Documentation**: Comprehensive usage guide  
✅ **Flexibility**: Choose your preferred import style  

**Your application is connected to Supabase and ready to use!**

---

**Last Updated**: 2025-12-25  
**Supabase Project**: ufaljqeldjuquuazubam  
**Status**: ✅ Connected and Configured
