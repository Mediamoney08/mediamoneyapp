# MediaMoney Recharge Services Website Requirements Document

## 1. Website Overview

### 1.1 Website Name
MediaMoney\n
### 1.2 Website Description
A comprehensive online platform for digital recharge services, offering game top-ups, app subscriptions, streaming service subscriptions (Netflix, Shahid, etc.), and gift cards. Users can recharge through player IDs and manage transactions via personal wallets.

### 1.3 Reference Website
play4cards.com

### 1.4 Reference Images
- Screenshot2025-12-25195356.png: Category layout reference\n- Screenshot 2025-12-25 195350.png: Service card design reference
- Screenshot 2025-12-25 195327.png: Main category structure reference
- Screenshot 2025-12-26 133441.png: Admin dashboard navigation menu reference
- Screenshot 2025-12-26 133448.png: Admin settings sidebar reference
- image.png: Order details page with provider replay/response display reference

---

## 2. Core Features

### 2.1 Service Categories Structure
- **Unified Service Grouping**: All services with the same name are grouped into one category, allowing customers to choose from available options within that category
- **Category Main Image**: Each category displays a unified main image representing all services within that category
- **Game Recharge**\n  - 50+ game categories (e.g., Action Games, RPG Games, Battle Royale, etc.)
  - Each category contains multiple service options with the same game name
  - Some categories include subcategories with their own services
  - Recharge via player ID\n\n- **App Recharge**
  - Multiple app categories\n  - Each category contains service options grouped by app name
  - Some categories include subcategories\n  - Recharge via player ID

- **Streaming Subscriptions**
  - Multiple streaming platform categories (Netflix, Shahid, etc.)
  - Each category contains subscription service options
  - Some categories include subcategories (e.g., plan types, regions)
\n- **Gift Cards**
  - Multiple gift card categories
  - Each category contains card service options
  - Some categories include subcategories (e.g., denominations, regions)

### 2.2 User System
- User registration and login\n- **Two-Step Verification (2FA)**: Mandatory two-factor authentication for all users to protect accounts using authenticator apps (Google Authenticator, Authy, etc.) or SMS verification
- **Profile Management**: Users can edit and update their profile information including:
  - Email address
  - Password
  - Phone number
  - Display name
  - Profile picture
  - Communication preferences
  - **Language preference selection from all supported languages**
  - **Currency preference selection from all supported currencies**
- Personal wallet system\n- Balance top-up functionality
- Order history tracking
- **Invoice generation for orders**
- Security settings with 2FA management
- **Wallet-only purchase requirement: All purchases must be made using wallet balance**

### 2.3 User Level System
- **User Level Tiers**: Admin can create and manage multiple user levels\n- **Custom Discount Rates**: Admin can assign custom discount percentages to each user level
- **Flexible Discount Configuration**: Admin has full control to set any discount rate per level
- **Automatic Price Adjustment**: User prices are automatically adjusted based on their assigned level and discount rate
- **Level Assignment**: Admin can assign users to specific levels through user management panel
\n### 2.4 Transaction Features
- **Automatic order fulfillment from stock inventory**: When customers purchase gift cards, Netflix codes, Shahid codes, or PUBG codes, orders are fulfilled directly from stock and delivered immediately
- Real-time stock management\n- **Multi-currency support**: Support for all major global currencies with real-time exchange rate conversion
- **Wallet-based payment processing only**
- **Invoice Generation**: Customers can generate and download invoices for their orders from the order page
\n### 2.5 Stock Management System
- **Stock Manager Role**: Dedicated role for managing inventory of gift cards and digital codes
- **Direct Order Fulfillment**: Customers receive orders immediately upon purchase from available stock
- **Stock Categories**: Gift cards, Netflix codes, Shahid codes, PUBG codes, and other digital products\n- **Real-time Inventory Tracking**: Automatic stock level updates after each purchase
- **Stock Alerts**: Notifications when stock levels are low
- **Stock Manager Permissions**:
  - Add new stock items
  - Update stock quantities
  - View stock history
  - Manage stock categories
  - Set stock alerts and thresholds

### 2.6 Comprehensive Notification System
\n#### 2.6.1 Order Notifications
- **Order Created**: Automatic notification sent immediately when customer places an order
  - Notification content: Order number, service name, amount, estimated delivery time
  - Delivery channels: In-app, email, push notification\n- **Order Processing**: Notification when order status changes to processing
  - Notification content: Order number, current status, processing updates
- **Order Completed**: Automatic notification when order is successfully fulfilled
  - Notification content: Order number, delivery details, order link/code, invoice download link
  - Delivery channels: In-app, email, SMS (optional), push notification
- **Order Failed/Rejected**: Notification when order cannot be completed
  - Notification content: Order number, failure reason, refund information
  - Delivery channels: In-app, email, push notification
- **Order Cancelled**: Notification when order is cancelled by user or admin
  - Notification content: Order number, cancellation reason, refund status
- **Order Refunded**: Notification when refund is processed
  - Notification content: Order number, refund amount, wallet balance update
- **Partial Order Fulfillment**: Notification for partially completed orders
  - Notification content: Order number, completed quantity, pending quantity
- **Provider Response/Replay Notification**: Automatic notification when service provider sends a response or update about an order
  - Notification content: Order number, provider message/response, timestamp
  - Delivery channels: In-app, email, push notification
  - Trigger: Whenever provider API returns a response or status update
  - Display: Provider response visible in order details page with 'REPLAY' section

#### 2.6.2 Wallet & Payment Notifications
- **Balance Added**: Automatic notification when wallet balance is credited
  - Notification content: Added amount, new balance, transaction ID
  - Delivery channels: In-app, email, SMS (optional), push notification
- **Payment Request Submitted**: Confirmation when payment proof is uploaded
  - Notification content: Payment amount, submission time, review status
- **Payment Approved**: Notification when admin approves balance top-up request
  - Notification content: Approved amount, new wallet balance, transaction details
- **Payment Rejected**: Notification when admin rejects balance top-up request
  - Notification content: Rejection reason, admin notes, resubmission instructions
- **Low Balance Warning**: Alert when wallet balance falls below threshold
  - Notification content: Current balance, recommended top-up amount\n- **Wallet Transaction Alert**: Notification for all wallet debits and credits
  - Notification content: Transaction type, amount, balance before/after
\n#### 2.6.3 Service & Pricing Notifications
- **New Service Added**: Notification when new services become available
  - Notification content: Service name, category, pricing, service description
  - Delivery channels: In-app, email, push notification
  - Target audience: All users or specific user levels
- **Service Available**: Notification when previously unavailable service is back in stock
  - Notification content: Service name, availability status, current pricing
  - Target audience: Users who previously attempted to order or subscribed to alerts
- **Service Unavailable**: Notification when service becomes temporarily unavailable
  - Notification content: Service name, unavailability reason, estimated return date
  - Target audience: Users with active subscriptions or recent orders
- **Price Increase**: Notification when service price increases
  - Notification content: Service name, old price, new price, effective date\n  - Delivery channels: In-app, email\n  - Advance notice: Sent 24-48 hours before price change
- **Price Decrease**: Notification when service price decreases
  - Notification content: Service name, old price, new price, savings amount
  - Delivery channels: In-app, email, push notification
- **Special Offers & Discounts**: Notification for promotional pricing\n  - Notification content: Offer details, discount percentage, validity period
\n#### 2.6.4 Website & System Notifications
- **Website Updates**: Notification for major platform updates or new features
  - Notification content: Update description, new features, changelog link
  - Delivery channels: In-app banner, email\n- **Maintenance Notifications**: Advance notice for scheduled maintenance\n  - Notification content: Maintenance window, expected downtime, affected services
  - Delivery timing: 24 hours before, 1 hour before, maintenance start, maintenance end
- **System Announcements**: Important platform-wide announcements
  - Notification content: Announcement message, action required (if any)
  - Delivery channels: In-app banner, email, push notification
- **Policy Updates**: Notification for Terms of Service or Privacy Policy changes
  - Notification content: Summary of changes, effective date, full policy link
\n#### 2.6.5 Security Notifications
- **API Key Change**: Alert when API key is modified or regenerated
  - Notification content: Key name, change timestamp, IP address
- **Account Security Updates**: Notification for security-related changes
  - Notification content: Change type, timestamp, device information
- **Two-Factor Authentication Setup**: Confirmation when 2FA is enabled
  - Notification content: Setup timestamp, backup codes reminder
- **Login from New Device**: Alert for login from unrecognized device
  - Notification content: Device info, location, login timestamp, 'Not you?' action link
