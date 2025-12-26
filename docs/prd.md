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
- User registration and login\n- Personal wallet system\n- Balance top-up functionality
- Order history tracking
- **Invoice generation for orders**
- Security settings\n- **Wallet-only purchase requirement: All purchases must be made using wallet balance**

### 2.3 User Level System
- **User Level Tiers**: Admin can create and manage multiple user levels\n- **Custom Discount Rates**: Admin can assign custom discount percentages to each user level
- **Flexible Discount Configuration**: Admin has full control to set any discount rate per level
- **Automatic Price Adjustment**: User prices are automatically adjusted based on their assigned level and discount rate
- **Level Assignment**: Admin can assign users to specific levels through user management panel

### 2.4 Transaction Features
- **Automatic order fulfillment from stock inventory**: When customers purchase gift cards, Netflix codes, Shahid codes, or PUBG codes, orders are fulfilled directly from stock and delivered immediately
- Real-time stock management
- Multi-currency support
- **Wallet-based payment processing only**
- **Invoice Generation**: Customers can generate and download invoices for their orders from the order page

### 2.5 Stock Management System
- **Stock Manager Role**: Dedicated role for managing inventory of gift cards and digital codes
- **Direct Order Fulfillment**: Customers receive orders immediately upon purchase from available stock
- **Stock Categories**: Gift cards, Netflix codes, Shahid codes, PUBG codes, and other digital products\n- **Real-time Inventory Tracking**: Automatic stock level updates after each purchase
- **Stock Alerts**: Notifications when stock levels are low
- **Stock Manager Permissions**:\n  - Add new stock items
  - Update stock quantities
  - View stock history
  - Manage stock categories
  - Set stock alerts and thresholds

### 2.6 Notification System
- **Order Status Notifications**:
  - Order completion alerts
  - Order cancellation notifications
- **Wallet Notifications**:
  - Balance added to wallet confirmation
  - Wallet transaction alerts
- **Security Notifications**:
  - API key change alerts
  - Account security updates
- **General Notifications**:
  - Service price updates
  - Site news and announcements
- **Delivery Methods**:
  - In-app notification center
  - Push notifications
  - Email notifications (optional)

### 2.7 Support System
- Ticket support for customer inquiries
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

**Wallet Operations:**
- POST /api/v1/wallet/topup - Submit balance top-up request
- GET /api/v1/wallet/transactions - Get wallet transaction history
- GET /api/v1/wallet/pending - Get pending payment requests
\n**Stock Availability:**
- GET /api/v1/stock/check/{service_id} - Check stock availability\n- GET /api/v1/stock/status - Get real-time stock status for multiple services

**Webhooks:**
- POST /api/v1/webhooks/configure - Set up webhook endpoints
- GET /api/v1/webhooks/list - List configured webhooks
- DELETE /api/v1/webhooks/{id} - Remove webhook\n
**API Security Features:**
- **API Key Management**: Generate, rotate, and revoke API keys
- **Rate Limiting**: Configurable request limits per API key (e.g., 1000 requests/hour)
- **IP Whitelisting**: Restrict API access to specific IP addresses\n- **Request Signing**: HMAC-SHA256 signature verification for sensitive operations
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

**Error Handling:**
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
- **API Testing Console**: Built-in testing tool for API endpoints\n- **API Documentation Access**: Direct access to API docs from user account
- **Webhook Configuration**: Set up and test webhook endpoints
- **API Logs Viewer**: View recent API requests and responses

#### 2.8.3 Admin API v2\n- **API Key Management**:
  - Create and edit API keys
  - Set API key name and notes
  - Enable/disable API key status
  - Configure granular access permissions per key
\n- **Orders Permissions**:
  - Edit link\n  - Resend order
  - Get order list
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
  - Reject cancel\n\n- **Refill Permissions**:
  - Pull refill tasks
  - Change refill status
\n- **Payments Permissions**:
  - Add payment\n  - Get payment list
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
- Multi-language support
- Slide bar navigation\n- Navigation bar\n- Header section\n- Attractive animations\n\n### 2.10 Admin Management System
\n#### 2.10.1 Admin Access & Security
- **Multi-Level Admin Roles**: Super Admin, Admin, Manager, Support Staff, Stock Manager with customizable permission sets
- **Role-Based Access Control (RBAC)**: Granular permissions for each admin role with ability to create custom roles
- **Admin Login Page**: Dedicated secure login page exclusively for administrators with CAPTCHA protection
- **Two-Factor Authentication (2FA)**: Mandatory 2FA for Super Admin, optional for other roles using authenticator apps or SMS
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

