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
- User registration and login via Supabase Auth (email + password)
- **Two-Step Verification (2FA)**: Mandatory two-factor authentication for all users to protect accounts using authenticator apps (Google Authenticator, Authy, etc.) or SMS verification, **fully integrated with backend API**
- **Profile Management**: Users can view their profile information and **change password only through backend API integration**. The following fields are **read-only and cannot be modified by customers**:
  - Username (read-only)
  - Email address (read-only)
  - Phone number (read-only)
  - Display name (read-only)
  - Profile picture (read-only)
  - **Language preference selection from all supported languages**
  - **Currency preference selection from all supported currencies**\n  - Communication preferences\n- **Password Change**: Users can change their password through **backend-connected API endpoint**
- Personal wallet system\n- Balance top-up functionality
- Order history tracking
- **Invoice generation for orders**
- Security settings with 2FA management **connected to backend**
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
- **Profile Update Confirmation**: Notification when profile information is changed
  - Notification content: Changed fields, update timestamp, IP address, 'Not you?' action link\n- **2FA Status Change**: Notification when 2FA is enabled or disabled
  - Notification content: Status change, timestamp, device information, security recommendations

#### 2.6.6 Support & Ticket Notifications
- **Ticket Created**: Confirmation when support ticket is submitted
  - Notification content: Ticket number, subject, estimated response time
- **Ticket Reply**: Notification when admin responds to ticket
  - Notification content: Ticket number, reply preview, link to full conversation
- **Ticket Status Update**: Notification when ticket status changes\n  - Notification content: Ticket number, new status, next steps
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
- **API Documentation Portal**: Interactive API documentation similar to https://api.play4cards.com/api-docs\n- **RESTful API Architecture**: Standard REST endpoints with JSON request/response format
- **API Authentication**: Secure API key-based authentication for all requests
- **API Versioning**: Version control system (v1, v2, etc.) for backward compatibility
\n**Available API Endpoints:**
\n**Authentication & Account Management:**
- POST /api/v1/auth/register - Register new API user
- POST /api/v1/auth/login - Authenticate and get API token
- GET /api/v1/account/balance - Check wallet balance
- GET /api/v1/account/profile - Get user profile information (username, email, phone, display name, language, currency are read-only)
- **PUT /api/v1/account/password - Change password (only password modification allowed for customers)**
- **POST /api/v1/account/2fa/setup - Initialize 2FA setup and get QR code**
- **POST /api/v1/account/2fa/verify - Verify and enable 2FA with TOTP code**
- **POST /api/v1/account/2fa/disable - Disable 2FA with verification**
- **GET /api/v1/account/2fa/backup-codes - Get backup codes**
- **POST /api/v1/account/2fa/regenerate-backup-codes - Regenerate backup codes**
\n**Services & Pricing:**
- GET /api/v1/services - List all available services
- GET /api/v1/services/{id} - Get specific service details\n- GET /api/v1/services/categories - List all service categories
- GET /api/v1/services/search - Search services by keyword
- GET /api/v1/pricing/{service_id} - Get current pricing for service
\n**Order Management:**
- POST /api/v1/orders/create - Create new order
- GET /api/v1/orders/{order_id} - Get order status and details
- GET /api/v1/orders/list - List all orders with filters
- POST /api/v1/orders/{order_id}/cancel - Request order cancellation
- GET /api/v1/orders/{order_id}/invoice - Download order invoice
- **GET /api/v1/orders/{order_id}/provider-response - Get provider response/replay for order**
\n**Wallet Operations:**
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

#### 2.11.2 Admin Preview/Testing Mode
- **Preview Mode Toggle**: Enable/disable preview mode for testing and demonstration purposes
- **Preview Mode Features**:
  - **Bypass Authentication**: Skip login authentication when preview mode is enabled
  - **Auto-Login as Test Admin**: Automatically log in as a test administrator account
  - **Mock Data Access**: Use seeded or mock admin data for testing
  - **Test Credentials**: Provide test admin credentials for preview access
    - Test Email: admin@preview.test
    - Test Password: PreviewAdmin2025!\n  - **Magic Login Link**: Generate temporary magic login links for instant admin access
  - **Preview Mode Indicator**: Clear visual banner indicating 'PREVIEW MODE' or 'TEST ENVIRONMENT' at top of admin dashboard
  - **Session Duration**: Preview sessions expire after 2 hours of inactivity
  - **Limited Permissions**: Preview mode has read-only access by default, with option to enable write operations
  - **Data Isolation**: Preview mode uses separate test database or clearly marked test data
- **Preview Mode Configuration**:
  - Enable/disable preview mode via admin settings or environment variable
  - Configure preview mode permissions (read-only, full access, custom)\n  - Set preview session timeout duration
  - Generate and manage magic login tokens
  - View preview mode access logs
- **Preview Mode Security**:
  - Preview mode disabled by default in production
  - Require Super Admin approval to enable preview mode
  - Log all preview mode access attempts
  - Automatic notification to Super Admin when preview mode is activated
  - Preview mode automatically disabled after specified time period
  - Clear warning messages about preview mode limitations
- **Preview Mode UI Elements**:
  - Prominent banner at top of screen: 'PREVIEW MODE - Testing Environment'
  - Different color scheme or visual indicator for preview mode
  - Disable preview mode button accessible from admin dashboard
  - Preview mode status indicator in admin profile menu
- **Preview Mode API Endpoints**:
  - POST /admin/preview/enable - Enable preview mode (Super Admin only)
  - POST /admin/preview/disable - Disable preview mode\n  - POST /admin/preview/magic-login - Generate magic login link\n  - GET /admin/preview/status - Check preview mode status
  - GET /admin/preview/test-credentials - Get test admin credentials
\n#### 2.11.3 Comprehensive Dashboard Navigation
Full navigation menu with the following modules:
- **Dashboard Home**: Overview with key metrics, recent activities, and quick action buttons
- **Users**: Manage user accounts, permissions, wallet balances, activity, user level assignments, profile information, 2FA status, and bulk user operations
- **Orders**: View, process, update, edit links, resend orders, cancel and refund, set partial, pull and update orders, **view provider responses**, export order data\n- **Subscriptions**: Manage recurring subscription services, billing cycles, renewal settings, and subscription analytics
- **Drip-feed**: Configure and manage drip-feed order delivery settings, scheduling, and automation rules
- **Refill**: Handle refill requests, pull refill tasks, change refill status, and refill history tracking
- **Cancel**: Manage cancellation requests, pull cancel tasks, reject cancellations, and cancellation analytics
- **Services**: Add, edit, delete services and categories; update pricing and availability; import services via API with profit markup; bulk service management
- **Payments**: Review and approve/reject balance top-up requests; add payments; view payment lists and user details; payment gateway configuration; transaction monitoring
- **Tickets**: View and respond to customer support tickets; manage ticket workflow; ticket categorization; SLA tracking; canned responses\n- **Affiliates**: Manage affiliate program, track referrals, commission payouts, affiliate performance analytics, and commission rules
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
- **Preview Mode**: Enable/disable preview mode, manage test credentials, generate magic login links, and view preview access logs

#### 2.11.4 Settings Sidebar Modules
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
- **Tax Configuration**: Set up tax rules, VAT settings, and regional tax compliance\n- **Terms & Policies**: Manage Terms of Service, Privacy Policy, Refund Policy, and legal documents
- **GDPR Compliance**: Configure data retention policies, user data export, and right to be forgotten features
- **Rate Limiting**: Configure API rate limits, request throttling, and abuse prevention
- **Cache Management**: Configure caching settings, clear cache, and optimize performance
- **Security Settings**: Configure 2FA enforcement policies, password policies, session management, and security alerts
- **Preview Mode Settings**: Configure preview mode options, test credentials, session duration, and access permissions
\n#### 2.11.5 Additional Admin Features
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
- **Scheduled Tasks**: Configure automated tasks (reports, backups, notifications, cleanups)\n- **Webhook Management**: Configure webhooks for external integrations and event notifications
- **Custom Fields**: Add custom fields to users, orders, and services for extended data collection
- **Fraud Detection**: Automated fraud detection rules, suspicious activity alerts, and blacklist management
- **Performance Monitoring**: Real-time server performance metrics, database optimization tools, and bottleneck identification
- **Multi-Admin Collaboration**: Admin notes, task assignment, internal messaging, and collaboration tools
- **Version Control**: Track changes to services, prices, and configurations with rollback capability
- **Language Management**: Add, edit, and manage all language translations; import/export language files; set language availability per region
- **Currency Management**: Add, edit, and manage all supported currencies; configure exchange rate sources; set currency availability per region; manage currency conversion rules
- **Notification Management**: Create and manage notification templates, send broadcast notifications, view notification analytics, configure delivery settings
- **Preview Mode Management**: Enable/disable preview mode, configure test environment, manage test credentials, generate magic login links, view preview access logs

