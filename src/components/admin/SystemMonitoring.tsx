import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Database, 
  Activity, 
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Clock
} from 'lucide-react';

interface SystemMetrics {
  database_size: string;
  total_users: number;
  total_orders: number;
  total_products: number;
  active_sessions: number;
  api_calls_today: number;
  uptime: string;
  last_backup: string;
}

export default function SystemMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    database_size: '0 MB',
    total_users: 0,
    total_orders: 0,
    total_products: 0,
    active_sessions: 0,
    api_calls_today: 0,
    uptime: '0 days',
    last_backup: 'Never',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      // Simulate loading metrics
      // In production, these would come from actual system monitoring
      setMetrics({
        database_size: '245 MB',
        total_users: 1250,
        total_orders: 3420,
        total_products: 156,
        active_sessions: 42,
        api_calls_today: 15678,
        uptime: '15 days',
        last_backup: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
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
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">
                Operational
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All systems running normally
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime}</div>
            <p className="text-xs text-muted-foreground">
              System uptime
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.active_sessions}</div>
            <p className="text-xs text-muted-foreground">
              Current active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.api_calls_today.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Today's API requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Database & Storage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Statistics
            </CardTitle>
            <CardDescription>
              Current database metrics and usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Size</span>
              <Badge variant="secondary">{metrics.database_size}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Users</span>
              <Badge variant="secondary">{metrics.total_users.toLocaleString()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Orders</span>
              <Badge variant="secondary">{metrics.total_orders.toLocaleString()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Products</span>
              <Badge variant="secondary">{metrics.total_products.toLocaleString()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Backup</span>
              <Badge variant="outline">{metrics.last_backup}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Resource Usage
            </CardTitle>
            <CardDescription>
              System resource utilization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  CPU Usage
                </span>
                <Badge variant="secondary">45%</Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <MemoryStick className="h-4 w-4" />
                  Memory Usage
                </span>
                <Badge variant="secondary">62%</Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Storage Usage
                </span>
                <Badge variant="secondary">38%</Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Network Usage
                </span>
                <Badge variant="secondary">28%</Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>
            Recent system notifications and warnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Badge variant="default" className="bg-green-500">INFO</Badge>
              <span className="text-sm">System backup completed successfully</span>
              <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Badge variant="secondary">WARNING</Badge>
              <span className="text-sm">High API usage detected</span>
              <span className="text-xs text-muted-foreground ml-auto">5 hours ago</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Badge variant="default" className="bg-green-500">INFO</Badge>
              <span className="text-sm">Database optimization completed</span>
              <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}