#### 2.10.2 Comprehensive Dashboard Navigation
Full navigation menu with the following modules:
- **Dashboard Home**: Overview with key metrics, recent activities, and quick action buttons
- **Users**: Manage user accounts, permissions, wallet balances, activity, user level assignments, and bulk user operations
- **Orders**: View, process, update, edit links, resend orders, cancel and refund, set partial, pull and update orders, export order data
- **Subscriptions**: Manage recurring subscription services, billing cycles, renewal settings, and subscription analytics
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
- **Security Center**: Centralized security management, firewall rules, DDoS protection settings, and security scan reports
\n#### 2.10.3 Settings Sidebar Modules
- **General**: Basic site configuration, site name, URL, timezone, general preferences, maintenance mode, and site status
- **Providers**: Configure service provider API connections, manage provider settings, provider priority, and failover rules
- **Payments Modules**: Set up and manage payment gateway integrations for balance top-ups, payment method ordering, and fee configuration
- **Integrations**: Connect third-party services and tools (analytics, CRM, marketing automation, etc.)\n- **Notifications**: Configure notification settings, templates, delivery methods, and notification scheduling
- **Bonuses**: Set up bonus programs, promotional offers, reward systems, and loyalty programs
- **Signup form**: Customize user registration form fields, validation rules, and email verification settings
- **Ticket form**: Configure support ticket form fields, categories, priority levels, and auto-assignment rules
- **API Settings**: Configure public API parameters, rate limits, authentication methods, and API documentation access
- **Currency Settings**: Manage supported currencies, exchange rates, and automatic rate updates
- **Language Settings**: Add/edit language packs, set default language, and manage translations
- **Tax Configuration**: Set up tax rules, VAT settings, and regional tax compliance
- **Terms & Policies**: Manage Terms of Service, Privacy Policy, Refund Policy, and legal documents
- **GDPR Compliance**: Configure data retention policies, user data export, and right to be forgotten features
- **Rate Limiting**: Configure API rate limits, request throttling, and abuse prevention
- **Cache Management**: Configure caching settings, clear cache, and optimize performance
\n#### 2.10.4 Additional Admin Features
- **User Level Management**: Create, edit, and delete user levels; assign custom discount rates to each level
- **Custom Rate Configuration**: Set custom pricing rates for users based on their level and discount settings
- **Service Import with Profit Markup**: Import services via API from providers with automatic profit percentage addition
- **Stock Inventory Control**: Manage gift card stock, track inventory levels, add new stock for digital products\n- **Stock Manager Assignment**: Assign and manage stock manager roles and permissions
- **Category & Image Management**: Upload and assign main images for each category; organize service groupings
- **Advertisement Management**: Upload and manage promotional photos for top banner; control banner rotation and display
- **Admin API v2 Management**: Create and edit API keys, set granular permissions, and monitor API usage
- **Public API Management**: Configure public API settings, manage API documentation, monitor API usage statistics
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
\n## 3. Website Pages

