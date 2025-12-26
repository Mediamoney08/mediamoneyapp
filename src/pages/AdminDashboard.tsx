import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getProfile } from '@/db/api';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Image,
  Key,
  Settings,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  UserCheck,
  Calendar,
  RefreshCw,
  XCircle,
  Ticket,
  UserPlus,
  Layers,
  Bell,
  BarChart3,
  Palette,
  Gift,
  Zap,
  Shield,
  Activity,
  Mail,
  Server
} from 'lucide-react';

// Import admin components
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductManagement from '@/components/admin/ProductManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import UserManagement from '@/components/admin/UserManagement';
import PaymentVerification from '@/components/admin/PaymentVerification';
import StockManagement from '@/components/admin/StockManagement';
import BannerManagement from '@/components/admin/BannerManagement';
import ApiKeyManagement from '@/components/admin/ApiKeyManagement';
import SiteSettingsManagement from '@/components/admin/SiteSettingsManagement';
import ProviderManagement from '@/components/admin/ProviderManagement';
import UserLevelManagement from '@/components/admin/UserLevelManagement';
import CustomRateManagement from '@/components/admin/CustomRateManagement';
import ProfitMarginSettings from '@/components/admin/ProfitMarginSettings';
import SubscriptionsManagement from '@/components/admin/SubscriptionsManagement';
import DripFeedManagement from '@/components/admin/DripFeedManagement';
import RefillManagement from '@/components/admin/RefillManagement';
import ServicesManagement from '@/components/admin/ServicesManagement';
import TicketsManagement from '@/components/admin/TicketsManagement';
import AffiliatesManagement from '@/components/admin/AffiliatesManagement';
import ChildPanelsManagement from '@/components/admin/ChildPanelsManagement';
import UpdatesManagement from '@/components/admin/UpdatesManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import AppearanceSettings from '@/components/admin/AppearanceSettings';
import ModulesManagement from '@/components/admin/ModulesManagement';
import IntegrationsManagement from '@/components/admin/IntegrationsManagement';
import NotificationsManagement from '@/components/admin/NotificationsManagement';
import BonusesManagement from '@/components/admin/BonusesManagement';
import SignupFormSettings from '@/components/admin/SignupFormSettings';
import TicketFormSettings from '@/components/admin/TicketFormSettings';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import ActivityLogsManagement from '@/components/admin/ActivityLogsManagement';
import SecurityDashboard from '@/components/admin/SecurityDashboard';
import SystemMonitoring from '@/components/admin/SystemMonitoring';
import EmailTemplatesManagement from '@/components/admin/EmailTemplatesManagement';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const profile = await getProfile(user.id);
      if (!profile || profile.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin dashboard',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify admin access',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your recharge hub platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-auto min-w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="drip-feed" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Drip-feed</span>
            </TabsTrigger>
            <TabsTrigger value="refill" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refill</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              <span className="hidden sm:inline">Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Affiliates</span>
            </TabsTrigger>
            <TabsTrigger value="child-panels" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Child Panels</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Updates</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <DashboardOverview />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <OrderManagement />
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <SubscriptionsManagement />
        </TabsContent>

        {/* Drip-feed Tab */}
        <TabsContent value="drip-feed" className="space-y-6">
          <DripFeedManagement />
        </TabsContent>

        {/* Refill Tab */}
        <TabsContent value="refill" className="space-y-6">
          <RefillManagement />
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Tabs defaultValue="services" className="space-y-4">
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="stock">Stock</TabsTrigger>
            </TabsList>
            <TabsContent value="services">
              <ServicesManagement />
            </TabsContent>
            <TabsContent value="categories">
              <CategoryManagement />
            </TabsContent>
            <TabsContent value="stock">
              <StockManagement />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <PaymentVerification />
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <TicketsManagement />
        </TabsContent>

        {/* Affiliates Tab */}
        <TabsContent value="affiliates" className="space-y-6">
          <AffiliatesManagement />
        </TabsContent>

        {/* Child Panels Tab */}
        <TabsContent value="child-panels" className="space-y-6">
          <ChildPanelsManagement />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">Security Dashboard</TabsTrigger>
              <TabsTrigger value="admins">Admin Users</TabsTrigger>
              <TabsTrigger value="activity">Activity Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <SecurityDashboard />
            </TabsContent>
            <TabsContent value="admins">
              <AdminUserManagement />
            </TabsContent>
            <TabsContent value="activity">
              <ActivityLogsManagement />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <SystemMonitoring />
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates" className="space-y-6">
          <UpdatesManagement />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <ReportsManagement />
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettings />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="email-templates">Email Templates</TabsTrigger>
              <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
              <TabsTrigger value="signup-form">Signup Form</TabsTrigger>
              <TabsTrigger value="ticket-form">Ticket Form</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <SiteSettingsManagement />
            </TabsContent>
            <TabsContent value="providers">
              <ProviderManagement />
            </TabsContent>
            <TabsContent value="payments">
              <Tabs defaultValue="methods" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="methods">Payment Methods</TabsTrigger>
                  <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                  <TabsTrigger value="rates">Custom Rates</TabsTrigger>
                  <TabsTrigger value="margins">Profit Margins</TabsTrigger>
                </TabsList>
                <TabsContent value="methods">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Configure payment gateways and methods</CardDescription>
                    </CardHeader>
                  </Card>
                </TabsContent>
                <TabsContent value="api-keys">
                  <ApiKeyManagement />
                </TabsContent>
                <TabsContent value="rates">
                  <CustomRateManagement />
                </TabsContent>
                <TabsContent value="margins">
                  <ProfitMarginSettings />
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="modules">
              <ModulesManagement />
            </TabsContent>
            <TabsContent value="integrations">
              <IntegrationsManagement />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsManagement />
            </TabsContent>
            <TabsContent value="email-templates">
              <EmailTemplatesManagement />
            </TabsContent>
            <TabsContent value="bonuses">
              <BonusesManagement />
            </TabsContent>
            <TabsContent value="signup-form">
              <SignupFormSettings />
            </TabsContent>
            <TabsContent value="ticket-form">
              <TicketFormSettings />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