- **Password Change Confirmation**: Notification when password is updated
  - Notification content: Change timestamp, IP address, 'Not you?' action link
- **Suspicious Activity Alert**: Notification for unusual account activity
  - Notification content: Activity description, recommended actions
\n#### 2.6.6 Support & Ticket Notifications
- **Ticket Created**: Confirmation when support ticket is submitted
  - Notification content: Ticket number, subject, estimated response time
- **Ticket Reply**: Notification when admin responds to ticket
  - Notification content: Ticket number, reply preview, link to full conversation
- **Ticket Status Update**: Notification when ticket status changes
  - Notification content: Ticket number, new status, next steps
- **Ticket Resolved**: Notification when ticket is marked as resolved
  - Notification content: Ticket number, resolution summary, satisfaction survey link
\n#### 2.6.7 Notification Delivery System
- **Multi-Channel Delivery**:
  - In-app notification center with unread badge counter
  - Email notifications (optional, user-configurable)
  - SMS notifications (optional, for critical alerts)
  - Push notifications (browser and mobile)
- **Notification Preferences**: Users can customize notification settings
  - Enable/disable specific notification types
  - Choose delivery channels per notification type
  - Set quiet hours for non-critical notifications
  - Frequency control (instant, daily digest, weekly summary)
- **Multi-Language Support**: All notifications delivered in user's selected language
- **Notification History**: Complete log of all notifications with read/unread status
- **Notification Actions**: Quick actions directly from notifications (e.g., view order, download invoice, reply to ticket)
- **Real-Time Delivery**: WebSocket-based instant notification delivery
- **Notification Queue**: Background job processing for reliable delivery
- **Delivery Tracking**: Track notification delivery status and read receipts
- **Failed Delivery Retry**: Automatic retry mechanism for failed notifications

#### 2.6.8 Admin Notification Management
- **Notification Templates**: Admin can create and edit notification templates
  - WYSIWYG editor for email templates
  - Variable placeholders for dynamic content
  - Preview functionality before sending
- **Broadcast Notifications**: Admin can send announcements to all users or specific segments
  - Target by user level, registration date, activity status
  - Schedule notifications for future delivery
- **Notification Analytics**: Track notification performance\n  - Delivery rates, open rates, click-through rates\n  - User engagement metrics per notification type
- **Notification Logs**: Complete audit trail of all sent notifications
  - Timestamp, recipient, delivery status, content
\n### 2.7 Support System
- Ticket support for customer inquiries
- **Multi-language ticket support**: Customers can submit tickets in their preferred language
\n### 2.8 Comprehensive API System
\n#### 2.8.1 Public API for External Integration
- **API Documentation Portal**: Interactive API documentation similar to https://api.play4cards.com/api-docs
- **RESTful API Architecture**: Standard REST endpoints with JSON request/response format
- **API Authentication**: Secure API key-based authentication for all requests
- **API Versioning**: Version control system (v1, v2, etc.) for backward compatibility
\n**Available API Endpoints:**
\n**Authentication & Account Management:**
- POST /api/v1/auth/register - Register new API user
- POST /api/v1/auth/login - Authenticate and get API token
- GET /api/v1/account/balance - Check wallet balance
- GET /api/v1/account/profile - Get user profile information
\n**Services & Pricing:**
- GET /api/v1/services - List all available services
- GET /api/v1/services/{id} - Get specific service details
- GET /api/v1/services/categories - List all service categories
- GET /api/v1/services/search - Search services by keyword
- GET /api/v1/pricing/{service_id} - Get current pricing for service

**Order Management:**
- POST /api/v1/orders/create - Create new order
- GET /api/v1/orders/{order_id} - Get order status and details
- GET /api/v1/orders/list - List all orders with filters
- POST /api/v1/orders/{order_id}/cancel - Request order cancellation
- GET /api/v1/orders/{order_id}/invoice - Download order invoice
- **GET /api/v1/orders/{order_id}/provider-response - Get provider response/replay for order**

**Wallet Operations:**
- POST /api/v1/wallet/topup - Submit balance top-up request
- GET /api/v1/wallet/transactions - Get wallet transaction history
- GET /api/v1/wallet/pending - Get pending payment requests
\n**Stock Availability:**
- GET /api/v1/stock/check/{service_id} - Check stock availability\n- GET /api/v1/stock/status - Get real-time stock status for multiple services
\n**Webhooks:**
- POST /api/v1/webhooks/configure - Set up webhook endpoints
- GET /api/v1/webhooks/list - List configured webhooks
- DELETE /api/v1/webhooks/{id} - Remove webhook\n
**API Security Features:**
- **API Key Management**: Generate, rotate, and revoke API keys
- **Rate Limiting**: Configurable request limits per API key (e.g., 1000 requests/hour)
- **IP Whitelisting**: Restrict API access to specific IP addresses
- **Request Signing**: HMAC-SHA256 signature verification for sensitive operations
- **SSL/TLS Encryption**: All API communications encrypted via HTTPS
- **API Key Scopes**: Granular permission control (read-only, write, admin)
- **Request Throttling**: Automatic throttling for excessive requests
- **API Audit Logs**: Complete logging of all API requests and responses

**API Response Format:**
```json
{
  'status': 'success/error',
  'code': 200,
  'message': 'Operation completed successfully',
  'data': {},
  'timestamp': '2025-12-26T17:17:16Z'
}
```
\n**Error Handling:**
- Standard HTTP status codes (200, 400, 401, 403, 404, 429, 500)
- Detailed error messages with error codes
- Rate limit headers in responses
\n**API Documentation Features:**
- Interactive API explorer with 'Try it out' functionality
- Code examples in multiple languages (PHP, Python, JavaScript, cURL)
- Request/response schema documentation
- Authentication guide and quick start tutorial
- Webhook integration examples
- Postman collection export

#### 2.8.2 Customer API Dashboard
- **API Key Management Interface**: Generate and manage API keys from user dashboard
- **API Usage Statistics**: View request counts, success rates, and error logs
- **API Testing Console**: Built-in testing tool for API endpoints
- **API Documentation Access**: Direct access to API docs from user account
- **Webhook Configuration**: Set up and test webhook endpoints
- **API Logs Viewer**: View recent API requests and responses

#### 2.8.3 Admin API v2
- **API Key Management**:
  - Create and edit API keys
  - Set API key name and notes
  - Enable/disable API key status
  - Configure granular access permissions per key
\n- **Orders Permissions**:
  - Edit link\n  - Resend order\n  - Get order list
  - View provider charge
  - View External ID
  - View provider response
  - View provider URL instead of alias
  - Change status
  - Cancel and refund\n  - Set partial\n  - Pull orders
  - Update orders
\n- **Cancel Permissions**:
  - Request cancel
  - Pull cancel tasks
  - Reject cancel
\n- **Refill Permissions**:
  - Pull refill tasks
  - Change refill status
\n- **Payments Permissions**:
  - Add payment
  - Get payment list
  - View user details
\n- **Users Permissions**:
  - Add user
  - Get user list
  - View email
  - View balance
  - View spent
  - View user details
\n- **Tickets Permissions**:
  - Get ticket list
  - Get ticket\n  - Reply to a ticket
  - Add ticket
\n### 2.9 Interface Features
- **Advertisement Banner**: Reduced height moving banner at the top of screen displaying promotional photos and ads
- **Search Field**: Positioned below the advertisement banner\n- Dark mode and light mode toggle
- **Multi-language support**: Support for all major global languages with language selector in header
- Slide bar navigation\n- Navigation bar\n- Header section\n- Attractive animations\n\n### 2.10 Order Details & Provider Response Display
\n#### 2.10.1 Order Details Page Features
- **Complete Order Information Display**:
  - Order ID\n  - Product/Service name
  - Quantity
  - Total price with currency
  - Order date and time
  - Player ID or account identifier
  - Order status
\n#### 2.10.2 Provider Response/Replay Section
- **Provider Response Display**: Dedicated section showing responses and updates from service providers
  - **REPLAY Button**: Interactive button to view provider responses
  - **Response Content Display**: Shows provider messages, status updates, and completion confirmations
  - **Copy Functionality**: Copy button to easily copy provider response text
  - **Timestamp**: Display when provider response was received
  - **Multi-language Support**: Provider responses displayed in user's preferred language when possible
  - **Real-time Updates**: Automatic refresh when new provider responses are received

#### 2.10.3 Provider Response Notification Integration
- **Automatic Notification Trigger**: When provider sends a response or update:\n  - Create notification record in database
  - Send real-time notification to user via WebSocket
  - Send push notification if enabled
  - Send email notification if configured
  - Display notification badge on order page