### 3.1 Customer-Facing Pages
1. **Home** - Main landing page with reduced-height advertisement banner at top, search field below banner, and service categories
2. **Wallet** - User wallet management and balance display
3. **Add Balance** - Wallet recharge page with multiple payment methods
4. **My Orders** - Order history and status tracking with invoice generation option
5. **Security** - Account security settings\n6. **API** - Customer API documentation, key management, and testing console
7. **API Documentation** - Interactive API documentation portal with code examples and testing tools
8. **About Us** - Company information and contact details
9. **Service Category Pages** - Dedicated pages for each main service type (Games, Apps, Streaming, Gift Cards) with category/subcategory navigation and unified category images
\n### 3.2 Admin-Only Pages
1. **Admin Login** - Secure authentication page with 2FA for administrators only
2. **Admin Dashboard** - Overview of site statistics and quick access to all management modules
3. **Users Management** - Interface for managing user accounts, permissions, levels, and activity
4. **Orders Management** - Interface for managing all customer orders with full control options
5. **Subscriptions Management** - Interface for managing recurring subscription services
6. **Drip-feed Management** - Interface for configuring drip-feed delivery settings
7. **Refill Management** - Interface for handling refill requests and tasks
8. **Cancel Management** - Interface for managing cancellation requests\n9. **Services Management** - Interface for managing services, categories, pricing, and imports
10. **Payments Management** - Interface for reviewing balance top-up requests and payment verification
11. **Tickets Management** - Interface for handling customer support tickets
12. **Affiliates Management** - Interface for managing affiliate program and commissions
13. **Child Panels Management** - Interface for managing reseller sub-panels\n14. **Updates** - Interface for viewing system updates and changelog
15. **Reports & Analytics** - Interface for viewing site statistics and performance data
16. **Appearance Settings** - Interface for customizing site visual design
17. **General Settings** - Interface for basic site configuration
18. **Providers Settings** - Interface for managing service provider API connections
19. **Payments Modules Settings** - Interface for configuring payment gateway integrations
20. **Integrations Settings** - Interface for connecting third-party services
21. **Notifications Settings** - Interface for configuring notification system
22. **Bonuses Settings** - Interface for setting up bonus programs
23. **Signup Form Settings** - Interface for customizing registration form\n24. **Ticket Form Settings** - Interface for configuring support ticket form
25. **API Settings** - Interface for configuring public API parameters and documentation\n26. **User Level Management** - Interface for creating and managing user levels with custom discount rates
27. **Stock Management** - Interface for inventory control of digital products
28. **Stock Manager Management** - Interface for assigning and managing stock manager roles
29. **Category Management** - Interface for organizing services and uploading category main images
30. **Advertisement Management** - Interface for uploading and managing top banner promotional content
31. **Admin API v2 Management** - Interface for creating, editing, and managing API keys with granular permission settings
32. **Public API Management** - Interface for managing public API settings, monitoring usage, and configuring rate limits
33. **API Logs & Monitoring** - Interface for viewing API request logs, error tracking, and usage analytics
34. **Admin Roles & Permissions** - Interface for creating custom admin roles and assigning granular permissions
35. **Security Center** - Interface for managing security settings, viewing security logs, and configuring protection rules
36. **Logs & Monitoring** - Interface for viewing system logs, admin activity logs, and real-time monitoring\n37. **Backup & Restore** - Interface for managing database backups and restoration
38. **Email Templates** - Interface for managing email notification templates
39. **SMS Gateway** - Interface for configuring SMS settings\n40. **Bulk Operations** - Interface for performing bulk actions across multiple records
41. **Scheduled Tasks** - Interface for configuring automated tasks and cron jobs
42. **Webhook Management** - Interface for managing webhook integrations\n43. **Fraud Detection** - Interface for configuring fraud rules and viewing suspicious activities
44. **Performance Dashboard** - Interface for monitoring system performance and optimization
\n## 4. Add Balance Payment System

### 4.1 Payment Methods
- Support for 15+ payment methods including:
  - Credit/Debit Cards\n  - PayPal
  - Bank Transfer
  - Mobile Wallets\n  - Cryptocurrency
  - Local payment gateways
  - Other regional payment options

### 4.2 Payment Submission Process
For each balance top-up request, customers must:
1. Select preferred payment method from available options
2. Upload payment proof photo\n3. Enter transaction details\n4. Provide transaction ID\n5. Submit for verification
\n### 4.3 Payment Verification
- Admin review of submitted payment proofs through admin panel
- Balance credited after verification
- Notification sent upon approval or rejection
\n## 5. Technical Requirements

