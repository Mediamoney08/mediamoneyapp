import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/db/supabase';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  failedOrders: number;
  pendingPayments: number;
}

interface RecentOrder {
  id: string;
  user_email: string;
  product_name: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    failedOrders: 0,
    pendingPayments: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get total revenue and order counts
      const { data: orders } = await supabase
        .from('orders')
        .select('amount, status');

      const totalRevenue = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
      const failedOrders = orders?.filter(o => o.status === 'failed').length || 0;

      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total products
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get pending payments
      const { count: pendingPaymentsCount } = await supabase
        .from('payment_proofs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get recent orders with user and product info
      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select(`
          id,
          amount,
          status,
          created_at,
          profiles!orders_user_id_fkey(email),
          products!orders_product_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const formattedOrders = recentOrdersData?.map(order => ({
        id: order.id,
        user_email: (order.profiles as any)?.email || 'Unknown',
        product_name: (order.products as any)?.name || 'Unknown',
        amount: order.amount,
        status: order.status,
        created_at: order.created_at,
      })) || [];

      setStats({
        totalRevenue,
        totalOrders,
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
        pendingOrders,
        completedOrders,
        failedOrders,
        pendingPayments: pendingPaymentsCount || 0,
      });

      setRecentOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Orders</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No orders yet
              </p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.product_name}</p>
                    <p className="text-xs text-muted-foreground">{order.user_email}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">${order.amount.toFixed(2)}</p>
                    <p className={`text-xs ${
                      order.status === 'completed' ? 'text-green-500' :
                      order.status === 'pending' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Payments Alert */}
      {stats.pendingPayments > 0 && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-500">Pending Payment Verifications</CardTitle>
            <CardDescription>
              You have {stats.pendingPayments} payment proof(s) waiting for verification
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