- **Notification Content**: Include order number, provider message preview, and link to order details
- **Notification Actions**: Direct link to view full provider response in order details page

### 2.11 Admin Management System

#### 2.11.1 Admin Access & Security
- **Multi-Level Admin Roles**: Super Admin, Admin, Manager, Support Staff, Stock Manager with customizable permission sets
- **Role-Based Access Control (RBAC)**: Granular permissions for each admin role with ability to create custom roles
- **Admin Login Page**: Dedicated secure login page exclusively for administrators with CAPTCHA protection
- **Admin Login Credentials**: Administrators must log in using their admin credentials (username/email and password) to access the admin dashboard
- **Admin Authentication Flow**: \n  - Admin enters username/email and password on admin login page
  - System validates credentials against admin database
  - CAPTCHA verification to prevent automated attacks
  - Two-Factor Authentication (2FA) verification required\n  - Upon successful authentication, admin is redirected to admin dashboard
  - Failed login attempts are logged and monitored
- **Two-Factor Authentication (2FA)**: Mandatory 2FA for all admin accounts using authenticator apps (Google Authenticator, Authy, etc.) or SMS verification to protect admin access
- **Admin Profile Management**: Admins can edit and update their profile information including:
  - Email address
  - Password
  - Phone number
  - Display name
  - Profile picture
  - 2FA settings
- **Session Management**: \n  - Configurable session timeout (15-120 minutes)
  - Automatic logout on inactivity
  - Single session enforcement option
  - Session hijacking prevention
- **IP Whitelisting**: Restrict admin access to specific IP addresses or ranges
- **Login Attempt Monitoring**: Track and block suspicious login attempts after configurable failed attempts
- **Password Policy Enforcement**:
  - Minimum password length (12+ characters)
  - Complexity requirements (uppercase, lowercase, numbers, special characters)
  - Password expiration (30/60/90 days)
  - Password history (prevent reuse of last 5 passwords)
- **Admin Activity Audit Log**: Comprehensive logging of all admin actions with timestamps, IP addresses, and user agents
- **Security Alerts**: Real-time notifications for suspicious activities, unauthorized access attempts, and security events
- **Data Encryption**: End-to-end encryption for sensitive admin data and communications
- **Backup Admin Access**: Emergency access recovery system for Super Admin

#### 2.11.2 Comprehensive Dashboard Navigation
Full navigation menu with the following modules:
- **Dashboard Home**: Overview with key metrics, recent activities, and quick action buttons
- **Users**: Manage user accounts, permissions, wallet balances, activity, user level assignments, profile information, 2FA status, and bulk user operations
- **Orders**: View, process, update, edit links, resend orders, cancel and refund, set partial, pull and update orders, **view provider responses**, export order data\n- **Subscriptions**: Manage recurring subscription services, billing cycles, renewal settings, and subscription analytics
- **Drip-feed**: Configure and manage drip-feed order delivery settings, scheduling, and automation rules
- **Refill**: Handle refill requests, pull refill tasks, change refill status, and refill history tracking
- **Cancel**: Manage cancellation requests, pull cancel tasks, reject cancellations, and cancellation analytics
- **Services**: Add, edit, delete services and categories; update pricing and availability; import services via API with profit markup; bulk service management
- **Payments**: Review and approve/reject balance top-up requests; add payments; view payment lists and user details; payment gateway configuration; transaction monitoring
- **Tickets**: View and respond to customer support tickets; manage ticket workflow; ticket categorization; SLA tracking; canned responses
- **Affiliates**: Manage affiliate program, track referrals, commission payouts, affiliate performance analytics, and commission rules
- **Child panels**: Manage sub-panel accounts and permissions for resellers; revenue sharing configuration; child panel analytics
- **Updates**: View system updates, changelog, version information, and schedule maintenance windows
- **Reports**: Access analytics dashboard with site statistics, revenue reports, popular services, user activity, financial reports, and custom report builder
- **Appearance**: Customize site theme, colors, logos, visual elements, and frontend layout options
- **Settings**: Configure all site parameters through comprehensive settings sidebar
- **API Management**: Manage public API settings, monitor API usage, configure rate limits, and view API logs
- **Logs & Monitoring**: System logs, error logs, API logs, admin activity logs, and real-time monitoring dashboard
- **Backup & Restore**: Database backup scheduling, backup history, one-click restore, and export/import functionality
- **Email Templates**: Manage email notification templates for all system events with WYSIWYG editor
- **SMS Gateway**: Configure SMS notification settings and manage SMS templates
- **Security Center**: Centralized security management, firewall rules, DDoS protection settings, 2FA enforcement, and security scan reports
- **Notifications**: Manage notification system, create broadcast messages, view notification analytics, and configure notification templates
\n#### 2.11.3 Settings Sidebar Modules
- **General**: Basic site configuration, site name, URL, timezone, general preferences, maintenance mode, and site status
- **Providers**: Configure service provider API connections, manage provider settings, provider priority, and failover rules
- **Payments Modules**: Set up and manage payment gateway integrations for balance top-ups, payment method ordering, and fee configuration
- **Integrations**: Connect third-party services and tools (analytics, CRM, marketing automation, etc.)
- **Notifications**: Configure notification settings, templates, delivery methods, and notification scheduling
- **Bonuses**: Set up bonus programs, promotional offers, reward systems, and loyalty programs
- **Signup form**: Customize user registration form fields, validation rules, and email verification settings
- **Ticket form**: Configure support ticket form fields, categories, priority levels, and auto-assignment rules
- **API Settings**: Configure public API parameters, rate limits, authentication methods, and API documentation access
- **Currency Settings**: Manage supported currencies, exchange rates, automatic rate updates, and default currency configuration
- **Language Settings**: Add/edit language packs, set default language, manage translations, and configure language selector display
- **Tax Configuration**: Set up tax rules, VAT settings, and regional tax compliance
- **Terms & Policies**: Manage Terms of Service, Privacy Policy, Refund Policy, and legal documents
- **GDPR Compliance**: Configure data retention policies, user data export, and right to be forgotten features
- **Rate Limiting**: Configure API rate limits, request throttling, and abuse prevention
- **Cache Management**: Configure caching settings, clear cache, and optimize performance
- **Security Settings**: Configure 2FA enforcement policies, password policies, session management, and security alerts
\n#### 2.11.4 Additional Admin Features
- **User Level Management**: Create, edit, and delete user levels; assign custom discount rates to each level
- **Custom Rate Configuration**: Set custom pricing rates for users based on their level and discount settings
- **Service Import with Profit Markup**: Import services via API from providers with automatic profit percentage addition
- **Stock Inventory Control**: Manage gift card stock, track inventory levels, add new stock for digital products\n- **Stock Manager Assignment**: Assign and manage stock manager roles and permissions
- **Category & Image Management**: Upload and assign main images for each category; organize service groupings
- **Advertisement Management**: Upload and manage promotional photos for top banner; control banner rotation and display
- **Admin API v2 Management**: Create and edit API keys, set granular permissions, and monitor API usage
- **Public API Management**: Configure public API settings, manage API documentation, monitor API usage statistics
- **Provider Response Management**: View and manage all provider responses/replays for orders; monitor provider communication
- **Bulk Operations**: Bulk user management, bulk order processing, bulk service updates, and bulk email sending
- **Advanced Search & Filtering**: Powerful search across all modules with multiple filter criteria
- **Data Export**: Export data to CSV, Excel, PDF formats for all major modules
- **Scheduled Tasks**: Configure automated tasks (reports, backups, notifications, cleanups)
- **Webhook Management**: Configure webhooks for external integrations and event notifications
- **Custom Fields**: Add custom fields to users, orders, and services for extended data collection
- **Fraud Detection**: Automated fraud detection rules, suspicious activity alerts, and blacklist management
- **Performance Monitoring**: Real-time server performance metrics, database optimization tools, and bottleneck identification
- **Multi-Admin Collaboration**: Admin notes, task assignment, internal messaging, and collaboration tools
- **Version Control**: Track changes to services, prices, and configurations with rollback capability
- **Language Management**: Add, edit, and manage all language translations; import/export language files; set language availability per region
- **Currency Management**: Add, edit, and manage all supported currencies; configure exchange rate sources; set currency availability per region; manage currency conversion rules
- **Notification Management**: Create and manage notification templates, send broadcast notifications, view notification analytics, configure delivery settings
\n---

## 3. Website Pages