---

## 3. Website Pages

### 3.1 Customer-Facing Pages
1. **Home** - Main landing page with reduced-height advertisement banner at top, search field below banner, and service categories\n2. **Wallet** - User wallet management and balance display with multi-currency support
3. **Add Balance** - Wallet recharge page with multiple payment methods and currency selection
4. **My Orders** - Order history and status tracking with invoice generation option
5. **Order Details** - Detailed order information page with provider response/replay section, copy functionality, and real-time updates
6. **Profile Settings** - User profile viewing page **with backend-connected password change functionality only**. Username, email, phone number, display name, and profile picture are **read-only fields**. Users can view language preference and currency preference settings.
7. **Security** - Account security settings including **backend-connected 2FA setup**, trusted devices management, login history, and password change\n8. **API** - Customer API documentation, key management, and testing console
9. **API Documentation** - Interactive API documentation portal with code examples and testing tools
10. **About Us** - Company information and contact details
11. **Service Category Pages** - Dedicated pages for each main service type (Games, Apps, Streaming, Gift Cards) with category/subcategory navigation and unified category images
12. **Notifications** - Notification center displaying all user notifications with filtering and search capabilities
\n### 3.2 Admin-Only Pages
1. **Admin Login** - Secure authentication page with username/email and password fields, CAPTCHA protection, and 2FA verification for administrators only
2. **Admin Preview Login** - Simplified login page for preview/testing mode with test credentials display and magic login option
3. **Admin Dashboard** - Overview of site statistics and quick access to all management modules with preview mode indicator banner
4. **Admin Profile Settings** - Admin profile management page for editing email, password, phone number, display name, profile picture, and 2FA settings\n5. **Users Management** - Interface for managing user accounts, permissions, levels, activity, profile information, and 2FA status
6. **Orders Management** - Interface for managing all customer orders with full control options and provider response viewing
7. **Subscriptions Management** - Interface for managing recurring subscription services\n8. **Drip-feed Management** - Interface for configuring drip-feed delivery settings\n9. **Refill Management** - Interface for handling refill requests and tasks
10. **Cancel Management** - Interface for managing cancellation requests\n11. **Services Management** - Interface for managing services, categories, pricing, and imports
12. **Payments Management** - Interface for reviewing balance top-up requests and payment verification
13. **Tickets Management** - Interface for handling customer support tickets
14. **Affiliates Management** - Interface for managing affiliate program and commissions
15. **Child Panels Management** - Interface for managing reseller sub-panels\n16. **Updates** - Interface for viewing system updates and changelog
17. **Reports & Analytics** - Interface for viewing site statistics and performance data
18. **Appearance Settings** - Interface for customizing site visual design
19. **General Settings** - Interface for basic site configuration
20. **Providers Settings** - Interface for managing service provider API connections
21. **Payments Modules Settings** - Interface for configuring payment gateway integrations
22. **Integrations Settings** - Interface for connecting third-party services\n23. **Notifications Settings** - Interface for configuring notification system
24. **Bonuses Settings** - Interface for setting up bonus programs
25. **Signup Form Settings** - Interface for customizing registration form\n26. **Ticket Form Settings** - Interface for configuring support ticket form\n27. **API Settings** - Interface for configuring public API parameters and documentation\n28. **User Level Management** - Interface for creating and managing user levels with custom discount rates
29. **Stock Management** - Interface for inventory control of digital products
30. **Stock Manager Management** - Interface for assigning and managing stock manager roles\n31. **Category Management** - Interface for organizing services and uploading category main images
32. **Advertisement Management** - Interface for uploading and managing top banner promotional content
33. **Admin API v2 Management** - Interface for creating, editing, and managing API keys with granular permission settings
34. **Public API Management** - Interface for managing public API settings, monitoring usage, and configuring rate limits
35. **API Logs & Monitoring** - Interface for viewing API request logs, error tracking, and usage analytics
36. **Admin Roles & Permissions** - Interface for creating custom admin roles and assigning granular permissions
37. **Security Center** - Interface for managing security settings, viewing security logs, configuring 2FA policies, and configuring protection rules
38. **Logs & Monitoring** - Interface for viewing system logs, admin activity logs, and real-time monitoring\n39. **Backup & Restore** - Interface for managing database backups and restoration
40. **Email Templates** - Interface for managing email notification templates\n41. **SMS Gateway** - Interface for configuring SMS settings\n42. **Bulk Operations** - Interface for performing bulk actions across multiple records
43. **Scheduled Tasks** - Interface for configuring automated tasks and cron jobs
44. **Webhook Management** - Interface for managing webhook integrations\n45. **Fraud Detection** - Interface for configuring fraud rules and viewing suspicious activities
46. **Performance Dashboard** - Interface for monitoring system performance and optimization
47. **Language Management** - Interface for adding, editing, and managing all language translations; import/export language files; configure language availability\n48. **Currency Management** - Interface for adding, editing, and managing all supported currencies; configure exchange rates; set currency availability per region\n49. **Notification Management** - Interface for creating notification templates, sending broadcast notifications, viewing notification analytics, and managing notification delivery settings
50. **Notification Analytics** - Interface for tracking notification performance metrics, delivery rates, and user engagement
51. **Provider Response Logs** - Interface for viewing all provider responses/replays, monitoring provider communication, and troubleshooting order issues
52. **Preview Mode Management** - Interface for enabling/disabling preview mode, configuring test environment, managing test credentials, generating magic login links, and viewing preview access logs

---

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
- **Database**: **Supabase (PostgreSQL)** with Redis for caching
- **ORM**: Sequelize (Node.js) or SQLAlchemy (Python)
- **API Architecture**: RESTful API with JSON format\n- **Authentication**: **Supabase Auth with JWT tokens**
- **File Storage**: Supabase Storage for images and documents\n- **Queue System**: Bull (Node.js) or Celery (Python) for background jobs
- **Real-time Communication**: Supabase Realtime for live updates
- **Email Service**: SendGrid or AWS SES\n- **SMS Service**: Twilio or similar provider
- **Push Notification Service**: Firebase Cloud Messaging (FCM) or OneSignal
\n#### 5.1.2 Supabase Integration Configuration
\n**Supabase Project Details:**
- **Project URL**: https://hbqeslmfietqvdbkaqsy.supabase.co
- **Anon Public Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicWVzbG1maWV0cXZkYmthcXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDAyOTIsImV4cCI6MjA4MjQxNjI5Mn0.rG8pkDL-ygFWT_xzV5Yh0GixNc4YDJ3xK77xxZKT0yA
\n**Supabase Integration Setup:**
\n1. **Database Connection**:
   - Use Supabase PostgreSQL database for all data storage
   - Connect via Supabase client library (@supabase/supabase-js)
   - Initialize Supabase client with project URL and anon key
   - Configure connection pooling for optimal performance

2. **Authentication Integration**:
   - **Use Supabase Auth for all user authentication (email + password)**
   - **Configure JWT token validation with Supabase**
   - **Implement Row Level Security (RLS) policies for data access control**
   - **Set up custom claims for admin roles and permissions**
   - **Default user role: 'user'**
   - **Admin role: 'admin' (manually assigned via SQL or admin interface)**

3. **Real-time Features**:
   - Use Supabase Realtime for live order updates
   - Subscribe to database changes for notification delivery
   - Implement real-time provider response updates
   - Configure WebSocket connections via Supabase Realtime\n
4. **Storage Integration**:
   - Use Supabase Storage for file uploads (payment proofs, images, documents)
   - Configure storage buckets for different file types
   - Implement secure file access with signed URLs
   - Set up automatic image optimization and resizing

