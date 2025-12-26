# How to Access and Edit Admin Dashboard

## 🎯 Quick Start Guide

### Step 1: Set Up Admin User

1. **Open Supabase Dashboard**
   - Go to your Supabase project: https://supabase.com/dashboard
   - Navigate to your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run Setup Script**
   - Open the file: `setup-admin-user.sql`
   - Copy the SQL commands
   - Paste into Supabase SQL Editor
   - Follow the steps in the script

4. **Quick Method** (Recommended for first-time setup):
   ```sql
   -- Make the first registered user an admin
   UPDATE profiles 
   SET role = 'admin' 
   WHERE user_id = (
     SELECT id 
     FROM auth.users 
     ORDER BY created_at ASC 
     LIMIT 1
   );
   ```

5. **Verify**:
   ```sql
   SELECT * FROM profiles WHERE role = 'admin';
   ```

---

### Step 2: Access the Admin Dashboard

1. **Start the Development Server**
   ```bash
   cd /workspace/app-8herke1wtngh
   npm run dev
   ```

2. **Open Your Browser**
   - Navigate to: `http://localhost:5173`

3. **Login**
   - Click "Login" in the header
   - Enter your admin credentials
   - Click "Sign In"

4. **Access Admin Dashboard**
   
   **Method A: User Menu**
   - Click your profile icon (top right)
   - Click "Payment Approvals" or "Admin Management"
   
   **Method B: Direct URL**
   - Navigate to: `http://localhost:5173/admin`

---

## 📊 What You'll See

### Admin Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  Admin Dashboard                                         │
│  Manage your recharge hub platform                       │
├─────────────────────────────────────────────────────────┤
│  [Overview] [Users] [Orders] [Subscriptions] [Drip-feed]│
│  [Refill] [Services] [Payments] [Tickets] [Affiliates]  │
│  [Child Panels] [Security] [System] [Updates] [Reports] │
│  [Appearance] [Settings]                                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Tab Content Area]                                      │
│  - Statistics cards                                      │
│  - Data tables                                           │
│  - Management forms                                      │
│  - Action buttons                                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 17 Main Tabs

1. **Overview** - Dashboard statistics and metrics
2. **Users** - User management and profiles
3. **Orders** - Order processing and tracking
4. **Subscriptions** - Recurring subscription management
5. **Drip-feed** - Gradual delivery system
6. **Refill** - Automatic refill management
7. **Services** - Service catalog management
8. **Payments** - Payment verification and approval
9. **Tickets** - Customer support tickets
10. **Affiliates** - Affiliate program management
11. **Child Panels** - Sub-panel management
12. **Security** - Security settings and monitoring
13. **System** - System health and monitoring
14. **Updates** - Announcements and updates
15. **Reports** - Analytics and reports
16. **Appearance** - Theme customization
17. **Settings** - Detailed configuration

---

## ✏️ How to Edit Admin Dashboard

### Option 1: Edit Existing Components

Each admin component is located in: `src/components/admin/`

**Example: Edit Dashboard Overview**

1. **Open the file**:
   ```bash
   src/components/admin/DashboardOverview.tsx
   ```

2. **Make your changes**:
   - Modify statistics cards
   - Change chart configurations
   - Update layout
   - Add new metrics

3. **Save and see changes**:
   - Changes appear instantly (hot reload)
   - No need to restart server

**Example: Edit User Management**

1. **Open the file**:
   ```bash
   src/components/admin/UserManagement.tsx
   ```

2. **Possible edits**:
   - Add new columns to user table
   - Add bulk actions
   - Modify user filters
   - Change user details display

---

### Option 2: Add New Admin Features

**Example: Add a new "Analytics" section to Overview**

1. **Edit DashboardOverview.tsx**:
   ```tsx
   // Add new analytics card
   <Card>
     <CardHeader>
       <CardTitle>Advanced Analytics</CardTitle>
     </CardHeader>
     <CardContent>
       {/* Your analytics content */}
     </CardContent>
   </Card>
   ```

2. **Add new data fetching**:
   ```tsx
   const [analyticsData, setAnalyticsData] = useState(null);
   
   useEffect(() => {
     fetchAnalytics();
   }, []);
   
   const fetchAnalytics = async () => {
     // Fetch your data
   };
   ```

---

### Option 3: Add New Admin Tab

**Example: Add a "Marketing" tab**

1. **Create new component**:
   ```bash
   src/components/admin/MarketingManagement.tsx
   ```

2. **Edit AdminDashboard.tsx**:
   ```tsx
   // Import the component
   import MarketingManagement from '@/components/admin/MarketingManagement';
   
   // Add to imports section
   import { Megaphone } from 'lucide-react';
   
   // Add tab trigger
   <TabsTrigger value="marketing" className="flex items-center gap-2">
     <Megaphone className="h-4 w-4" />
     <span className="hidden sm:inline">Marketing</span>
   </TabsTrigger>
   
   // Add tab content
   <TabsContent value="marketing" className="space-y-6">
     <MarketingManagement />
   </TabsContent>
   ```