### 3.1 Customer-Facing Pages
1. **Home** - Main landing page with reduced-height advertisement banner at top, search field below banner, and service categories
2. **Wallet** - User wallet management and balance display with multi-currency support
3. **Add Balance** - Wallet recharge page with multiple payment methods and currency selection
4. **My Orders** - Order history and status tracking with invoice generation option
5. **Order Details** - Detailed order information page with provider response/replay section, copy functionality, and real-time updates
6. **Profile Settings** - User profile management page for editing email, password, phone number, display name, profile picture, language preference, currency preference, and communication preferences
7. **Security** - Account security settings including 2FA setup, trusted devices management, login history, and password change\n8. **API** - Customer API documentation, key management, and testing console
9. **API Documentation** - Interactive API documentation portal with code examples and testing tools
10. **About Us** - Company information and contact details
11. **Service Category Pages** - Dedicated pages for each main service type (Games, Apps, Streaming, Gift Cards) with category/subcategory navigation and unified category images
12. **Notifications** - Notification center displaying all user notifications with filtering and search capabilities
\n### 3.2 Admin-Only Pages
1. **Admin Login** - Secure authentication page with username/email and password fields, CAPTCHA protection, and 2FA verification for administrators only
2. **Admin Dashboard** - Overview of site statistics and quick access to all management modules
3. **Admin Profile Settings** - Admin profile management page for editing email, password, phone number, display name, profile picture, and 2FA settings
4. **Users Management** - Interface for managing user accounts, permissions, levels, activity, profile information, and 2FA status
5. **Orders Management** - Interface for managing all customer orders with full control options and provider response viewing
6. **Subscriptions Management** - Interface for managing recurring subscription services\n7. **Drip-feed Management** - Interface for configuring drip-feed delivery settings\n8. **Refill Management** - Interface for handling refill requests and tasks
9. **Cancel Management** - Interface for managing cancellation requests\n10. **Services Management** - Interface for managing services, categories, pricing, and imports
11. **Payments Management** - Interface for reviewing balance top-up requests and payment verification
12. **Tickets Management** - Interface for handling customer support tickets\n13. **Affiliates Management** - Interface for managing affiliate program and commissions
14. **Child Panels Management** - Interface for managing reseller sub-panels\n15. **Updates** - Interface for viewing system updates and changelog
16. **Reports & Analytics** - Interface for viewing site statistics and performance data
17. **Appearance Settings** - Interface for customizing site visual design
18. **General Settings** - Interface for basic site configuration\n19. **Providers Settings** - Interface for managing service provider API connections
20. **Payments Modules Settings** - Interface for configuring payment gateway integrations
21. **Integrations Settings** - Interface for connecting third-party services\n22. **Notifications Settings** - Interface for configuring notification system
23. **Bonuses Settings** - Interface for setting up bonus programs
24. **Signup Form Settings** - Interface for customizing registration form\n25. **Ticket Form Settings** - Interface for configuring support ticket form\n26. **API Settings** - Interface for configuring public API parameters and documentation\n27. **User Level Management** - Interface for creating and managing user levels with custom discount rates
28. **Stock Management** - Interface for inventory control of digital products
29. **Stock Manager Management** - Interface for assigning and managing stock manager roles\n30. **Category Management** - Interface for organizing services and uploading category main images
31. **Advertisement Management** - Interface for uploading and managing top banner promotional content
32. **Admin API v2 Management** - Interface for creating, editing, and managing API keys with granular permission settings
33. **Public API Management** - Interface for managing public API settings, monitoring usage, and configuring rate limits
34. **API Logs & Monitoring** - Interface for viewing API request logs, error tracking, and usage analytics
35. **Admin Roles & Permissions** - Interface for creating custom admin roles and assigning granular permissions
36. **Security Center** - Interface for managing security settings, viewing security logs, configuring 2FA policies, and configuring protection rules
37. **Logs & Monitoring** - Interface for viewing system logs, admin activity logs, and real-time monitoring\n38. **Backup & Restore** - Interface for managing database backups and restoration
39. **Email Templates** - Interface for managing email notification templates\n40. **SMS Gateway** - Interface for configuring SMS settings\n41. **Bulk Operations** - Interface for performing bulk actions across multiple records
42. **Scheduled Tasks** - Interface for configuring automated tasks and cron jobs
43. **Webhook Management** - Interface for managing webhook integrations
44. **Fraud Detection** - Interface for configuring fraud rules and viewing suspicious activities
45. **Performance Dashboard** - Interface for monitoring system performance and optimization
46. **Language Management** - Interface for adding, editing, and managing all language translations; import/export language files; configure language availability\n47. **Currency Management** - Interface for adding, editing, and managing all supported currencies; configure exchange rates; set currency availability per region\n48. **Notification Management** - Interface for creating notification templates, sending broadcast notifications, viewing notification analytics, and managing notification delivery settings
49. **Notification Analytics** - Interface for tracking notification performance metrics, delivery rates, and user engagement
50. **Provider Response Logs** - Interface for viewing all provider responses/replays, monitoring provider communication, and troubleshooting order issues
\n---

## 4. Add Balance Payment System

### 4.1 Payment Methods
- Support for 15+ payment methods including:
  - Credit/Debit Cards\n  - PayPal
  - Bank Transfer
  - Mobile Wallets\n  - Cryptocurrency
  - Local payment gateways
  - Other regional payment options
- **Multi-currency payment support**: Accept payments in all supported currencies
\n### 4.2 Payment Submission Process
For each balance top-up request, customers must:
1. Select preferred payment method from available options
2. Select currency for payment
3. Upload payment proof photo\n4. Enter transaction details\n5. Provide transaction ID\n6. Submit for verification

### 4.3 Payment Verification
- Admin review of submitted payment proofs through admin panel
- Balance credited after verification with automatic currency conversion if needed
- Notification sent upon approval or rejection

---

## 5. Technical Requirements

### 5.1 Backend Architecture & Database Design
\n#### 5.1.1 Backend Technology Stack
- **Backend Framework**: Node.js with Express.js or Python with Django/FastAPI
- **Database**: PostgreSQL (primary) with Redis for caching
- **ORM**: Sequelize (Node.js) or SQLAlchemy (Python)
- **API Architecture**: RESTful API with JSON format\n- **Authentication**: JWT (JSON Web Tokens) for session management
- **File Storage**: AWS S3 or similar cloud storage for images and documents
- **Queue System**: Bull (Node.js) or Celery (Python) for background jobs
- **Real-time Communication**: Socket.io for live updates
- **Email Service**: SendGrid or AWS SES\n- **SMS Service**: Twilio or similar provider
- **Push Notification Service**: Firebase Cloud Messaging (FCM) or OneSignal
\n#### 5.1.2 Complete Database Schema
\n**Users Table (users)**
- id (Primary Key, UUID)
- username (Unique, String)
- email (Unique, String)
- password_hash (String)
- phone_number (String)
- display_name (String)
- profile_picture_url (String)
- user_level_id (Foreign Key → user_levels.id)
- wallet_balance (Decimal)
- total_spent (Decimal)
- preferred_language (String)
- preferred_currency (String)
- two_factor_enabled (Boolean)
- two_factor_secret (Encrypted String)
- backup_codes (Encrypted JSON Array)
- email_verified (Boolean)
- account_status (Enum: active, suspended, banned)
- notification_preferences (JSON Object)
- created_at (Timestamp)
- updated_at (Timestamp)
- last_login_at (Timestamp)
- last_login_ip (String)
\n**Admin Users Table (admin_users)**\n- id (Primary Key, UUID)
- username (Unique, String)
- email (Unique, String)
- password_hash (String)
- phone_number (String)
- display_name (String)
- profile_picture_url (String)
- admin_role_id (Foreign Key → admin_roles.id)
- two_factor_enabled (Boolean)
- two_factor_secret (Encrypted String)
- backup_codes (Encrypted JSON Array)
- ip_whitelist (JSON Array)
- session_timeout_minutes (Integer)
- password_expires_at (Timestamp)
- password_history (JSON Array)
- account_status (Enum: active, suspended)\n- created_at (Timestamp)
- updated_at (Timestamp)
- last_login_at (Timestamp)
- last_login_ip (String)
- created_by_admin_id (Foreign Key → admin_users.id)
\n**Admin Roles Table (admin_roles)**
- id (Primary Key, UUID)
- role_name (String)
- role_description (Text)
- permissions (JSON Object with granular permissions)
- is_super_admin (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)
\n**Admin Sessions Table (admin_sessions)**
- id (Primary Key, UUID)\n- admin_user_id (Foreign Key → admin_users.id)
- session_token (Unique, String)
- ip_address (String)
- user_agent (String)
- expires_at (Timestamp)
- created_at (Timestamp)
- last_activity_at (Timestamp)\n\n**Admin Activity Logs Table (admin_activity_logs)**
- id (Primary Key, UUID)
- admin_user_id (Foreign Key → admin_users.id)
- action_type (String)
- action_description (Text)
- affected_resource_type (String)
- affected_resource_id (String)
- ip_address (String)
- user_agent (String)
- request_data (JSON)\n- response_data (JSON)\n- created_at (Timestamp)
\n**User Levels Table (user_levels)**
- id (Primary Key, UUID)
- level_name (String)
- level_description (Text)
- discount_percentage (Decimal)
- level_order (Integer)
- created_at (Timestamp)
- updated_at (Timestamp)