### 5.1 Backend & Database
- Database system for user data, orders, inventory, transactions, payment submissions, and admin accounts
- Backend server for business logic and API handling
- Category and subcategory management system with image storage
- Payment proof storage and verification workflow
- Admin authentication and authorization system
- Role-based access control for admin functions and stock managers
- Notification queue and delivery system
- Stock inventory database for gift cards, Netflix codes, Shahid codes, PUBG codes, and digital products
- Automatic order fulfillment system from stock\n- **User level system database with discount rate configuration**
- **Pricing calculation engine for profit markup and custom user rates**
- **Invoice generation system with PDF export functionality**
- **Supabase Integration**: Configure Supabase connection files including supabase.js, supabaseClient.js, lib/supabase.js, and src/supabase.ts to connect the application to Supabase backend services
- **Subscription management system** for recurring billing cycles
- **Drip-feed order processing system** for scheduled delivery
- **Affiliate tracking system** for referral management and commission calculation
- **Child panel management system** for reseller account hierarchy
- **Comprehensive audit logging system** for all admin and user actions
- **Backup and disaster recovery system** with automated scheduling
- **Redis caching layer** for improved performance\n- **Queue management system** for background job processing
- **API request/response logging system** for all API calls
- **API rate limiting engine** with configurable thresholds
- **Webhook delivery system** with retry mechanism
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
- **Penetration Testing**: Periodic security audits and penetration testing
- **Data Backup Encryption**: Encrypted backup storage
- **Secure File Upload**: File type validation and malware scanning
- **Admin Session Security**: Secure session management with token rotation
- **API Key Encryption**: Encrypted storage of API keys in database
- **Request Signature Verification**: HMAC-SHA256 signature validation for API requests
- **IP Whitelisting for API**: Restrict API access to authorized IP addresses
- **API Token Expiration**: Configurable token expiration and refresh mechanism
\n### 5.3 Stock Inventory System
- Automated gift card and digital code delivery from stock upon purchase
- Real-time inventory tracking and management
- Stock management across categories and subcategories
- Admin and stock manager interface for stock updates and monitoring
- Direct order fulfillment for customers
- Low stock alerts and notifications
\n### 5.4 Category Management
- Hierarchical category structure (Category → Subcategory → Service)
- Unified service grouping by name within categories
- Dynamic category display based on service type
- Category filtering and search functionality
- Main image assignment for each category
- Admin tools for category organization and image uploads
\n### 5.5 Pricing & Profit System
- **Provider API Integration**: Import services from external provider APIs
- **Automatic Profit Markup**: Apply configurable profit percentage (e.g., 10%) on provider prices
- **Custom Rate Engine**: Calculate final user prices based on user level discounts
- **Dynamic Price Updates**: Real-time price adjustments when provider prices or profit margins change
- **Price History Tracking**: Log all pricing changes for audit purposes
\n### 5.6 Currency & Language\n- Multi-currency payment support\n- Multi-language interface options
\n### 5.7 Advertisement System
- Image storage for promotional banners
- Automatic rotation mechanism for multiple ads
- Click tracking and analytics
- Admin control for banner scheduling and display order
- Reduced banner height for better user experience

### 5.8 API System Architecture
\n#### 5.8.1 Public API Infrastructure
- **RESTful API Design**: Standard REST architecture with JSON format
- **API Gateway**: Centralized API gateway for request routing and management
- **Load Balancing**: Distribute API requests across multiple servers
- **API Versioning System**: Support multiple API versions simultaneously
- **Request/Response Logging**: Complete logging of all API interactions
- **Error Handling Framework**: Standardized error codes and messages
- **API Documentation Generator**: Auto-generated interactive API documentation
- **Swagger/OpenAPI Integration**: OpenAPI 3.0 specification for API documentation
- **API Testing Suite**: Automated testing for all API endpoints
- **API Monitoring Dashboard**: Real-time monitoring of API performance and health

#### 5.8.2 API Security Layer
- **API Key Authentication**: Secure API key generation and validation
- **OAuth 2.0 Support**: Optional OAuth 2.0 authentication flow
- **JWT Token Management**: JSON Web Token for session management
- **Request Signing**: HMAC-SHA256 signature verification
- **Rate Limiting Engine**: Configurable rate limits per API key
- **IP Whitelisting**: Restrict API access by IP address
- **API Key Scopes**: Granular permission control per API key
- **Request Throttling**: Automatic throttling for excessive requests
- **API Firewall**: Filter malicious requests and attacks
- **Encryption**: End-to-end encryption for sensitive API data

#### 5.8.3 API Documentation System
- **Interactive Documentation Portal**: Similar to https://api.play4cards.com/api-docs
- **Try It Out Feature**: Test API endpoints directly from documentation
- **Code Examples**: Sample code in PHP, Python, JavaScript, cURL
- **Request/Response Schemas**: Detailed schema documentation
- **Authentication Guide**: Step-by-step authentication setup
- **Quick Start Tutorial**: Getting started guide for developers
- **Webhook Documentation**: Webhook setup and event documentation
- **Postman Collection**: Exportable Postman collection for testing
- **API Changelog**: Version history and breaking changes documentation

