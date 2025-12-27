import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Send, List } from 'lucide-react';
import BroadcastNotification from './BroadcastNotification';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAllNotifications } from '@/db/api';
import type { Notification } from '@/types/types';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getAllNotifications();
      setNotifications(data.slice(0, 100)); // Show last 100 notifications
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'order_completed':
        return 'bg-green-500';
      case 'order_failed':
      case 'order_rejected':
        return 'bg-red-500';
      case 'provider_reply':
        return 'bg-cyan-500';
      case 'payment_approved':
      case 'balance_added':
        return 'bg-blue-500';
      case 'payment_rejected':
        return 'bg-orange-500';
      case 'service_added':
      case 'service_available':
        return 'bg-purple-500';
      case 'price_decreased':
        return 'bg-green-600';
      case 'price_increased':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Notifications Management</h2>
          <p className="text-muted-foreground">
            Send broadcast notifications and view notification history
          </p>
        </div>
      </div>

      <Tabs defaultValue="broadcast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="broadcast" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Broadcast
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="broadcast">
          <BroadcastNotification />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                Recent notifications sent to users (last 100)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  No notifications found
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${getNotificationTypeColor(
                                notification.type
                              )} text-white border-0`}
                            >
                              {notification.type.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {notification.title}
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {notification.message}
                          </TableCell>
                          <TableCell>
                            {notification.is_read ? (
                              <Badge variant="outline">Read</Badge>
                            ) : (
                              <Badge variant="default">Unread</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true }
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
