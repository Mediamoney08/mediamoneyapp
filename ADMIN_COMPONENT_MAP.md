# Admin Dashboard Component Map

## 📂 Complete Component Structure

All admin components are located in: `src/components/admin/`

Total: **35 Admin Components**

---

## 🗺️ Component Organization by Tab

### Tab 1: Overview
**Component**: `DashboardOverview.tsx`
- Statistics cards (revenue, users, orders)
- Charts and graphs
- Quick action buttons
- Recent activity feed

**Edit to**:
- Add/remove statistics
- Change chart types
- Modify metrics
- Add custom widgets

---

### Tab 2: Users
**Component**: `UserManagement.tsx`
- User list table
- User details
- Wallet balance management
- Role assignment
- Account status control

**Edit to**:
- Add user filters
- Modify user table columns
- Add bulk actions
- Change user details form

---

### Tab 3: Orders
**Component**: `OrderManagement.tsx`
- Order list with status
- Order details view
- Status update controls
- Refund processing
- Order search and filters

**Edit to**:
- Add order filters
- Modify order table
- Add export functionality
- Change status workflow

---

### Tab 4: Subscriptions
**Component**: `SubscriptionsManagement.tsx`
- Active subscriptions list
- Subscription plans
- Renewal tracking
- Cancellation handling

**Edit to**:
- Add subscription types
- Modify billing cycles
- Add subscription analytics
- Change cancellation flow

---

### Tab 5: Drip-feed
**Component**: `DripFeedManagement.tsx`
- Drip-feed orders list
- Schedule configuration
- Progress tracking
- Speed adjustment

**Edit to**:
- Modify delivery schedules
- Add progress indicators
- Change speed controls
- Add automation rules

---

### Tab 6: Refill
**Component**: `RefillManagement.tsx`
- Refill requests list
- Refill policy configuration
- Refill history
- Automatic refill settings

**Edit to**:
- Modify refill policies
- Add refill conditions
- Change approval workflow
- Add refill analytics

---

### Tab 7: Services
**Component**: `ServicesManagement.tsx`
- Service catalog
- Service categories
- Service pricing
- Service availability

**Edit to**:
- Add service types
- Modify pricing structure
- Add service features
- Change availability rules

---

### Tab 8: Payments
**Component**: `PaymentVerification.tsx`
- Payment verification queue
- Approval/rejection controls
- Payment history
- Transaction logs

**Edit to**:
- Add payment filters
- Modify approval workflow
- Add payment analytics
- Change verification process

---

### Tab 9: Tickets
**Component**: `TicketsManagement.tsx`
- Support tickets list
- Ticket details
- Reply interface
- Status management
- Priority levels

**Edit to**:
- Add ticket categories
- Modify priority system
- Add auto-responses
- Change ticket workflow

---

### Tab 10: Affiliates
**Component**: `AffiliatesManagement.tsx`
- Affiliate list
- Commission tracking
- Payout management
- Performance analytics

**Edit to**:
- Modify commission rates
- Add affiliate tiers
- Change payout methods
- Add performance metrics

---

### Tab 11: Child Panels
**Component**: `ChildPanelsManagement.tsx`
- Sub-panel list
- Panel configuration
- Revenue sharing
- API access control

**Edit to**:
- Add panel features
- Modify revenue sharing
- Change API permissions
- Add panel analytics

---

### Tab 12: Security
**Component**: `SecurityDashboard.tsx`
- Two-factor authentication
- IP whitelist
- Session management
- Password policies
- Security audit logs

**Edit to**:
- Add security rules
- Modify authentication methods
- Change session timeouts
- Add security alerts

---

### Tab 13: System
**Component**: `SystemMonitoring.tsx`
- System health metrics
- Server resource usage
- Database performance
- API response times
- Error logs

**Edit to**:
- Add monitoring metrics
- Modify alert thresholds
- Change refresh intervals
- Add system controls

---

### Tab 14: Updates
**Component**: `UpdatesManagement.tsx`
- System announcements
- Update notifications
- Changelog
- Maintenance mode

**Edit to**:
- Add announcement types
- Modify notification system
- Change update schedule
- Add version control

---

### Tab 15: Reports
**Component**: `ReportsManagement.tsx`
- Revenue reports
- User analytics
- Order statistics
- Performance metrics
- Export functionality

**Edit to**:
- Add report types
- Modify chart types
- Change date ranges
- Add custom metrics

---

### Tab 16: Appearance
**Component**: `AppearanceSettings.tsx`
- Theme customization
- Color scheme
- Logo upload
- Banner management
- Custom CSS

**Edit to**:
- Add theme options
- Modify color pickers
- Change upload limits
- Add preview functionality

---

### Tab 17: Settings (Multiple Components)

#### Categories
**Component**: `CategoryManagement.tsx`
- Category list
- Add/edit categories
- Category ordering
- Category icons

**Edit to**:
- Add category types
- Modify category structure
- Add subcategories
- Change category display

---

#### Products
**Component**: `ProductManagement.tsx`
- Product catalog
- Product details
- Pricing management
- Stock tracking

**Component**: `ProductFieldsManagement.tsx`
- Custom product fields
- Field types
- Field validation
- Field ordering

**Edit to**:
- Add product types
- Modify product form
- Add custom fields
- Change pricing structure

---

#### Stock
**Component**: `StockManagement.tsx`
- Inventory list
- Stock items
- Stock status
- Low stock alerts

**Edit to**:
- Add stock types
- Modify stock tracking
- Add auto-reorder
- Change alert thresholds