#### 5.8.4 Admin API v2
- RESTful API with granular permission control per API key
- API key generation and management
- Rate limiting and security controls
- API usage monitoring and analytics
\n### 5.9 Invoice System
- **PDF Generation**: Automatic invoice creation in PDF format
- **Invoice Details**: Order number, date, service details, amount, user information
- **Download Functionality**: Users can download invoices from order page
- **Invoice Storage**: Secure storage of all generated invoices
- **Invoice Numbering**: Sequential invoice number generation system
\n### 5.10 Advanced Order Management
- **Order Editing**: Edit order links and details
- **Order Resending**: Resend failed or incomplete orders
- **Partial Orders**: Set and manage partial order fulfillment
- **Order Pulling**: Pull orders from external sources or providers
- **Bulk Order Updates**: Update multiple orders simultaneously
- **Provider Charge Tracking**: View and track provider charges per order
- **External ID Management**: Manage external order identifiers
- **Provider Response Logging**: Log and view provider API responses
\n### 5.11 Refill & Cancellation System
- **Refill Task Queue**: Automated refill task management and processing
- **Refill Status Control**: Change and track refill request status
- **Cancel Request Handling**: Process and manage cancellation requests
- **Cancel Task Queue**: Automated cancel task management
- **Cancel Rejection**: Reject invalid or fraudulent cancellation requests
\n### 5.12 Affiliate & Reseller System
- **Affiliate Tracking**: Track referrals and conversions
- **Commission Calculation**: Automatic commission calculation based on sales
- **Child Panel Management**: Create and manage reseller sub-accounts
- **Hierarchical Permissions**: Set different permission levels for child panels
- **Revenue Sharing**: Configure revenue sharing models for resellers
\n### 5.13 Monitoring & Analytics
- **Real-time Dashboard**: Live metrics for orders, revenue, and user activity
- **Custom Reports**: Build custom reports with flexible date ranges and filters
- **Revenue Analytics**: Detailed financial reports with profit margins and trends
- **User Behavior Analytics**: Track user engagement and conversion funnels
- **Service Performance**: Monitor popular services and identify trends
- **System Health Monitoring**: Server uptime, response times, and error rates
- **Alert System**: Configurable alerts for critical events and thresholds
- **API Usage Analytics**: Track API request volumes, success rates, and error patterns
- **API Performance Metrics**: Monitor API response times and latency

## 6. Design Style\n
### 6.1 Visual Design\n- **Top Advertisement Banner**: Reduced-height horizontal moving banner displaying promotional photos with smooth scrolling animation
- **Search Field**: Positioned directly below the advertisement banner for easy access
- Card-based layout for categories with unified main images representing each service group
- Vibrant blue and purple gradient accents on clean backgrounds
- Smooth animations for category navigation and transitions
- Professional admin panel interface with clear data visualization and comprehensive navigation menu
- Organized settings sidebar with grouped configuration modules
- **API Documentation Portal**: Clean, developer-friendly interface with syntax highlighting and interactive elements

### 6.2 Interactive Elements
- **Advertisement Banner**: Auto-scrolling promotional photos with pause-on-hover functionality
- **Search Field**: Instant search with autocomplete suggestions
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

### 6.3 Theme Options
- Light mode: White background with soft shadows and colorful category cards with main images
- Dark mode: Deep dark background with neon highlights and glowing category borders
- Admin panel: Clean, data-focused interface with customizable dashboard widgets and organized navigation structure
- API Documentation: Developer-friendly theme with syntax highlighting and clear code examples
\n## 7. Reference Documentation
- API Documentation Reference: https://api.play4cards.com/api-docs
\n## 8. Reference Images
- Screenshot 2025-12-26 133441.png: Admin dashboard top navigation menu showing Users, Orders, Subscriptions, Drip-feed, Refill, Cancel, Services, Payments, Tickets, Affiliates, Child panels, Updates, Reports, Appearance, and Settings modules
- Screenshot 2025-12-26 133448.png: Admin settings sidebar showing General, Providers, Payments Modules, Integrations, Notifications, Bonuses, Signup form, and Ticket form configuration sections