**Categories Table (categories)**
- id (Primary Key, UUID)
- category_name (String)
- category_slug (Unique, String)
- category_type (Enum: game, app, streaming, gift_card)
- parent_category_id (Foreign Key → categories.id, Nullable)
- main_image_url (String)
- description (Text)
- display_order (Integer)
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

**Services Table (services)**
- id (Primary Key, UUID)
- service_name (String)
- service_slug (Unique, String)
- category_id (Foreign Key → categories.id)
- provider_id (Foreign Key → providers.id)
- provider_service_id (String)
- base_price (Decimal)
- profit_markup_percentage (Decimal)
- final_price (Decimal, Calculated)
- currency (String)
- service_type (Enum: instant, manual, stock)\n- stock_quantity (Integer, Nullable)
- min_quantity (Integer)\n- max_quantity (Integer)\n- description (Text)
- instructions (Text)
- is_active (Boolean)
- previous_price (Decimal, Nullable)
- price_updated_at (Timestamp)
- created_at (Timestamp)
- updated_at (Timestamp)\n
**Providers Table (providers)**
- id (Primary Key, UUID)
- provider_name (String)
- provider_api_url (String)
- api_key (Encrypted String)
- api_secret (Encrypted String)
- provider_type (String)
- priority_order (Integer)
- is_active (Boolean)
- failover_provider_id (Foreign Key → providers.id, Nullable)
- created_at (Timestamp)
- updated_at (Timestamp)

**Orders Table (orders)**
- id (Primary Key, UUID)
- order_number (Unique, String)
- user_id (Foreign Key → users.id)
- service_id (Foreign Key → services.id)
- quantity (Integer)
- unit_price (Decimal)
- discount_amount (Decimal)
- total_amount (Decimal)
- currency (String)
- player_id (String)\n- order_status (Enum: pending, processing, completed, failed, cancelled, refunded, partial)
- provider_order_id (String)\n- provider_response (JSON)
- **provider_response_text (Text)** - Human-readable provider message/response
- **provider_response_timestamp (Timestamp)** - When provider response was received
- external_id (String)\n- delivery_link (String)
- fulfillment_type (Enum: api, stock, manual)
- stock_item_id (Foreign Key → stock_items.id, Nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
- completed_at (Timestamp)\n\n**Provider Response Logs Table (provider_response_logs)**
- id (Primary Key, UUID)
- order_id (Foreign Key → orders.id)
- provider_id (Foreign Key → providers.id)
- response_type (Enum: status_update, completion, error, info)
- response_message (Text)
- response_data (JSON)
- received_at (Timestamp)
- created_at (Timestamp)

**Stock Items Table (stock_items)**\n- id (Primary Key, UUID)
- service_id (Foreign Key → services.id)
- stock_code (Encrypted String)
- stock_type (Enum: gift_card, netflix_code, shahid_code, pubg_code, other)
- denomination (Decimal)
- currency (String)
- status (Enum: available, sold, reserved, expired)
- added_by_admin_id (Foreign Key → admin_users.id)
- sold_in_order_id (Foreign Key → orders.id, Nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
- sold_at (Timestamp)
\n**Wallet Transactions Table (wallet_transactions)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → users.id)
- transaction_type (Enum: credit, debit, refund, bonus)
- amount (Decimal)\n- currency (String)
- balance_before (Decimal)
- balance_after (Decimal)
- description (Text)
- reference_type (String)
- reference_id (String)
- created_at (Timestamp)
\n**Payment Requests Table (payment_requests)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → users.id)
- payment_method (String)
- amount (Decimal)
- currency (String)
- transaction_id (String)
- payment_proof_url (String)
- transaction_details (JSON)
- status (Enum: pending, approved, rejected)\n- reviewed_by_admin_id (Foreign Key → admin_users.id, Nullable)
- review_notes (Text)
- created_at (Timestamp)
- updated_at (Timestamp)
- reviewed_at (Timestamp)
\n**Invoices Table (invoices)**
- id (Primary Key, UUID)\n- invoice_number (Unique, String)\n- order_id (Foreign Key → orders.id)
- user_id (Foreign Key → users.id)
- invoice_date (Timestamp)
- total_amount (Decimal)
- currency (String)
- pdf_url (String)
- created_at (Timestamp)
\n**Tickets Table (tickets)**
- id (Primary Key, UUID)
- ticket_number (Unique, String)\n- user_id (Foreign Key → users.id)
- subject (String)
- category (String)
- priority (Enum: low, medium, high, urgent)
- status (Enum: open, in_progress, waiting_customer, resolved, closed)
- language (String)
- assigned_to_admin_id (Foreign Key → admin_users.id, Nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
- closed_at (Timestamp)
\n**Ticket Messages Table (ticket_messages)**
- id (Primary Key, UUID)\n- ticket_id (Foreign Key → tickets.id)
- sender_type (Enum: user, admin)\n- sender_id (String)
- message_content (Text)
- attachments (JSON Array)
- created_at (Timestamp)
\n**Notifications Table (notifications)**
- id (Primary Key, UUID)
- user_id (Foreign Key → users.id, Nullable)
- admin_user_id (Foreign Key → admin_users.id, Nullable)
- notification_type (String)
- notification_category (Enum: order, wallet, service, security, support, system)
- title (String)
- message (Text)
- language (String)
- is_read (Boolean)
- delivery_method (Enum: in_app, email, sms, push)\n- delivery_status (Enum: pending, sent, delivered, failed)
- metadata (JSON Object)
- action_url (String)
- created_at (Timestamp)
- read_at (Timestamp)
- delivered_at (Timestamp)
\n**Notification Templates Table (notification_templates)**
- id (Primary Key, UUID)\n- template_name (String)
- template_type (String)
- notification_category (String)
- subject_template (String)
- body_template (Text)
- variables (JSON Array)
- delivery_channels (JSON Array)
- is_active (Boolean)
- created_by_admin_id (Foreign Key → admin_users.id)\n- created_at (Timestamp)
- updated_at (Timestamp)

**Notification Preferences Table (notification_preferences)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → users.id)
- notification_type (String)
- in_app_enabled (Boolean)
- email_enabled (Boolean)
- sms_enabled (Boolean)
- push_enabled (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)
\n**Broadcast Notifications Table (broadcast_notifications)**
- id (Primary Key, UUID)\n- title (String)
- message (Text)
- target_audience (Enum: all, user_level, active_users, inactive_users, custom)
- target_criteria (JSON Object)
- delivery_channels (JSON Array)
- scheduled_at (Timestamp)
- sent_at (Timestamp)
- total_recipients (Integer)
- successful_deliveries (Integer)
- failed_deliveries (Integer)
- created_by_admin_id (Foreign Key → admin_users.id)
- status (Enum: draft, scheduled, sending, sent, failed)
- created_at (Timestamp)
- updated_at (Timestamp)

**API Keys Table (api_keys)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → users.id, Nullable)
- admin_user_id (Foreign Key → admin_users.id, Nullable)
- key_name (String)
- api_key (Unique, Encrypted String)
- api_secret (Encrypted String)
- key_type (Enum: public_api, admin_api_v2)
- permissions (JSON Object)
- rate_limit_per_hour (Integer)
- ip_whitelist (JSON Array)
- is_active (Boolean)
- last_used_at (Timestamp)\n- created_at (Timestamp)
- updated_at (Timestamp)
- expires_at (Timestamp)
\n**API Logs Table (api_logs)**
- id (Primary Key, UUID)\n- api_key_id (Foreign Key → api_keys.id)
- endpoint (String)
- http_method (String)
- request_headers (JSON)\n- request_body (JSON)\n- response_status (Integer)
- response_body (JSON)
- response_time_ms (Integer)
- ip_address (String)
- user_agent (String)
- created_at (Timestamp)
\n**Webhooks Table (webhooks)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → users.id)
- webhook_url (String)
- event_types (JSON Array)
- secret_key (Encrypted String)
- is_active (Boolean)
- last_triggered_at (Timestamp)
- created_at (Timestamp)
- updated_at (Timestamp)