---

#### Banners
**Component**: `BannerManagement.tsx`
- Banner carousel
- Banner upload
- Banner ordering
- Banner scheduling

**Edit to**:
- Add banner types
- Modify banner sizes
- Add animation options
- Change display rules

---

#### API Keys
**Component**: `ApiKeyManagement.tsx`
- API key list
- Key generation
- Key permissions
- Usage tracking

**Edit to**:
- Add key types
- Modify permissions
- Add rate limiting
- Change key format

---

#### Site Settings
**Component**: `SiteSettingsManagement.tsx`
- General settings
- Contact information
- Social media links
- SEO settings

**Edit to**:
- Add setting categories
- Modify setting types
- Add validation rules
- Change setting layout

---

#### Providers
**Component**: `ProviderManagement.tsx`
- External providers
- Provider configuration
- API credentials
- Provider status

**Edit to**:
- Add provider types
- Modify provider settings
- Add provider testing
- Change provider priority

---

#### User Levels
**Component**: `UserLevelManagement.tsx`
- User tier system
- Level benefits
- Discount rates
- Level requirements

**Edit to**:
- Add level types
- Modify level benefits
- Change level requirements
- Add level progression

---

#### Custom Rates
**Component**: `CustomRateManagement.tsx`
- Special pricing rules
- User-specific rates
- Product-specific rates
- Bulk pricing

**Edit to**:
- Add rate types
- Modify rate calculation
- Add rate conditions
- Change rate display

---

#### Profit Margins
**Component**: `ProfitMarginSettings.tsx`
- Markup configuration
- Margin by category
- Margin by product
- Margin analytics

**Edit to**:
- Add margin types
- Modify margin calculation
- Add margin rules
- Change margin display

---

#### Modules
**Component**: `ModulesManagement.tsx`
- Feature toggles
- Module configuration
- Module dependencies
- Module status

**Edit to**:
- Add module types
- Modify module settings
- Add module testing
- Change module layout

---

#### Integrations
**Component**: `IntegrationsManagement.tsx`
- Third-party integrations
- Integration configuration
- API connections
- Integration status

**Edit to**:
- Add integration types
- Modify integration settings
- Add integration testing
- Change integration display

---

#### Notifications
**Component**: `NotificationsManagement.tsx`
- Notification system config
- Notification templates
- Notification channels
- Notification rules

**Edit to**:
- Add notification types
- Modify notification templates
- Add notification channels
- Change notification rules

---

#### Bonuses
**Component**: `BonusesManagement.tsx`
- Promotional bonuses
- Bonus rules
- Bonus history
- Bonus analytics

**Edit to**:
- Add bonus types
- Modify bonus calculation
- Add bonus conditions
- Change bonus display

---

#### Signup Form
**Component**: `SignupFormSettings.tsx`
- Registration form fields
- Field validation
- Field ordering
- Required fields

**Edit to**:
- Add form fields
- Modify field types
- Add validation rules
- Change form layout

---

#### Ticket Form
**Component**: `TicketFormSettings.tsx`
- Support ticket form
- Ticket categories
- Priority options
- Custom fields

**Edit to**:
- Add ticket fields
- Modify ticket categories
- Add priority levels
- Change form layout

---

#### Admin Users
**Component**: `AdminUserManagement.tsx`
- Admin account list
- Admin permissions
- Role management
- Admin activity

**Edit to**:
- Add admin roles
- Modify permissions
- Add permission groups
- Change admin display

---

#### Activity Logs
**Component**: `ActivityLogsManagement.tsx`
- System activity tracking
- User actions
- Admin actions
- Audit trail

**Edit to**:
- Add log types
- Modify log display
- Add log filters
- Change log retention

---

#### Email Templates
**Component**: `EmailTemplatesManagement.tsx`
- Email template editor
- Template variables
- Template preview
- Template testing

**Edit to**:
- Add template types
- Modify template editor
- Add template variables
- Change template layout

---

## 🎯 Quick Edit Reference

### To Edit a Component:

1. **Find the file**: `src/components/admin/[ComponentName].tsx`
2. **Open in editor**: Use your code editor
3. **Make changes**: Modify JSX, add features, change styling
4. **Save**: Changes appear instantly (hot reload)

### Common Edit Patterns:

#### Add a Button
```tsx
<Button onClick={handleAction}>
  <Icon className="mr-2 h-4 w-4" />
  Action Name
</Button>
```

#### Add a Table Column
```tsx
{
  header: 'New Column',
  accessor: 'field_name',
  cell: (row) => <span>{row.field_name}</span>
}
```

#### Add a Form Field
```tsx
<FormField
  control={form.control}
  name="field_name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### Add a Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Your content */}
  </CardContent>
</Card>
```

---

## 📊 Component Dependencies

### All components use:
- `@/components/ui/*` - shadcn/ui components
- `@/db/api` - Database functions
- `@/hooks/use-toast` - Toast notifications
- `lucide-react` - Icons
- `react-hook-form` - Form handling
- `zod` - Validation

### To add new features:
1. Update database schema (if needed)
2. Add API functions in `src/db/api.ts`
3. Update types in `src/types/types.ts`
4. Modify component
5. Test functionality

---

## 🚀 Ready to Edit?

**Tell me what you want to change:**
- Which component?
- What feature to add/modify?
- What should it look like?
- What should it do?

**I'll make the changes for you!** 🎨

---

*Component Map Last Updated: 2025-12-25*
*Total Components: 35*
*Total Lines of Code: ~15,000+*