5. **API Integration**:
   - Use Supabase REST API for database operations
   - Implement Supabase client-side queries for frontend\n   - Configure API rate limiting via Supabase
   - Set up custom API endpoints using Supabase Edge Functions

6. **Security Configuration**:
   - Enable Row Level Security (RLS) on all tables
   - Configure RLS policies for user data isolation
   - Set up admin-only access policies for sensitive tables
   - Implement API key rotation and management
\n7. **Environment Variables**:
   ```\n   SUPABASE_URL=https://hbqeslmfietqvdbkaqsy.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicWVzbG1maWV0cXZkYmthcXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDAyOTIsImV4cCI6MjA4MjQxNjI5Mn0.rG8pkDL-ygFWT_xzV5Yh0GixNc4YDJ3xK77xxZKT0yA
   SUPABASE_SERVICE_ROLE_KEY=[To be configured in Supabase dashboard]
   ```

8. **Database Migration**:
   - Create all database tables in Supabase PostgreSQL
   - Use Supabase Migration tool for schema management
   - Implement database versioning and rollback capability
   - Set up automated backups via Supabase\n
9. **Supabase Client Initialization Example**:
   ```javascript
   import { createClient } from '@supabase/supabase-js'\n\n   const supabaseUrl = 'https://hbqeslmfietqvdbkaqsy.supabase.co'
   const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicWVzbG1maWV0cXZkYmthcXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDAyOTIsImV4cCI6MjA4MjQxNjI5Mn0.rG8pkDL-ygFWT_xzV5Yh0GixNc4YDJ3xK77xxZKT0yA'
\n   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```\n
10. **Supabase Features to Utilize**:
    - **Supabase Auth**: User authentication and authorization
    - **Supabase Database**: PostgreSQL database with REST API
    - **Supabase Storage**: File storage and management
    - **Supabase Realtime**: Real-time database subscriptions
    - **Supabase Edge Functions**: Serverless functions for custom logic
    - **Supabase Studio**: Database management interface
\n#### 5.1.3 Complete Database Schema