**Subscriptions Table (subscriptions)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → users.id)
- service_id (Foreign Key → services.id)
- subscription_status (Enum: active, paused, cancelled, expired)
- billing_cycle (Enum: daily, weekly, monthly, yearly)
- next_billing_date (Timestamp)\n- created_at (Timestamp)
- updated_at (Timestamp)
- cancelled_at (Timestamp)

**Drip Feed Orders Table (drip_feed_orders)**
- id (Primary Key, UUID)
- order_id (Foreign Key → orders.id)\n- total_quantity (Integer)
- delivered_quantity (Integer)
- delivery_interval_minutes (Integer)
- next_delivery_at (Timestamp)
- status (Enum: active, paused, completed, cancelled)
- created_at (Timestamp)
- updated_at (Timestamp)

**Refill Requests Table (refill_requests)**
- id (Primary Key, UUID)
- order_id (Foreign Key → orders.id)
- user_id (Foreign Key → users.id)
- refill_status (Enum: pending, processing, completed, rejected)
- reason (Text)
- created_at (Timestamp)\n- updated_at (Timestamp)
- completed_at (Timestamp)

**Cancel Requests Table (cancel_requests)**
- id (Primary Key, UUID)
- order_id (Foreign Key → orders.id)
- user_id (Foreign Key → users.id)
- cancel_status (Enum: pending, processing, approved, rejected)
- reason (Text)
- reviewed_by_admin_id (Foreign Key → admin_users.id, Nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
- reviewed_at (Timestamp)
\n**Affiliates Table (affiliates)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → users.id)
- referral_code (Unique, String)
- commission_rate (Decimal)
- total_referrals (Integer)
- total_earnings (Decimal)
- created_at (Timestamp)
- updated_at (Timestamp)

**Affiliate Transactions Table (affiliate_transactions)**
- id (Primary Key, UUID)\n- affiliate_id (Foreign Key → affiliates.id)
- referred_user_id (Foreign Key → users.id)
- order_id (Foreign Key → orders.id)
- commission_amount (Decimal)
- status (Enum: pending, paid)\n- created_at (Timestamp)
- paid_at (Timestamp)
\n**Child Panels Table (child_panels)**
- id (Primary Key, UUID)\n- parent_user_id (Foreign Key → users.id)
- panel_name (String)
- panel_url (String)
- revenue_share_percentage (Decimal)
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

**Languages Table (languages)**
- id (Primary Key, UUID)
- language_code (Unique, String)
- language_name (String)
- native_name (String)
- is_rtl (Boolean)
- is_active (Boolean)
- display_order (Integer)
- created_at (Timestamp)
- updated_at (Timestamp)

**Translations Table (translations)**
- id (Primary Key, UUID)
- language_id (Foreign Key → languages.id)
- translation_key (String)
- translation_value (Text)
- context (String)
- created_at (Timestamp)
- updated_at (Timestamp)

**Currencies Table (currencies)**
- id (Primary Key, UUID)
- currency_code (Unique, String)
- currency_name (String)
- currency_symbol (String)
- exchange_rate_to_usd (Decimal)
- is_active (Boolean)
- display_order (Integer)
- created_at (Timestamp)
- updated_at (Timestamp)

**Exchange Rates Table (exchange_rates)**
- id (Primary Key, UUID)
- from_currency (String)
- to_currency (String)
- rate (Decimal)
- source (String)
- created_at (Timestamp)
\n**Site Settings Table (site_settings)**
- id (Primary Key, UUID)\n- setting_key (Unique, String)
- setting_value (JSON)\n- setting_category (String)
- created_at (Timestamp)
- updated_at (Timestamp)

**Banners Table (banners)**
- id (Primary Key, UUID)\n- banner_title (String)
- banner_image_url (String)
- banner_link (String)
- display_order (Integer)
- is_active (Boolean)
- start_date (Timestamp)
- end_date (Timestamp)
- created_at (Timestamp)\n- updated_at (Timestamp)

**System Logs Table (system_logs)**\n- id (Primary Key, UUID)
- log_level (Enum: info, warning, error, critical)
- log_message (Text)
- log_context (JSON)
- stack_trace (Text)
- created_at (Timestamp)
\n**Backups Table (backups)**
- id (Primary Key, UUID)\n- backup_type (Enum: full, incremental)\n- backup_file_url (String)
- backup_size_bytes (BigInteger)
- status (Enum: in_progress, completed, failed)\n- created_by_admin_id (Foreign Key → admin_users.id)
- created_at (Timestamp)
- completed_at (Timestamp)
\n#### 5.1.3 Backend API Endpoints Structure

**Admin Authentication Endpoints**
- POST /admin/auth/login - Admin login with credentials
- POST /admin/auth/verify-2fa - Verify 2FA code
- POST /admin/auth/logout - Admin logout
- POST /admin/auth/refresh-token - Refresh session token
- GET /admin/auth/session - Get current session info
\n**Admin Dashboard Endpoints**
- GET /admin/dashboard/stats - Get dashboard statistics
- GET /admin/dashboard/recent-activity - Get recent activities
- GET /admin/dashboard/alerts - Get system alerts
\n**Admin User Management Endpoints**
- GET /admin/users - List all users with filters
- GET /admin/users/:id - Get user details
- POST /admin/users - Create new user
- PUT /admin/users/:id - Update user
- DELETE /admin/users/:id - Delete user\n- PUT /admin/users/:id/level - Assign user level
- PUT /admin/users/:id/wallet - Adjust wallet balance
- GET /admin/users/:id/orders - Get user order history
- GET /admin/users/:id/transactions - Get user transactions
\n**Admin Order Management Endpoints**
- GET /admin/orders - List all orders with filters
- GET /admin/orders/:id - Get order details\n- PUT /admin/orders/:id/status - Update order status
- PUT /admin/orders/:id/link - Edit order link
- POST /admin/orders/:id/resend - Resend order\n- POST /admin/orders/:id/cancel - Cancel and refund order
- PUT /admin/orders/:id/partial - Set partial fulfillment
- POST /admin/orders/pull - Pull orders from providers
- PUT /admin/orders/bulk-update - Bulk update orders\n- **GET /admin/orders/:id/provider-responses - Get all provider responses for order**
- **GET /admin/provider-responses - List all provider responses with filters**
\n**Admin Service Management Endpoints**
- GET /admin/services - List all services\n- GET /admin/services/:id - Get service details
- POST /admin/services - Create new service
- PUT /admin/services/:id - Update service
- DELETE /admin/services/:id - Delete service
- POST /admin/services/import - Import services from provider
- PUT /admin/services/bulk-update - Bulk update services
- PUT /admin/services/:id/availability - Update service availability
- PUT /admin/services/:id/price - Update service price
\n**Admin Payment Management Endpoints**
- GET /admin/payments - List payment requests
- GET /admin/payments/:id - Get payment details
- PUT /admin/payments/:id/approve - Approve payment
- PUT /admin/payments/:id/reject - Reject payment
- POST /admin/payments/add - Manually add payment
\n**Admin Stock Management Endpoints**
- GET /admin/stock - List stock items
- POST /admin/stock - Add stock items
- PUT /admin/stock/:id - Update stock item
- DELETE /admin/stock/:id - Delete stock item
- GET /admin/stock/alerts - Get low stock alerts

**Admin Notification Management Endpoints**
- GET /admin/notifications - List all notifications
- POST /admin/notifications/broadcast - Send broadcast notification
- GET /admin/notifications/templates - List notification templates
- POST /admin/notifications/templates - Create notification template
- PUT /admin/notifications/templates/:id - Update notification template
- DELETE /admin/notifications/templates/:id - Delete notification template
- GET /admin/notifications/analytics - Get notification analytics
- GET /admin/notifications/logs - View notification delivery logs
- POST /admin/notifications/test - Test notification delivery