---

### Option 4: Customize Layout

**Change Tab Layout**:

Edit `src/pages/AdminDashboard.tsx`:

```tsx
// Change from horizontal tabs to vertical sidebar
<div className="flex gap-6">
  <aside className="w-64">
    <TabsList className="flex flex-col">
      {/* Tabs here */}
    </TabsList>
  </aside>
  <main className="flex-1">
    {/* Tab content here */}
  </main>
</div>
```

**Change Color Scheme**:

Edit `src/index.css`:

```css
/* Customize admin dashboard colors */
.admin-dashboard {
  --admin-primary: 220 90% 56%;
  --admin-secondary: 280 80% 60%;
}
```

---

## 🎨 Common Customizations

### 1. Change Statistics Cards

**File**: `src/components/admin/DashboardOverview.tsx`

```tsx
// Add new stat card
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">
      New Metric
    </CardTitle>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$12,345</div>
    <p className="text-xs text-muted-foreground">
      +20% from last month
    </p>
  </CardContent>
</Card>
```

### 2. Modify Data Tables

**File**: Any admin component with tables

```tsx
// Add new column
const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'New Column', accessor: 'new_field' }, // Add this
];

// Add action buttons
<Button onClick={() => handleCustomAction(row)}>
  Custom Action
</Button>
```

### 3. Add Charts

**Install chart library** (if needed):
```bash
pnpm add recharts
```

**Add to component**:
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<LineChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="value" stroke="#8884d8" />
</LineChart>
```

### 4. Add Filters

```tsx
const [filter, setFilter] = useState('all');

<Select value={filter} onValueChange={setFilter}>
  <SelectTrigger>
    <SelectValue placeholder="Filter by..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
  </SelectContent>
</Select>
```

### 5. Add Search

```tsx
const [searchTerm, setSearchTerm] = useState('');

<Input
  placeholder="Search..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

// Filter data
const filteredData = data.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

---

## 🔧 Advanced Editing

### Add New Database Table Management

1. **Create database table** (Supabase):
   ```sql
   CREATE TABLE promotions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title TEXT NOT NULL,
     discount_percentage INTEGER,
     start_date TIMESTAMP,
     end_date TIMESTAMP,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **Add API functions** (`src/db/api.ts`):
   ```tsx
   export const getPromotions = async () => {
     const { data, error } = await supabase
       .from('promotions')
       .select('*')
       .order('created_at', { ascending: false });
     
     if (error) throw error;
     return data;
   };
   
   export const createPromotion = async (promotion: any) => {
     const { data, error } = await supabase
       .from('promotions')
       .insert([promotion])
       .select()
       .single();
     
     if (error) throw error;
     return data;
   };
   ```

3. **Create admin component** (`src/components/admin/PromotionsManagement.tsx`):
   ```tsx
   import { useState, useEffect } from 'react';
   import { getPromotions, createPromotion } from '@/db/api';
   
   export default function PromotionsManagement() {
     const [promotions, setPromotions] = useState([]);
     
     useEffect(() => {
       loadPromotions();
     }, []);
     
     const loadPromotions = async () => {
       const data = await getPromotions();
       setPromotions(data);
     };
     
     return (
       <div>
         <h2>Promotions Management</h2>
         {/* Your UI here */}
       </div>
     );
   }
   ```

4. **Add to admin dashboard**:
   - Import component
   - Add tab trigger
   - Add tab content

---

## 📝 Editing Checklist

Before editing, consider:

- [ ] What feature do you want to add/modify?
- [ ] Which component needs to be edited?
- [ ] Do you need new database tables?
- [ ] Do you need new API functions?
- [ ] Do you need new UI components?
- [ ] Will this affect other components?
- [ ] Do you need to update types?

---

## 🚀 Quick Edit Examples

### Example 1: Change Dashboard Title

**File**: `src/pages/AdminDashboard.tsx`

**Find**:
```tsx
<h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
```

**Change to**:
```tsx
<h1 className="text-3xl font-bold tracking-tight">Recharge Hub Control Panel</h1>
```

### Example 2: Add Welcome Message

**File**: `src/pages/AdminDashboard.tsx`

**Add after title**:
```tsx
<p className="text-muted-foreground">
  Welcome back, {profile?.username}! Here's what's happening today.
</p>
```

### Example 3: Change Tab Order

**File**: `src/pages/AdminDashboard.tsx`

**Reorder the TabsTrigger components** to change tab order

---

## 🎯 What Would You Like to Edit?

Tell me what you want to change, and I'll help you:

1. **Modify existing features** - Change how something looks or works
2. **Add new features** - Add new functionality to admin dashboard
3. **Remove features** - Remove tabs or components you don't need
4. **Customize layout** - Change the overall structure
5. **Add integrations** - Connect to external services
6. **Improve UI/UX** - Make it look better or easier to use

---

## 📞 Need Help?

Just tell me:
- What you want to see
- What you want to change
- What features you want to add

I'll make the changes for you!

---

*Ready to customize your admin dashboard? Let's do it!* 🚀
