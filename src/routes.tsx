import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import WalletPage from './pages/WalletPage';
import AddBalancePage from './pages/AddBalancePage';
import OrdersPage from './pages/OrdersPage';
import SecurityPage from './pages/SecurityPage';
import AboutPage from './pages/AboutPage';
import APIDocsPage from './pages/APIDocsPage';
import SupportPage from './pages/SupportPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import NotificationsPage from './pages/NotificationsPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
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
    element: <CheckoutPage />,
    visible: false,
  },
  {
    name: 'Wallet',
    path: '/wallet',
    element: <WalletPage />,
    visible: false,
  },
  {
    name: 'Add Balance',
    path: '/add-balance',
    element: <AddBalancePage />,
    visible: false,
  },
  {
    name: 'My Orders',
    path: '/orders',
    element: <OrdersPage />,
    visible: false,
  },
  {
    name: 'Notifications',
    path: '/notifications',
    element: <NotificationsPage />,
    visible: false,
  },
  {
    name: 'Security',
    path: '/security',
    element: <SecurityPage />,
    visible: false,
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboardPage />,
    visible: false,
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
    element: <APIDocsPage />,
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
    element: <PaymentSuccessPage />,
    visible: false,
  },
];

export default routes;