**Profiles Table (profiles)** - Linked to auth.users\n- id (Primary Key, UUID, references auth.users.id)
- username (Unique, String)\n- email (String, synced from auth.users.email)
- phone_number (String)\n- display_name (String)\n- profile_picture_url (String)
- **role (String, default: 'user')** - Values: 'user', 'admin', 'stock_manager'\n- user_level_id (Foreign Key → user_levels.id)
- wallet_balance (Decimal, default: 0)\n- total_spent (Decimal, default: 0)
- preferred_language (String, default: 'en')
- preferred_currency (String, default: 'USD')
- two_factor_enabled (Boolean, default: false)
- two_factor_secret (Encrypted String)\n- backup_codes (Encrypted JSON Array)
- email_verified (Boolean)\n- account_status (Enum: active, suspended, banned, default: 'active')
- notification_preferences (JSON Object)
- created_at (Timestamp, default: now())
- updated_at (Timestamp, default: now())\n- last_login_at (Timestamp)
- last_login_ip (String)
\n**RLS Policies for Profiles Table:**
```sql
-- Users can view their own profile
CREATE POLICY 'Users can view own profile' ON profiles\n  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (limited fields)
CREATE POLICY 'Users can update own profile' ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY 'Admins can view all profiles' ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all profiles\nCREATE POLICY 'Admins can update all profiles' ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**Admin Sessions Table (admin_sessions)**
- id (Primary Key, UUID)\n- admin_user_id (Foreign Key → profiles.id)
- session_token (Unique, String)
- ip_address (String)
- user_agent (String)
- is_preview_session (Boolean, default: false)
- expires_at (Timestamp)
- created_at (Timestamp)
- last_activity_at (Timestamp)\n\n**Admin Activity Logs Table (admin_activity_logs)**
- id (Primary Key, UUID)
- admin_user_id (Foreign Key → profiles.id)
- action_type (String)\n- action_description (Text)
- affected_resource_type (String)
- affected_resource_id (String)
- ip_address (String)
- user_agent (String)
- is_preview_mode (Boolean)\n- request_data (JSON)
- response_data (JSON)
- created_at (Timestamp)
\n**Preview Mode Settings Table (preview_mode_settings)**
- id (Primary Key, UUID)
- is_enabled (Boolean, default: false)
- enabled_by_admin_id (Foreign Key → profiles.id)
- enabled_at (Timestamp)
- auto_disable_at (Timestamp)
- permissions_level (Enum: read_only, full_access, custom)\n- custom_permissions (JSON Object)
- session_timeout_minutes (Integer, default: 120)
- test_admin_email (String, default: 'admin@preview.test')
- test_admin_password_hash (String)
- magic_login_token (Encrypted String)
- magic_login_expires_at (Timestamp)
- created_at (Timestamp)
- updated_at (Timestamp)\n
**Preview Mode Access Logs Table (preview_mode_access_logs)**
- id (Primary Key, UUID)
- access_type (Enum: test_credentials, magic_login, auto_login)
- ip_address (String)
- user_agent (String)
- session_id (Foreign Key → admin_sessions.id)
- accessed_at (Timestamp)
- session_ended_at (Timestamp)
\n**User Levels Table (user_levels)**
- id (Primary Key, UUID)
- level_name (String)
- level_description (Text)
- discount_percentage (Decimal)\n- level_order (Integer)\n- created_at (Timestamp)
- updated_at (Timestamp)

**Categories Table (categories)**
- id (Primary Key, UUID)
- category_name (String)
- category_slug (Unique, String)
- category_type (Enum: game, app, streaming, gift_card)\n- parent_category_id (Foreign Key → categories.id, Nullable)
- main_image_url (String)
- description (Text)
- display_order (Integer)
- is_active (Boolean)\n- created_at (Timestamp)
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
- user_id (Foreign Key → profiles.id)
- service_id (Foreign Key → services.id)
- quantity (Integer)
- unit_price (Decimal)
- discount_amount (Decimal)
- total_amount (Decimal)
- currency (String)
- player_id (String)\n- order_status (Enum: pending, processing, completed, failed, cancelled, refunded, partial)\n- provider_order_id (String)\n- provider_response (JSON)
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
\n**Stock Items Table (stock_items)**
- id (Primary Key, UUID)
- service_id (Foreign Key → services.id)
- stock_code (Encrypted String)
- stock_type (Enum: gift_card, netflix_code, shahid_code, pubg_code, other)
- denomination (Decimal)
- currency (String)
- status (Enum: available, sold, reserved, expired)\n- added_by_admin_id (Foreign Key → profiles.id)
- sold_in_order_id (Foreign Key → orders.id, Nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
- sold_at (Timestamp)
\n**Wallet Transactions Table (wallet_transactions)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → profiles.id)
- transaction_type (Enum: credit, debit, refund, bonus)\n- amount (Decimal)
- currency (String)
- balance_before (Decimal)
- balance_after (Decimal)
- description (Text)
- reference_type (String)
- reference_id (String)
- created_at (Timestamp)
\n**Payment Requests Table (payment_requests)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → profiles.id)
- payment_method (String)
- amount (Decimal)\n- currency (String)
- transaction_id (String)
- payment_proof_url (String)
- transaction_details (JSON)
- status (Enum: pending, approved, rejected)\n- reviewed_by_admin_id (Foreign Key → profiles.id, Nullable)
- review_notes (Text)
- created_at (Timestamp)
- updated_at (Timestamp)
- reviewed_at (Timestamp)
\n**Invoices Table (invoices)**
- id (Primary Key, UUID)\n- invoice_number (Unique, String)\n- order_id (Foreign Key → orders.id)
- user_id (Foreign Key → profiles.id)
- invoice_date (Timestamp)
- total_amount (Decimal)
- currency (String)
- pdf_url (String)
- created_at (Timestamp)
\n**Tickets Table (tickets)**
- id (Primary Key, UUID)
- ticket_number (Unique, String)\n- user_id (Foreign Key → profiles.id)
- subject (String)
- category (String)
- priority (Enum: low, medium, high, urgent)
- status (Enum: open, in_progress, waiting_customer, resolved, closed)
- language (String)
- assigned_to_admin_id (Foreign Key → profiles.id, Nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
- closed_at (Timestamp)
\n**Ticket Messages Table (ticket_messages)**
- id (Primary Key, UUID)\n- ticket_id (Foreign Key → tickets.id)
- sender_type (Enum: user, admin)\n- sender_id (String)
- message_content (Text)
- attachments (JSON Array)
- created_at (Timestamp)

**Notifications Table (notifications)**
- id (Primary Key, UUID)
- user_id (Foreign Key → profiles.id, Nullable)
- admin_user_id (Foreign Key → profiles.id, Nullable)
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
- created_by_admin_id (Foreign Key → profiles.id)\n- created_at (Timestamp)
- updated_at (Timestamp)
\n**Notification Preferences Table (notification_preferences)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → profiles.id)
- notification_type (String)
- in_app_enabled (Boolean)
- email_enabled (Boolean)
- sms_enabled (Boolean)
- push_enabled (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

**Broadcast Notifications Table (broadcast_notifications)**
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
- created_by_admin_id (Foreign Key → profiles.id)
- status (Enum: draft, scheduled, sending, sent, failed)
- created_at (Timestamp)
- updated_at (Timestamp)

**API Keys Table (api_keys)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → profiles.id, Nullable)
- admin_user_id (Foreign Key → profiles.id, Nullable)
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
- id (Primary Key, UUID)\n- user_id (Foreign Key → profiles.id)
- webhook_url (String)
- event_types (JSON Array)
- secret_key (Encrypted String)
- is_active (Boolean)
- last_triggered_at (Timestamp)
- created_at (Timestamp)
- updated_at (Timestamp)\n
**Subscriptions Table (subscriptions)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → profiles.id)
- service_id (Foreign Key → services.id)
- subscription_status (Enum: active, paused, cancelled, expired)
- billing_cycle (Enum: daily, weekly, monthly, yearly)
- next_billing_date (Timestamp)\n- created_at (Timestamp)
- updated_at (Timestamp)
- cancelled_at (Timestamp)
\n**Drip Feed Orders Table (drip_feed_orders)**
- id (Primary Key, UUID)
- order_id (Foreign Key → orders.id)
- total_quantity (Integer)
- delivered_quantity (Integer)
- delivery_interval_minutes (Integer)
- next_delivery_at (Timestamp)
- status (Enum: active, paused, completed, cancelled)
- created_at (Timestamp)
- updated_at (Timestamp)

**Refill Requests Table (refill_requests)**
- id (Primary Key, UUID)
- order_id (Foreign Key → orders.id)
- user_id (Foreign Key → profiles.id)
- refill_status (Enum: pending, processing, completed, rejected)
- reason (Text)
- created_at (Timestamp)\n- updated_at (Timestamp)
- completed_at (Timestamp)

**Cancel Requests Table (cancel_requests)**
- id (Primary Key, UUID)
- order_id (Foreign Key → orders.id)
- user_id (Foreign Key → profiles.id)
- cancel_status (Enum: pending, processing, approved, rejected)
- reason (Text)
- reviewed_by_admin_id (Foreign Key → profiles.id, Nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
- reviewed_at (Timestamp)

**Affiliates Table (affiliates)**
- id (Primary Key, UUID)\n- user_id (Foreign Key → profiles.id)
- referral_code (Unique, String)
- commission_rate (Decimal)
- total_referrals (Integer)
- total_earnings (Decimal)
- created_at (Timestamp)
- updated_at (Timestamp)
\n**Affiliate Transactions Table (affiliate_transactions)**
- id (Primary Key, UUID)\n- affiliate_id (Foreign Key → affiliates.id)
- referred_user_id (Foreign Key → profiles.id)
- order_id (Foreign Key → orders.id)
- commission_amount (Decimal)
- status (Enum: pending, paid)\n- created_at (Timestamp)
- paid_at (Timestamp)
\n**Child Panels Table (child_panels)**
- id (Primary Key, UUID)\n- parent_user_id (Foreign Key → profiles.id)
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
- rate (Decimal)\n- source (String)
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
- status (Enum: in_progress, completed, failed)\n- created_by_admin_id (Foreign Key → profiles.id)
- created_at (Timestamp)
- completed_at (Timestamp)
\n#### 5.1.4 Backend API Endpoints Structure

**Authentication Endpoints (Supabase Auth)**
- POST /auth/signup - Register new user (creates auth.users + profiles entry with role='user')
- POST /auth/login - User login via Supabase Auth\n- POST /auth/logout - User logout\n- POST /auth/refresh - Refresh JWT token
- GET /auth/user - Get current authenticated user
- POST /auth/reset-password - Request password reset
- POST /auth/update-password - Update password
\n**Admin Authentication Endpoints**
- POST /admin/auth/login - Admin login (checks role='admin' in profiles table)
- POST /admin/auth/verify-2fa - Verify 2FA code
- POST /admin/auth/logout - Admin logout
- POST /admin/auth/refresh-token - Refresh session token
- GET /admin/auth/session - Get current session info
- **GET /admin/auth/check-role - Verify user has admin role**

**Admin Preview Mode Endpoints**
- POST /admin/preview/enable - Enable preview mode (Super Admin only)
- POST /admin/preview/disable - Disable preview mode\n- POST /admin/preview/magic-login - Generate magic login link
- GET /admin/preview/status - Check preview mode status
- GET /admin/preview/test-credentials - Get test admin credentials
- POST /admin/preview/auto-login - Auto-login as test admin
- GET /admin/preview/access-logs - View preview mode access logs
\n**Admin Dashboard Endpoints**
- GET /admin/dashboard/stats - Get dashboard statistics
- GET /admin/dashboard/recent-activity - Get recent activities
- GET /admin/dashboard/alerts - Get system alerts
\n**Admin User Management Endpoints**
- GET /admin/users - List all users with filters
- GET /admin/users/:id - Get user details
- POST /admin/users - Create new user
- PUT /admin/users/:id - Update user
- DELETE /admin/users/:id - Delete user\n- **PUT /admin/users/:id/role - Update user role (user/admin/stock_manager)**
- PUT /admin/users/:id/level - Assign user level\n- PUT /admin/users/:id/wallet - Adjust wallet balance
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

**Admin Service Management Endpoints**
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
\n**Admin Notification Management Endpoints**
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

**Admin Security Endpoints**
- GET /admin/security/logs - View security logs
- GET /admin/security/failed-logins - View failed login attempts
- POST /admin/security/ip-whitelist - Add IP to whitelist
- DELETE /admin/security/ip-whitelist/:ip - Remove IP from whitelist
\n**Admin Backup Endpoints**
- GET /admin/backups - List backups
- POST /admin/backups/create - Create backup
- POST /admin/backups/:id/restore - Restore backup\n- DELETE /admin/backups/:id - Delete backup
\n#### 5.1.5 Backend Business Logic Implementation

**User Registration Logic (Supabase Auth)**
- User submits registration form with email and password
- Call Supabase Auth signup API: `supabase.auth.signUp({ email, password })`
- Supabase creates entry in auth.users table
- **Trigger: Create corresponding entry in profiles table**
  - Set id = auth.users.id (UUID)
  - Set email = auth.users.email\n  - **Set role = 'user' (default)**
  - Set account_status = 'active'\n  - Set created_at = now()
- Send email verification link
- Return success response

**User Login Logic (Supabase Auth)**
- User submits email and password
- Call Supabase Auth login API: `supabase.auth.signInWithPassword({ email, password })`\n- Supabase validates credentials and returns JWT token
- Fetch user profile from profiles table using auth.uid()
- Check account_status (active/suspended/banned)
- If 2FA enabled, require TOTP verification
- Update last_login_at and last_login_ip in profiles table
- Return JWT token and user profile data
- **Store JWT token in secure httpOnly cookie or localStorage**

**Admin Login Logic**
- Admin submits email/username and password on admin login page
- Call Supabase Auth login API: `supabase.auth.signInWithPassword({ email, password })`
- Supabase validates credentials and returns JWT token
- **Fetch user profile from profiles table using auth.uid()**
- **Check if role = 'admin' in profiles table**
- **If role != 'admin', reject login and return error: 'Access denied. Admin privileges required.'**
- If role = 'admin', proceed with admin authentication
- Verify CAPTCHA token
- Check account_status\n- Require 2FA verification\n- Create admin session record in admin_sessions table
- Log login attempt in admin_activity_logs\n- Update last_login_at and last_login_ip\n- Return JWT token with admin permissions
- Redirect to admin dashboard

**Admin Authorization Middleware**
- Verify JWT token on each admin request
- Extract user ID from JWT token
- **Fetch user profile from profiles table**
- **Check if role = 'admin'**
- **If role != 'admin', return 403 Forbidden error**
- Check admin session is not expired
- Validate IP address if IP whitelisting enabled
- Log all admin actions in admin_activity_logs
- **Check if session is preview mode and apply appropriate restrictions**
- **Display preview mode banner if is_preview_session = true**
- Allow request to proceed if all checks pass

**Admin Route Protection (Frontend)**
- On admin dashboard page load, check if user is authenticated
- Call GET /admin/auth/check-role endpoint
- **Backend verifies JWT token and checks role = 'admin'**
- If role != 'admin', redirect to login page or show access denied message
- If role = 'admin', allow access to admin dashboard
- Persist auth state on page refresh using JWT token

**Creating Test Admin User**
- **Option 1: SQL Command (Recommended for initial setup)**
  ```sql\n  -- First, create user via Supabase Auth signup
  -- Then, promote user to admin using SQL:\n  UPDATE profiles\n  SET role = 'admin'\n  WHERE email = 'admin@example.com';
  ```
\n- **Option 2: Admin Interface (After first admin is created)**
  - Super Admin logs into admin dashboard
  - Navigate to Users Management\n  - Select user to promote\n  - Click 'Change Role' button
  - Select 'admin' from dropdown
  - Confirm role change
  - Backend updates profiles.role = 'admin'
\n- **Option 3: Supabase Dashboard**
  - Open Supabase project dashboard
  - Navigate to Table Editor
  - Open profiles table
  - Find user by email
  - Edit role column and set to 'admin'
  - Save changes
\n**Session Persistence on Refresh**
- Store JWT token in secure httpOnly cookie or localStorage
- On page load, check if JWT token exists\n- If token exists, validate token with Supabase: `supabase.auth.getSession()`
- If token valid, fetch user profile and check role
- If role = 'admin', restore admin session
- If token invalid or expired, redirect to login page
- Implement automatic token refresh before expiration

**Admin Preview Mode Logic**
- **Enable Preview Mode**:\n  - Verify Super Admin permissions (role = 'admin' + additional super_admin flag)
  - Create or update preview_mode_settings record
  - Set is_enabled = true
  - Generate test admin credentials if not exists
  - Create magic login token with expiration
  - Set auto-disable timestamp
  - Send notification to Super Admin
  - Log preview mode activation

- **Disable Preview Mode**:
  - Update preview_mode_settings.is_enabled = false
  - Invalidate all preview sessions
  - Clear magic login tokens
  - Log preview mode deactivation
  - Send notification to Super Admin

- **Test Credentials Login**:
  - Check if preview mode is enabled
  - Validate test credentials against preview_mode_settings
  - Skip 2FA verification for preview accounts
  - Create preview session with is_preview_session = true
  - Set session timeout based on preview_mode_settings
  - Log access in preview_mode_access_logs
  - Return JWT token with preview mode flag

- **Magic Login**:
  - Validate magic login token
  - Check token expiration
  - Create preview session automatically
  - Log magic login access
  - Redirect to admin dashboard with preview banner

- **Auto-Login**:
  - Check if preview mode is enabled
  - Bypass authentication entirely
  - Create temporary preview session
  - Load mock admin data
  - Display preview mode indicator
  - Log auto-login access

- **Preview Mode Session Management**:
  - Track preview session activity
  - Enforce shorter session timeout (default 2 hours)
  - Auto-logout on inactivity
  - Log all preview mode actions with is_preview_mode flag
  - Restrict write operations based on permissions_level

- **Preview Mode Auto-Disable**:
  - Background job checks auto_disable_at timestamp
  - Automatically disable preview mode when time expires
  - Invalidate all preview sessions
  - Send notification to Super Admin
  - Log auto-disable event

**User Profile View Logic**
- **Validate user authentication token**
- **Fetch user profile data from profiles table using auth.uid()**
- **Return read-only fields: username, email, phone_number, display_name, profile_picture_url**
- **Return editable preferences: preferred_language, preferred_currency, notification_preferences**
- **All profile fields except password are read-only for customers**

**Password Change Logic**
- **Validate user authentication token**
- **Call Supabase Auth update password API: `supabase.auth.updateUser({ password: newPassword })`**
- **Validate new password meets security requirements (minimum length, complexity)**
- **Supabase handles password hashing and storage**
- **Create password change confirmation notification**
- **Log password change action with timestamp and IP address**
- **Send security notification email to user**
- **Return success response**

**2FA Setup and Management Logic**
- **2FA Setup Initialization**:
  - Generate unique TOTP secret using speakeasy or similar library
  - Create QR code containing secret and user identifier
  - Generate 10 backup codes (random alphanumeric strings)
  - Store encrypted secret and backup codes in profiles table (two_factor_secret, backup_codes)
  - Return QR code and backup codes to user\n  - Set two_factor_enabled = false until verification

- **2FA Verification and Activation**:
  - User scans QR code with authenticator app
  - User enters TOTP code from app
  - Verify TOTP code against stored secret
  - If valid: Set two_factor_enabled = true\n  - Create notification for 2FA setup confirmation
  - Log 2FA activation with timestamp and device info
\n- **2FA Login Verification**:
  - After username/password validation via Supabase Auth
  - Check if two_factor_enabled = true in profiles table
  - Prompt user for TOTP code
  - Verify code against stored secret with time window tolerance
  - Allow backup code usage if TOTP unavailable
  - Mark used backup codes as invalid
  - Track failed 2FA attempts and implement lockout after 5 failures
  - Log successful 2FA verification

- **2FA Disable**:
  - Require current password verification via Supabase Auth
  - Require valid TOTP code or backup code
  - Set two_factor_enabled = false\n  - Clear two_factor_secret and backup_codes
  - Create notification for 2FA status change
  - Log 2FA deactivation with timestamp and IP address

- **Backup Code Regeneration**:
  - Require authentication and 2FA verification
  - Generate new set of 10 backup codes
  - Invalidate old backup codes
  - Update backup_codes field in profiles table
  - Return new backup codes to user
  - Create notification for backup code regeneration

- **Trusted Device Management**:
  - Store device fingerprint on successful 2FA verification
  - Allow 2FA bypass for trusted devices (optional)
  - Provide interface to view and revoke trusted devices
  - Send notification when new device is trusted
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
  - Set notification_type = 'provider_response'\n  - Include order number and provider message
  - Queue for delivery via user's enabled channels
  - Send real-time notification via Supabase Realtime
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
- For in-app: Store in database and send via Supabase Realtime
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
- Query users matching criteria from profiles table
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
\n### 5.2 Security Infrastructure
- **SSL/TLS Encryption**: HTTPS enforcement across entire platform
- **Database Encryption**: Encryption at rest for sensitive data via Supabase
- **Password Hashing**: Handled automatically by Supabase Auth using bcrypt
- **SQL Injection Prevention**: Parameterized queries via Supabase client
- **XSS Protection**: Content Security Policy and output encoding
- **CSRF Protection**: Token-based CSRF prevention
- **Rate Limiting**: API and login rate limiting to prevent abuse
- **DDoS Protection**: Integration with DDoS mitigation services via Supabase
- **Firewall Rules**: Web Application Firewall (WAF) configuration
- **Security Headers**: Implementation of security headers (HSTS, X-Frame-Options, etc.)\n- **Vulnerability Scanning**: Regular automated security scans
- **Penetration Testing**: Periodic security audits and penetration testing
- **Data Backup Encryption**: Encrypted backup storage via Supabase
- **Secure File Upload**: File type validation and malware scanning
- **Admin Session Security**: Secure session management with token rotation
- **API Key Encryption**: Encrypted storage of API keys in database
- **Request Signature Verification**: HMAC-SHA256 signature validation for API requests
- **IP Whitelisting for API**: Restrict API access to authorized IP addresses
- **API Token Expiration**: Configurable token expiration and refresh mechanism
- **Two-Factor Authentication Security**:
  - Encrypted storage of 2FA secrets using AES-256 encryption
  - Rate limiting on 2FA verification attempts (max 5 attempts per 15 minutes)
  - Brute force protection for 2FA codes with exponential backoff
  - Secure backup code generation using cryptographically secure random number generator
  - Backup codes hashed before storage in database
  - Time-based one-time password (TOTP) with 30-second time window
  - Clock skew tolerance of ±1 time step for TOTP validation
  - Automatic account lockout after 5 consecutive failed 2FA attempts
  - Security notifications for 2FA setup, changes, and suspicious activities
- **Preview Mode Security**:
  - Preview mode disabled by default in production environment
  - Require Super Admin approval to enable preview mode
  - Encrypted storage of magic login tokens
  - Time-limited preview sessions with automatic expiration
  - Comprehensive logging of all preview mode access
  - Automatic notifications to Super Admin when preview mode is activated
  - Clear visual indicators to prevent confusion with production environment
  - Separate test database or clearly marked test data for preview mode
  - Restricted permissions in preview mode (configurable read-only or full access)
- **Supabase Security Features**:
  - Row Level Security (RLS) policies on all tables
  - Secure API key management via Supabase dashboard
  - Automatic SSL/TLS encryption for all connections
  - Built-in DDoS protection via Supabase infrastructure
  - Encrypted data at rest in Supabase PostgreSQL
  - Secure file storage with signed URLs in Supabase Storage
- **Role-Based Access Control**:
  - Enforce role checks on all admin endpoints
  - Implement RLS policies to restrict data access based on user role
  - Log all role changes in admin_activity_logs
\n### 5.3 Frontend-Backend Integration
\n#### 5.3.1 Admin Panel Frontend Integration
- **Admin Login Page**: Connect to Supabase Auth login + role verification
  - Call `supabase.auth.signInWithPassword({ email, password })`
  - After successful login, call GET /admin/auth/check-role to verify admin role
  - If role != 'admin', show error and prevent dashboard access
  - If role = 'admin', redirect to admin dashboard
- **Admin Preview Login Page**: Connect to preview mode endpoints for test credentials and magic login
- **Preview Mode Banner**: Display prominent banner when in preview mode with disable option
- **2FA Verification**: Connect to POST /admin/auth/verify-2fa endpoint
- **Dashboard Data Loading**: Fetch from GET /admin/dashboard/stats\n- **Real-time Updates**: Supabase Realtime subscription for live data
- **Form Submissions**: POST/PUT requests with CSRF tokens
- **File Uploads**: Multipart form data to Supabase Storage
- **Data Tables**: Pagination, sorting, filtering via API parameters
- **Session Management**: Store JWT token from Supabase Auth in secure httpOnly cookie
- **Auto-logout**: Implement idle timeout with warning modal
- **Error Handling**: Display user-friendly error messages from API responses
- **Notification Management**: Connect to notification management endpoints for creating templates and sending broadcasts
- **Provider Response Viewing**: Fetch and display provider responses from GET /admin/orders/:id/provider-responses
- **Preview Mode Controls**: Enable/disable preview mode, generate magic links, view access logs
- **Supabase Integration**: Use Supabase client for real-time data subscriptions and database operations
- **Session Persistence**: On page load, call `supabase.auth.getSession()` to restore session
- **Role Verification on Route Change**: Check admin role before allowing access to protected routes

#### 5.3.2 Customer Frontend Integration
- **User Authentication**: Connect to Supabase Auth for signup and login
  - Call `supabase.auth.signUp({ email, password })` for registration
  - Call `supabase.auth.signInWithPassword({ email, password })` for login
  - Store JWT token from Supabase Auth\n- **Service Browsing**: Fetch categories and services from API
- **Order Placement**: Submit orders via API with wallet validation
- **Payment Submission**: Upload payment proofs to Supabase Storage with transaction details
- **Real-time Notifications**: Supabase Realtime subscription for instant notification delivery
- **Notification Center**: Display in-app notifications with unread badge
- **Invoice Download**: Generate and download PDF invoices from Supabase Storage
- **Profile Viewing**: **Connect to GET /api/v1/account/profile to fetch and display read-only profile information (username, email, phone, display name, profile picture, language, currency)**
- **Password Change**: **Connect to Supabase Auth updateUser API for password updates**
  - **Display password change form with current password and new password fields**
  - **Implement real-time password strength indicator**
  - **Validate password requirements on frontend before submission**
  - **Show loading state during password change request**
  - **Display success message and security notification after successful change**
  - **Handle and display error messages for failed attempts**
- **2FA Setup and Management**: **Complete backend integration for 2FA functionality**
  - **Connect to POST /api/v1/account/2fa/setup to initialize 2FA and get QR code**
  - **Display QR code for scanning with authenticator app**
  - **Connect to POST /api/v1/account/2fa/verify to verify and enable 2FA**
  - **Connect to POST /api/v1/account/2fa/disable to disable 2FA**
  - **Connect to GET /api/v1/account/2fa/backup-codes to retrieve backup codes**
  - **Connect to POST /api/v1/account/2fa/regenerate-backup-codes to regenerate backup codes**
  - **Display backup codes with copy functionality**
  - **2FA verification during login flow**
  - **Backup code input option during login**
  - **Security notifications for 2FA changes**
- **Notification Preferences**: Update notification settings via API
- **Order Details Page**: Fetch order details including provider responses from GET /api/v1/orders/{order_id}\n- **Provider Response Display**: Show provider response/replay section with copy functionality
- **Real-time Provider Updates**: Supabase Realtime listener for new provider responses
- **Supabase Integration**: Use Supabase client for authentication, real-time subscriptions, and file uploads
- **Session Persistence**: On page load, call `supabase.auth.getSession()` to restore session
\n### 5.4 Deployment & Infrastructure
- **Server Environment**: Linux (Ubuntu/CentOS) with Nginx reverse proxy
- **Application Deployment**: Docker containers with orchestration
- **Database Hosting**: **Supabase PostgreSQL with automatic backups**
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
- **Supabase Infrastructure**: Leverage Supabase managed services for database, storage, and real-time features

### 5.5 Performance Optimization
- **Database Indexing**: Proper indexes on frequently queried columns in Supabase
- **Query Optimization**: Optimized database queries with explain plans
- **Caching Strategy**: Redis caching for frequently accessed data
- **API Response Caching**: Cache API responses with appropriate TTL
- **Image Optimization**: Automatic image compression and resizing via Supabase Storage
- **Lazy Loading**: Lazy load images and components\n- **Code Splitting**: Split frontend code for faster loading
- **Minification**: Minify CSS and JavaScript\n- **Gzip Compression**: Enable gzip compression for responses
- **Database Connection Pooling**: Efficient database connection management via Supabase
- **Notification Queue Optimization**: Batch processing for bulk notifications
- **WebSocket Connection Management**: Efficient real-time connection handling via Supabase Realtime\n- **Supabase Performance Features**: Utilize Supabase connection pooling, caching, and CDN for optimal performance

---

## 6. Design Style\n
### 6.1 Visual Design\n- **Top Advertisement Banner**: Reduced-height horizontal moving banner displaying promotional photos with smooth scrolling animation
- **Search Field**: Positioned directly below the advertisement banner for easy access
- **Language Selector**: Prominent language dropdown in header with flag icons for easy identification
- **Currency Selector**: Currency dropdown in header showing currency symbols and codes
- **Notification Badge**: Unread notification counter badge on notification bell icon in header
- **Preview Mode Banner**: Prominent banner at top of admin dashboard displaying 'PREVIEW MODE - Testing Environment' with distinct color scheme (e.g., orange or yellow background)
- Card-based layout for categories with unified main images representing each service group
- Vibrant blue and purple gradient accents on clean backgrounds\n- Smooth animations for category navigation and transitions
- Professional admin panel interface with clear data visualization and comprehensive navigation menu
- Organized settings sidebar with grouped configuration modules
- **API Documentation Portal**: Clean, developer-friendly interface with syntax highlighting and interactive elements
- **Profile Settings Page**: Clean, organized layout with **read-only profile information display and dedicated password change section**, **with real-time validation feedback and success indicators**
- **2FA Setup Interface**: Step-by-step wizard with QR code display, backup codes presentation, **verification input field, and clear success/error messages**
- **Admin Login Page**: Clean, secure login interface with username/email and password fields, CAPTCHA, and 2FA verification
- **Admin Preview Login Page**: Simplified interface with test credentials display and magic login button
- **Notification Center**: Slide-in panel with categorized notifications and quick action buttons
- **Notification Management Interface**: Admin dashboard for creating templates and sending broadcasts with preview functionality
- **Order Details Page**: Clean, card-based layout with clear information hierarchy and prominent provider response section
- **Provider Response Section**: Distinct visual styling with REPLAY button, collapsible content area, and copy functionality
- **Preview Mode Indicator**: Distinct visual banner or ribbon indicating preview/test environment
\n### 6.2 Interactive Elements
- **Advertisement Banner**: Auto-scrolling promotional photos with pause-on-hover functionality
- **Search Field**: Instant search with autocomplete suggestions
- **Language Selector**: Dropdown with search functionality and flag icons
- **Currency Selector**: Dropdown with real-time exchange rate display
- **Notification Bell**: Animated bell icon with unread badge counter and dropdown preview
- **Notification Center**: Slide-in panel with filtering, search, and mark-as-read functionality
- **Real-time Notification Toast**: Pop-up notifications for instant alerts with auto-dismiss
- **Preview Mode Banner**: Clickable banner with 'Disable Preview Mode' button and session timer
- **Magic Login Button**: One-click login button for instant admin access in preview mode
- **Test Credentials Display**: Copy-to-clipboard functionality for test email and password
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
- **Profile View Display**: **Clean, card-based layout showing read-only profile fields with clear labels and values**
- **Password Change Form**: **Dedicated form with current password, new password, and confirm password fields, real-time validation, loading indicators during save, success animations, and error messages**
- **2FA QR Code Scanner**: **Interactive QR code display with copy-to-clipboard functionality for manual entry code**
- **2FA Verification Input**: **6-digit code input with auto-focus and real-time validation**
- **Backup Codes Display**: **Formatted backup codes with individual copy buttons and download option**
- **Password Strength Indicator**: Real-time password strength visualization with color-coded feedback
- **Trusted Devices List**: Manage and revoke trusted devices with confirmation dialogs
- **Language Translation Editor**: In-context translation editing for admins
- **Currency Converter Widget**: Real-time currency conversion display on pricing pages
- **Admin Login Form**: Responsive login form with real-time validation and error messages
- **Notification Template Editor**: WYSIWYG editor with variable insertion and preview\n- **Broadcast Notification Scheduler**: Calendar interface for scheduling notifications
- **Notification Analytics Dashboard**: Charts and graphs showing delivery rates and engagement\n- **REPLAY Button**: Interactive button that expands/collapses provider response content
- **Provider Response Copy Button**: One-click copy functionality for provider messages
- **Real-time Provider Response Updates**: Automatic refresh and notification when new provider responses arrive
- **Provider Response Timestamp**: Display relative time (e.g., '2 minutes ago') with hover tooltip showing exact timestamp
- **Save Changes Button**: Disabled state when no changes, enabled with loading state during save
- **2FA Enable/Disable Toggle**: Clear visual state with confirmation modal before disabling
- **Preview Mode Session Timer**: Display remaining session time in preview mode banner
- **Preview Access Logs Viewer**: Table showing all preview mode access attempts with timestamps and IP addresses
\n### 6.3 Theme Options
- Light mode: White background with soft shadows and colorful category cards with main images
- Dark mode: Deep dark background with neon highlights and glowing category borders
- Admin panel: Clean, data-focused interface with customizable dashboard widgets and organized navigation structure
- API Documentation: Developer-friendly theme with syntax highlighting and clear code examples
- **RTL Layout**: Fully mirrored layout for right-to-left languages with proper text alignment
- **Admin Login Page**: Professional, secure design with brand colors and trust indicators
- **Admin Preview Login Page**: Simplified design with clear test environment indicators
- **Preview Mode Theme**: Distinct color scheme (e.g., orange/yellow accents) to differentiate from production
- **Notification Center**: Consistent theme with main application, supporting both light and dark modes
- **Order Details Page**: Consistent with main application theme, with distinct styling for provider response section
- **Profile Settings Page**: Consistent with main application theme, with clear visual hierarchy, **read-only field styling, and password change form styling**
- **2FA Setup Page**: Clean, security-focused design with step-by-step visual indicators and clear instructions
\n---

## 7. Reference Documentation
- API Documentation Reference: https://api.play4cards.com/api-docs\n\n---

## 8. Reference Images
- Screenshot 2025-12-26 133441.png: Admin dashboard top navigation menu showing Users, Orders, Subscriptions, Drip-feed, Refill, Cancel, Services, Payments, Tickets, Affiliates, Child panels, Updates, Reports, Appearance, and Settings modules
- Screenshot 2025-12-26 133448.png: Admin settings sidebar showing General, Providers, Payments Modules, Integrations, Notifications, Bonuses, Signup form, and Ticket form configuration sections
- image.png: Order details page showing Order ID, Product, Quantity, Total Price, Date, Player ID, and provider response section with REPLAY button and copy functionality
\n---

## 9. Supabase Integration Details

### 9.1 Supabase Project Configuration
- **Project URL**: https://hbqeslmfietqvdbkaqsy.supabase.co
- **Anon Public Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicWVzbG1maWV0cXZkYmthcXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDAyOTIsImV4cCI6MjA4MjQxNjI5Mn0.rG8pkDL-ygFWT_xzV5Yh0GixNc4YDJ3xK77xxZKT0yA
\n### 9.2 Database Setup in Supabase
1. Create all database tables in Supabase PostgreSQL using SQL migrations
2. **Create profiles table linked to auth.users with role column (default: 'user')**
3. Enable Row Level Security (RLS) on all tables
4. **Configure RLS policies for user data isolation and admin access control based on role**
5. Set up database indexes for optimal query performance
6. Configure automatic backups via Supabase dashboard
\n### 9.3 Authentication Setup
1. **Use Supabase Auth for all user authentication (email + password)**
2. **Configure JWT token validation with Supabase**
3. **Implement custom claims for admin roles via profiles.role column**
4. Configure email verification and password reset flows
5. Set up 2FA integration with Supabase Auth
6. **Create database trigger to automatically create profiles entry when new user signs up**
7. **Default role for new users: 'user'**
8. **Admin role assignment: Manual via SQL or admin interface**

### 9.4 Storage Configuration
1. Create storage buckets for different file types:\n   - payment-proofs: For payment proof uploads
   - category-images: For category main images
   - banner-images: For advertisement banner photos
   - profile-pictures: For user and admin profile pictures
   - invoices: For generated invoice PDFs
2. Configure storage policies for secure file access
3. Set up automatic image optimization and resizing
4. Implement signed URLs for secure file downloads
\n### 9.5 Real-time Features
1. Set up Supabase Realtime subscriptions for:\n   - Order status updates
   - Provider response notifications
   - Wallet balance changes
   - New notifications
   - Stock level changes
2. Configure WebSocket connections via Supabase Realtime\n3. Implement real-time data synchronization across all connected clients
\n### 9.6 API Integration
1. Use Supabase REST API for all database operations
2. Implement Supabase client-side queries for frontend data fetching
3. Configure API rate limiting via Supabase dashboard
4. Set up custom API endpoints using Supabase Edge Functions for complex business logic
5. **Implement role-based access control in API endpoints**

### 9.7 Security Configuration
1. Enable Row Level Security (RLS) on all tables
2. Configure RLS policies:\n   - Users can only access their own data
   - **Admins (role='admin') have full access to all data based on role permissions**
   - Stock managers can only access stock-related tables
3. Set up API key rotation and management
4. Configure IP whitelisting for admin access
5. Implement request signing for sensitive operations
6. **Enforce role checks on all admin endpoints**

### 9.8 Backup and Recovery
1. Enable automatic daily backups via Supabase\n2. Configure backup retention policy (30 days)
3. Set up point-in-time recovery\n4. Implement manual backup triggers for critical operations
5. Test backup restoration procedures regularly

### 9.9 Admin Role Management
1. **Create initial admin user via SQL after signup:**
   ```sql
   UPDATE profiles\n   SET role = 'admin'
   WHERE email = 'admin@example.com';
   ```
2. **Implement admin interface for role management (after first admin is created)**
3. **Log all role changes in admin_activity_logs**
4. **Send security notifications when user role is changed**

### 9.10 Session Persistence
1. **Use Supabase Auth session management**
2. **Store JWT token in secure httpOnly cookie or localStorage**
3. **On page load, call `supabase.auth.getSession()` to restore session**
4. **Verify user role from profiles table after session restoration**
5. **Implement automatic token refresh before expiration**
6. **Redirect to login if session invalid or role insufficient**

---

## 10. Implementation Priority

### Phase 1: Core Backend & Admin System (Highest Priority)
1. **Supabase project setup and database schema implementation**
2. **Create profiles table linked to auth.users with role column**
3. **Implement Supabase Auth integration for user registration and login**
4. **Create database trigger for automatic profiles entry creation on signup**
5. **Implement RLS policies for role-based access control**
6. **Create admin authentication endpoints with role verification**
7. **Implement admin authorization middleware checking role='admin'**
8. **Create SQL script for promoting users to admin role**
9. Admin dashboard with basic statistics and preview mode indicator
10. User management module with role assignment interface
11. Service management module\n12. Order management module with provider response handling
13. Payment verification module
14. **Notification system backend implementation**
15. **Provider response notification system**
16. Admin API endpoints for all core functions
17. **Preview mode API endpoints**
18. **User profile viewing API endpoint (GET /api/v1/account/profile) returning read-only fields**
19. **Password change API endpoint using Supabase Auth updateUser**
20. **2FA backend implementation with all API endpoints (setup, verify, disable, backup codes)**
21. **Session persistence implementation using Supabase Auth**
\n### Phase 2: Customer Frontend & Integration\n1. **Customer authentication and registration using Supabase Auth**
2. **Session persistence on page refresh**
3. Service browsing and ordering
4. Wallet system and payment submission
5. Order tracking and history
6. **Order details page with provider response display**
7. **Profile viewing frontend displaying read-only profile information**
8. **Password change frontend with Supabase Auth integration**
9. **2FA setup and management frontend with complete backend connection**
10. **Notification center and real-time notification delivery via Supabase Realtime**
11. **Real-time provider response updates**
12. Frontend-backend API integration\n13. **Admin route protection with role verification**
\n### Phase 3: Advanced Features
1. Stock management system
2. Multi-currency and multi-language\n3. Public API system
4. **Complete notification system with all notification types**
5. **Notification preferences and customization**
6. Ticket support system
7. Analytics and reporting
8. **Notification analytics and tracking**
9. **Provider response logs and monitoring**
10. **Security notifications for password changes and 2FA changes**
11. **Preview mode management interface**
12. **Supabase Realtime subscriptions for all real-time features**
\n### Phase 4: Additional Modules
1. Affiliate system
2. Subscription management
3. Drip-feed orders
4. Child panels\n5. Advanced security features
6. Performance optimization
7. **Broadcast notification system**
8. **Notification template management**
9. **Provider response analytics**
10. **Trusted device management for 2FA**
11. **Preview mode access logs and monitoring**
12. **Supabase Edge Functions for custom business logic**
\n---

## 11. Testing & Development Guide

### 11.1 Creating Test Admin User
\n**Step 1: Register User via Frontend**
- Navigate to registration page
- Enter email: admin@example.com
- Enter password: SecureAdminPass123!\n- Complete registration\n- Verify email if required
\n**Step 2: Promote User to Admin via SQL**
- Open Supabase project dashboard
- Navigate to SQL Editor
- Run the following SQL command:
  ```sql
  UPDATE profiles
  SET role = 'admin'
  WHERE email = 'admin@example.com';
  ```
- Verify role update:\n  ```sql
  SELECT id, email, role FROM profiles WHERE email = 'admin@example.com';
  ```

**Step 3: Test Admin Login**
- Navigate to admin login page
- Enter admin credentials
- System should verify role='admin' and grant access
- Confirm redirect to admin dashboard

### 11.2 Quick Login / Preview Mode for Development

**Enabling Preview Mode:**
- Preview mode remains enabled for development
- Test credentials: admin@preview.test / PreviewAdmin2025!
- Magic login links available for instant access
- Preview mode banner displayed at top of admin dashboard

**Using Preview Mode:**
- Click 'Quick Login' button on admin login page
- Or use magic login link\n- Automatic login without authentication
- Limited permissions (read-only by default)
- Session expires after 2 hours

### 11.3 Session Persistence Testing

**Test Scenario 1: Page Refresh**
- Log in as admin
- Refresh browser page
- Verify session persists
- Verify admin dashboard remains accessible

**Test Scenario 2: New Tab**
- Log in as admin in one tab
- Open new tab and navigate to admin dashboard
- Verify automatic authentication
- Verify role verification occurs

**Test Scenario 3: Token Expiration**
- Log in as admin
- Wait for token expiration (or manually expire token)
- Attempt to access admin page
- Verify redirect to login page
- Verify error message displayed

### 11.4 Role-Based Access Control Testing
\n**Test Scenario 1: Regular User Access**
- Log in as regular user (role='user')
- Attempt to access admin dashboard URL directly
- Verify access denied
- Verify redirect to login or error page

**Test Scenario 2: Admin Access**\n- Log in as admin (role='admin')
- Access admin dashboard
- Verify full access granted
- Verify all admin features accessible

**Test Scenario 3: Role Change**
- Log in as admin
- Change another user's role to 'admin'
- Verify role update in database
- Verify new admin can access dashboard
- Verify activity logged in admin_activity_logs

---

## 12. SQL Migration Scripts

### 12.1 Create Profiles Table
```sql\n-- Create profiles table linked to auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  email TEXT,
  phone_number TEXT,
  display_name TEXT,
  profile_picture_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'stock_manager')),
  user_level_id UUID REFERENCES user_levels(id),
  wallet_balance DECIMAL(10, 2) DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  preferred_language TEXT DEFAULT 'en',
  preferred_currency TEXT DEFAULT 'USD',
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  backup_codes JSONB,
  email_verified BOOLEAN DEFAULT FALSE,\n  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'banned')),
  notification_preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  last_login_ip TEXT\n);
