import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import WalletPage from './pages/WalletPage';
import AddBalancePage from './pages/AddBalancePage';
import OrdersPage from './pages/OrdersPage';
import SecurityPage from './pages/SecurityPage';
import AboutPage from './pages/AboutPage';
import ApiDocsPage from './pages/ApiDocsPage';
import SupportPage from './pages/SupportPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import NotificationsPage from './pages/NotificationsPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminManagementPage from './pages/AdminManagementPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    visible: true,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false,
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
    visible: false,
    requireAuth: true,
  },
  {
    name: 'Wallet',
    path: '/wallet',
    element: (
      <ProtectedRoute>
        <WalletPage />
      </ProtectedRoute>
    ),
    visible: false,
    requireAuth: true,
  },
  {
    name: 'Add Balance',
    path: '/add-balance',
    element: (
      <ProtectedRoute>
        <AddBalancePage />
      </ProtectedRoute>
    ),
    visible: false,
    requireAuth: true,
  },
  {
    name: 'My Orders',
    path: '/orders',
    element: (
      <ProtectedRoute>
        <OrdersPage />
      </ProtectedRoute>
    ),
    visible: false,
    requireAuth: true,
  },
  {
    name: 'Notifications',
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    ),
    visible: false,
    requireAuth: true,
  },
  {
    name: 'Security',
    path: '/security',
    element: (
      <ProtectedRoute>
        <SecurityPage />
      </ProtectedRoute>
    ),
    visible: false,
    requireAuth: true,
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    visible: false,
    requireAdmin: true,
  },
  {
    name: 'Admin Dashboard Old',
    path: '/admin/old',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
    visible: false,
    requireAdmin: true,
  },
  {
    name: 'Admin Management',
    path: '/admin/manage',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminManagementPage />
      </ProtectedRoute>
    ),
    visible: false,
    requireAdmin: true,
  },
  {
    name: 'About Us',
    path: '/about',
    element: <AboutPage />,
    visible: true,
  },
  {
    name: 'API Documentation',
    path: '/api-docs',
    element: <ApiDocsPage />,
    visible: true,
  },
  {
    name: 'Support',
    path: '/support',
    element: <SupportPage />,
    visible: true,
  },
  {
    name: 'Payment Success',
    path: '/payment-success',
    element: (
      <ProtectedRoute>
        <PaymentSuccessPage />
      </ProtectedRoute>
    ),
    visible: false,
    requireAuth: true,
  },
];

export default routes;