**Admin Settings Endpoints**
- GET /admin/settings/:category - Get settings by category
- PUT /admin/settings/:category - Update settings
- GET /admin/settings/all - Get all settings
\n**Admin API Management Endpoints**
- GET /admin/api-keys - List API keys
- POST /admin/api-keys - Create API key
- PUT /admin/api-keys/:id - Update API key
- DELETE /admin/api-keys/:id - Delete API key
- GET /admin/api-logs - View API logs
- GET /admin/api-stats - Get API usage statistics
\n**Admin Security Endpoints**
- GET /admin/security/logs - View security logs
- GET /admin/security/failed-logins - View failed login attempts
- POST /admin/security/ip-whitelist - Add IP to whitelist
- DELETE /admin/security/ip-whitelist/:ip - Remove IP from whitelist
\n**Admin Backup Endpoints**
- GET /admin/backups - List backups
- POST /admin/backups/create - Create backup
- POST /admin/backups/:id/restore - Restore backup\n- DELETE /admin/backups/:id - Delete backup
\n#### 5.1.4 Backend Business Logic Implementation

**Admin Authentication Logic**
- Validate admin credentials against admin_users table
- Check account status and IP whitelist
- Verify CAPTCHA token
- Generate JWT token with admin permissions
- Require 2FA verification\n- Create admin session record
- Log login attempt in admin_activity_logs
- Implement session timeout and auto-logout
- Track failed login attempts and implement lockout

**Admin Authorization Middleware**
- Verify JWT token on each request
- Check admin role permissions for requested action
- Validate session is not expired
- Log all admin actions in admin_activity_logs
- Implement IP address validation
- Check for concurrent session limits
\n**Order Processing Logic**
- Calculate final price based on user level discount
- Verify wallet balance before order creation
- Deduct amount from wallet\n- Create order record\n- Route order to appropriate fulfillment method (API/Stock/Manual)
- For stock orders: Reserve and assign stock item
- For API orders: Send request to provider
- Update order status based on provider response
- **Store provider response in provider_response_text field**
- **Create provider_response_logs entry**
- **Trigger order created notification**
- **Trigger order status change notifications (processing, completed, failed)**
- **Trigger provider response notification when provider sends update**
- Send notification to user\n- Generate invoice\n- Log transaction in wallet_transactions\n\n**Provider Response Handling Logic**
- Receive response from provider API
- Parse provider response data
- Extract human-readable message from response
- Update order.provider_response_text with message
- Update order.provider_response_timestamp\n- Create entry in provider_response_logs table
- Determine response type (status_update, completion, error, info)
- **Trigger provider response notification**:\n  - Create notification record
  - Set notification_type = 'provider_response'
  - Include order number and provider message
  - Queue for delivery via user's enabled channels
  - Send real-time notification via WebSocket
  - Send push notification if enabled
  - Send email if configured
- Update order status if needed based on response
- Log provider communication for troubleshooting

**Stock Fulfillment Logic**
- Check stock availability for service
- Reserve stock item (status = reserved)
- Assign stock code to order
- Mark stock as sold (status = sold)
- Deliver stock code to customer
- Update order status to completed
- **Trigger order completed notification**
- Update stock quantity\n- **Trigger low stock alert notification if threshold reached**
\n**Payment Verification Logic**
- Admin reviews payment proof
- Validate transaction details
- If approved:\n  - Convert currency if needed
  - Credit wallet balance
  - Create wallet transaction record
  - **Trigger balance added notification**
  - Send approval notification\n- If rejected:
  - Add rejection notes
  - **Trigger payment rejected notification**
  - Send rejection notification
- Log admin action\n
**Service Management Logic**
- When service is added:
  - Create service record
  - **Trigger new service notification to all users or targeted user levels**
- When service availability changes:
  - Update is_active status
  - **Trigger service available/unavailable notification**
- When service price changes:
  - Store previous_price
  - Update final_price
  - Update price_updated_at timestamp
  - **Trigger price increase/decrease notification based on comparison**
  - **Send notification 24-48 hours before price increase takes effect**

**Notification Delivery Logic**
- Create notification record in notifications table
- Translate message to user's preferred language
- Check user notification preferences
- Queue notification for delivery via enabled channels
- For in-app: Store in database and send via WebSocket
- For email: Queue email job with template rendering
- For SMS: Queue SMS job via SMS gateway
- For push: Send via FCM or OneSignal
- Update delivery_status after each attempt
- Mark as delivered when successfully sent
- Track read status for in-app notifications
- Retry failed deliveries with exponential backoff
- Log all delivery attempts

**Broadcast Notification Logic**
- Admin creates broadcast notification
- Define target audience criteria
- Query users matching criteria
- Calculate total recipients
- Schedule delivery if future date specified
- Process recipients in batches
- Create individual notification records
- Queue delivery jobs\n- Track delivery progress
- Update broadcast statistics
- Generate delivery report

**User Level Pricing Logic**
- Get service base price from provider
- Apply profit markup percentage
- Calculate user-specific discount based on level
- Final price = (base_price * (1 + profit_markup)) * (1 - user_discount)
- Store calculated price in orders table
\n**API Rate Limiting Logic**
- Track API requests per key in Redis
- Increment counter on each request
- Check if limit exceeded
- Return 429 error if limit reached
- Reset counter after time window
- Log rate limit violations

**Multi-Currency Conversion Logic**
- Get current exchange rate from exchange_rates table
- Convert amount: converted_amount = amount * exchange_rate
- Store both original and converted amounts
- Update exchange rates periodically from external API
- Display prices in user's preferred currency
\n**2FA Implementation Logic**
- Generate TOTP secret on 2FA setup
- Create QR code for authenticator app
- Generate backup codes
- Store encrypted secret in database
- Verify TOTP code on login
- Implement backup code verification
- Track trusted devices
- Require 2FA for sensitive actions
- **Trigger 2FA setup confirmation notification**
\n### 5.2 Security Infrastructure
- **SSL/TLS Encryption**: HTTPS enforcement across entire platform
- **Database Encryption**: Encryption at rest for sensitive data
- **Password Hashing**: Bcrypt or Argon2 for secure password storage
- **SQL Injection Prevention**: Parameterized queries and input sanitization
- **XSS Protection**: Content Security Policy and output encoding
- **CSRF Protection**: Token-based CSRF prevention
- **Rate Limiting**: API and login rate limiting to prevent abuse
- **DDoS Protection**: Integration with DDoS mitigation services
- **Firewall Rules**: Web Application Firewall (WAF) configuration
- **Security Headers**: Implementation of security headers (HSTS, X-Frame-Options, etc.)\n- **Vulnerability Scanning**: Regular automated security scans
- **Penetration Testing**: Periodic security audits and penetration testing\n- **Data Backup Encryption**: Encrypted backup storage
- **Secure File Upload**: File type validation and malware scanning
- **Admin Session Security**: Secure session management with token rotation
- **API Key Encryption**: Encrypted storage of API keys in database
- **Request Signature Verification**: HMAC-SHA256 signature validation for API requests
- **IP Whitelisting for API**: Restrict API access to authorized IP addresses
- **API Token Expiration**: Configurable token expiration and refresh mechanism
- **Two-Factor Authentication Security**:
  - Encrypted storage of 2FA secrets
  - Rate limiting on 2FA verification attempts
  - Brute force protection for 2FA codes
  - Secure backup code generation and storage
\n### 5.3 Frontend-Backend Integration

#### 5.3.1 Admin Panel Frontend Integration
- **Admin Login Page**: Connect to POST /admin/auth/login endpoint
- **2FA Verification**: Connect to POST /admin/auth/verify-2fa endpoint
- **Dashboard Data Loading**: Fetch from GET /admin/dashboard/stats\n- **Real-time Updates**: WebSocket connection for live data
- **Form Submissions**: POST/PUT requests with CSRF tokens
- **File Uploads**: Multipart form data for images and documents
- **Data Tables**: Pagination, sorting, filtering via API parameters
- **Session Management**: Store JWT token in secure httpOnly cookie
- **Auto-logout**: Implement idle timeout with warning modal
- **Error Handling**: Display user-friendly error messages from API responses
- **Notification Management**: Connect to notification management endpoints for creating templates and sending broadcasts
- **Provider Response Viewing**: Fetch and display provider responses from GET /admin/orders/:id/provider-responses
\n#### 5.3.2 Customer Frontend Integration
- **User Authentication**: Connect to public API auth endpoints
- **Service Browsing**: Fetch categories and services from API
- **Order Placement**: Submit orders via API with wallet validation
- **Payment Submission**: Upload payment proofs with transaction details
- **Real-time Notifications**: WebSocket for instant notification delivery
- **Notification Center**: Display in-app notifications with unread badge
- **Invoice Download**: Generate and download PDF invoices
- **Profile Management**: Update user settings via API
- **2FA Setup**: QR code generation and verification flow
- **Notification Preferences**: Update notification settings via API
- **Order Details Page**: Fetch order details including provider responses from GET /api/v1/orders/{order_id}\n- **Provider Response Display**: Show provider response/replay section with copy functionality
- **Real-time Provider Updates**: WebSocket listener for new provider responses