\n-- Create index on role for faster queries
CREATE INDEX idx_profiles_role ON profiles(role);
\n-- Create index on email for faster lookups
CREATE INDEX idx_profiles_email ON profiles(email);
```
\n### 12.2 Create Trigger for Automatic Profile Creation
```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, created_at)
  VALUES (NEW.id, NEW.email, 'user', NOW());
  RETURN NEW;
END;\n$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users\n  FOR EACH ROW\n  EXECUTE FUNCTION public.handle_new_user();
```

### 12.3 Row Level Security Policies
```sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
\n-- Policy: Users can view their own profile
CREATE POLICY 'Users can view own profile' ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile (limited fields)
CREATE POLICY 'Users can update own profile' ON profiles
  FOR UPDATE\n  USING (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY 'Admins can view all profiles' ON profiles
  FOR SELECT\n  USING (
    EXISTS (
      SELECT 1 FROM profiles\n      WHERE id = auth.uid() AND role = 'admin'
    )
  );
\n-- Policy: Admins can update all profiles\nCREATE POLICY 'Admins can update all profiles' ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
\n-- Policy: Admins can insert profiles
CREATE POLICY 'Admins can insert profiles' ON profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
\n-- Policy: Admins can delete profiles
CREATE POLICY 'Admins can delete profiles' ON profiles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 12.4 Promote User to Admin
```sql\n-- Promote specific user to admin by email
UPDATE profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'admin@example.com';
\n-- Verify role update
SELECT id, email, role, created_at, updated_at
FROM profiles
WHERE email = 'admin@example.com';
```

### 12.5 Create Admin Activity Log Entry
```sql
-- Log role change action
INSERT INTO admin_activity_logs (
  admin_user_id,
  action_type,
  action_description,
  affected_resource_type,
  affected_resource_id,
  created_at
)
VALUES (
  (SELECT id FROM profiles WHERE email = 'admin@example.com'),
  'role_change',
  'User promoted to admin role',
  'profile',
  (SELECT id FROM profiles WHERE email = 'admin@example.com'),
  NOW()
);
```