# Task: Notification System & Top Banner Implementation

## Plan

- [x] Step 1: Database Schema
  - [x] Create notifications table
  - [x] Create banners table
  - [x] Add RLS policies
  - [x] Apply migration
  - [x] Add database triggers for automatic notifications

- [x] Step 2: TypeScript Types
  - [x] Add Notification interface
  - [x] Add Banner interface
  - [x] Add notification types enum

- [x] Step 3: API Functions
  - [x] Notification CRUD functions
  - [x] Banner CRUD functions
  - [x] Mark notification as read
  - [x] Get unread count

- [x] Step 4: Notification Components
  - [x] NotificationBell component (header icon with badge)
  - [x] NotificationList component (dropdown list)
  - [x] Integrated with Sheet component

- [x] Step 5: Banner Components
  - [x] TopBanner component (scrolling/carousel)
  - [x] BannerManagement in admin panel

- [x] Step 6: Integrate Notifications
  - [x] Add to Header component
  - [x] Trigger on order status change (via database triggers)
  - [x] Trigger on wallet credit (via API)
  - [x] Trigger on payment proof status (via database triggers)
  - [x] Polling for new notifications (every 30 seconds)

- [x] Step 7: Integrate Banner
  - [x] Add to App.tsx (top of page)
  - [x] Auto-rotate banners (every 5 seconds)
  - [x] Admin management tab in AdminManagementPage

- [x] Step 8: Testing & Validation
  - [x] Run lint checks (passed)

## Notes
- ✅ Notifications are user-specific with database triggers
- ✅ Banners are site-wide with active/inactive status
- ✅ Polling every 30 seconds for new notifications
- ✅ Banner auto-rotates every 5 seconds with navigation controls
- ✅ Admin can manage both systems via AdminManagementPage
- ✅ Database triggers automatically create notifications for:
  - Order status changes (completed, canceled, refunded)
  - Payment proof status changes (approved, rejected)
- ✅ Manual notifications created for:
  - Wallet balance updates
  - API key changes (when implemented)