### 5.4 Deployment & Infrastructure
- **Server Environment**: Linux (Ubuntu/CentOS) with Nginx reverse proxy
- **Application Deployment**: Docker containers with orchestration
- **Database Hosting**: Managed PostgreSQL with automatic backups
- **Redis Hosting**: Managed Redis for caching and queues
- **CDN Integration**: CloudFlare or AWS CloudFront for static assets
- **Load Balancing**: Multiple application servers with load balancer
- **Auto-scaling**: Automatic scaling based on traffic
- **Monitoring**: Application performance monitoring (APM) tools
- **Logging**: Centralized logging with ELK stack or similar
- **CI/CD Pipeline**: Automated testing and deployment
- **Environment Variables**: Secure configuration management
- **SSL Certificates**: Automatic SSL certificate management
- **Message Queue**: RabbitMQ or AWS SQS for notification delivery
- **Push Notification Service**: Firebase Cloud Messaging or OneSignal integration
\n### 5.5 Performance Optimization
- **Database Indexing**: Proper indexes on frequently queried columns
- **Query Optimization**: Optimized database queries with explain plans
- **Caching Strategy**: Redis caching for frequently accessed data
- **API Response Caching**: Cache API responses with appropriate TTL
- **Image Optimization**: Automatic image compression and resizing
- **Lazy Loading**: Lazy load images and components
- **Code Splitting**: Split frontend code for faster loading
- **Minification**: Minify CSS and JavaScript\n- **Gzip Compression**: Enable gzip compression for responses
- **Database Connection Pooling**: Efficient database connection management
- **Notification Queue Optimization**: Batch processing for bulk notifications
- **WebSocket Connection Management**: Efficient real-time connection handling

---

## 6. Design Style\n
### 6.1 Visual Design\n- **Top Advertisement Banner**: Reduced-height horizontal moving banner displaying promotional photos with smooth scrolling animation
- **Search Field**: Positioned directly below the advertisement banner for easy access
- **Language Selector**: Prominent language dropdown in header with flag icons for easy identification
- **Currency Selector**: Currency dropdown in header showing currency symbols and codes
- **Notification Badge**: Unread notification counter badge on notification bell icon in header
- Card-based layout for categories with unified main images representing each service group
- Vibrant blue and purple gradient accents on clean backgrounds
- Smooth animations for category navigation and transitions
- Professional admin panel interface with clear data visualization and comprehensive navigation menu
- Organized settings sidebar with grouped configuration modules
- **API Documentation Portal**: Clean, developer-friendly interface with syntax highlighting and interactive elements
- **Profile Settings Page**: Clean, organized layout with tabbed sections for different profile settings including language and currency preferences
- **2FA Setup Interface**: Step-by-step wizard with QR code display and backup codes presentation
- **Admin Login Page**: Clean, secure login interface with username/email and password fields, CAPTCHA, and 2FA verification
- **Notification Center**: Slide-in panel with categorized notifications and quick action buttons
- **Notification Management Interface**: Admin dashboard for creating templates and sending broadcasts with preview functionality
- **Order Details Page**: Clean, card-based layout with clear information hierarchy and prominent provider response section
- **Provider Response Section**: Distinct visual styling with REPLAY button, collapsible content area, and copy functionality
\n### 6.2 Interactive Elements
- **Advertisement Banner**: Auto-scrolling promotional photos with pause-on-hover functionality
- **Search Field**: Instant search with autocomplete suggestions
- **Language Selector**: Dropdown with search functionality and flag icons
- **Currency Selector**: Dropdown with real-time exchange rate display
- **Notification Bell**: Animated bell icon with unread badge counter and dropdown preview
- **Notification Center**: Slide-in panel with filtering, search, and mark-as-read functionality
- **Real-time Notification Toast**: Pop-up notifications for instant alerts with auto-dismiss
- Expandable category menus with service option selection
- Hover effects on service cards\n- Animated payment method selection interface
- Image upload preview for payment proofs
- **Real-time notification badges** with slide-in animation for new alerts
- Drag-and-drop functionality in admin panel for category management and banner uploads
- Real-time data updates in admin dashboard
- Stock level indicators with color-coded alerts
- **Invoice download button with loading animation**
- **User level badge display on user profiles**
- **Collapsible admin navigation menu** for better space management
- **Quick action buttons** in admin dashboard for common tasks
- **Data tables with sorting and filtering** in admin management pages
- **Contextual tooltips** for admin features and settings
- **Keyboard shortcuts** for common admin actions
- **API Testing Console**: Interactive API endpoint testing with real-time response display
- **Code Snippet Copy Button**: One-click copy for code examples in API documentation
- **Profile Edit Forms**: Inline validation with real-time feedback
- **2FA QR Code Scanner**: Interactive QR code display with copy-to-clipboard functionality
- **Password Strength Indicator**: Real-time password strength visualization
- **Trusted Devices List**: Manage and revoke trusted devices with confirmation dialogs
- **Language Translation Editor**: In-context translation editing for admins
- **Currency Converter Widget**: Real-time currency conversion display on pricing pages
- **Admin Login Form**: Responsive login form with real-time validation and error messages
- **Notification Template Editor**: WYSIWYG editor with variable insertion and preview
- **Broadcast Notification Scheduler**: Calendar interface for scheduling notifications
- **Notification Analytics Dashboard**: Charts and graphs showing delivery rates and engagement\n- **REPLAY Button**: Interactive button that expands/collapses provider response content
- **Provider Response Copy Button**: One-click copy functionality for provider messages
- **Real-time Provider Response Updates**: Automatic refresh and notification when new provider responses arrive
- **Provider Response Timestamp**: Display relative time (e.g., '2 minutes ago') with hover tooltip showing exact timestamp
\n### 6.3 Theme Options
- Light mode: White background with soft shadows and colorful category cards with main images
- Dark mode: Deep dark background with neon highlights and glowing category borders
- Admin panel: Clean, data-focused interface with customizable dashboard widgets and organized navigation structure
- API Documentation: Developer-friendly theme with syntax highlighting and clear code examples
- **RTL Layout**: Fully mirrored layout for right-to-left languages with proper text alignment
- **Admin Login Page**: Professional, secure design with brand colors and trust indicators
- **Notification Center**: Consistent theme with main application, supporting both light and dark modes
- **Order Details Page**: Consistent with main application theme, with distinct styling for provider response section
\n---

## 7. Reference Documentation
- API Documentation Reference: https://api.play4cards.com/api-docs\n\n---

## 8. Reference Images
- Screenshot 2025-12-26 133441.png: Admin dashboard top navigation menu showing Users, Orders, Subscriptions, Drip-feed, Refill, Cancel, Services, Payments, Tickets, Affiliates, Child panels, Updates, Reports, Appearance, and Settings modules
- Screenshot 2025-12-26 133448.png: Admin settings sidebar showing General, Providers, Payments Modules, Integrations, Notifications, Bonuses, Signup form, and Ticket form configuration sections
- image.png: Order details page showing Order ID, Product, Quantity, Total Price, Date, Player ID, and provider response section with REPLAY button and copy functionality
\n---

## 9. Implementation Priority

### Phase 1: Core Backend & Admin System (Highest Priority)
1. Database schema implementation with all tables including notification tables and provider_response_logs table
2. Admin authentication system with login page\n3. Admin dashboard with basic statistics\n4. User management module\n5. Service management module
6. Order management module with provider response handling
7. Payment verification module
8. **Notification system backend implementation**
9. **Provider response notification system**
10. Admin API endpoints for all core functions

### Phase 2: Customer Frontend & Integration\n1. Customer authentication and registration
2. Service browsing and ordering
3. Wallet system and payment submission
4. Order tracking and history
5. **Order details page with provider response display**
6. Profile management with 2FA\n7. **Notification center and real-time notification delivery**
8. **Real-time provider response updates**
9. Frontend-backend API integration
\n### Phase 3: Advanced Features
1. Stock management system
2. Multi-currency and multi-language\n3. Public API system
4. **Complete notification system with all notification types**
5. **Notification preferences and customization**
6. Ticket support system
7. Analytics and reporting
8. **Notification analytics and tracking**
9. **Provider response logs and monitoring**
\n### Phase 4: Additional Modules
1. Affiliate system
2. Subscription management
3. Drip-feed orders
4. Child panels\n5. Advanced security features
6. Performance optimization
7. **Broadcast notification system**
8. **Notification template management**
9. **Provider response analytics**